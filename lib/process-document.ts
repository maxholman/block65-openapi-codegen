/* eslint-disable no-restricted-syntax */
import { join, relative } from 'node:path';
import $RefParser from '@apidevtools/json-schema-ref-parser';
import camelcase from 'camelcase';
import type { OpenAPIV3 } from 'openapi-types';
import toposort from 'toposort';
import {
  IndentationText,
  InterfaceDeclaration,
  Project,
  QuoteKind,
  ScriptTarget,
  StructureKind,
  SyntaxKind,
  TypeAliasDeclaration,
  VariableDeclarationKind,
  Writers,
  Scope,
  Node,
} from 'ts-morph';
import { registerTypesFromSchema, schemaToType } from './process-schema.js';
import {
  getDependents,
  maybeJsDocDescription,
  pascalCase,
  wordWrap,
} from './utils.js';

// the union/intersect helpers keep typescript happy due to ts-morph typings
function createIntersection(...types: (string | undefined)[]) {
  // create a type  of all the inputs
  const [type1, type2, ...typeX] = types.filter((t): t is string => !!t);
  return (
    (type1 && type2
      ? Writers.intersectionType(type1, type2, ...typeX)
      : type1) || 'void'
  );
}

// the union/intersect helpers keep typescript happy due to ts-morph typings
function createUnion(...types: (string | undefined)[]) {
  // create a type  of all the inputs
  const [type1, type2, ...typeX] = types.filter((t): t is string => !!t);
  return type1 && type2 ? Writers.unionType(type1, type2, ...typeX) : type1;
}

function isVoidKeyword(type: TypeAliasDeclaration) {
  return type?.getTypeNode()?.getKindName() === 'VoidKeyword';
}

export async function processOpenApiDocument(
  outputDir: string,
  schema: OpenAPIV3.Document,
  tags?: string[] | undefined,
) {
  const project = new Project({
    compilerOptions: {
      target: ScriptTarget.ES2022,
      declaration: true,
    },
    manipulationSettings: {
      quoteKind: QuoteKind.Single,
      indentationText: IndentationText.TwoSpaces,
      useTrailingCommas: true,
    },
  });

  const commandsFile = project.createSourceFile(
    join(outputDir, 'commands.ts'),
    '',
    {
      overwrite: true,
    },
  );

  const typesFile = project.createSourceFile(
    join(outputDir, 'types.ts'),
    '',

    {
      overwrite: true,
    },
  );

  const clientFile = project.createSourceFile(join(outputDir, 'main.ts'), '', {
    overwrite: true,
  });

  const outputTypes: (InterfaceDeclaration | TypeAliasDeclaration)[] = [];

  const refs = await $RefParser.default.resolve(schema);

  commandsFile.addImportDeclaration({
    namedImports: [
      // command classes
      'Command',
    ],
    moduleSpecifier: '@block65/rest-client',
  });

  commandsFile.addImportDeclaration({
    namedImports: [
      // legacy request method functions
      'RequestMethodCaller',
    ],
    moduleSpecifier: '@block65/rest-client',
    isTypeOnly: true,
  });

  commandsFile.addImportDeclaration({
    namedImports: ['Jsonifiable'],
    moduleSpecifier: 'type-fest',
    isTypeOnly: true,
  });

  typesFile.addImportDeclaration({
    namedImports: ['Jsonifiable'],
    moduleSpecifier: 'type-fest',
    isTypeOnly: true,
  });

  typesFile.addImportDeclaration({
    namedImports: ['JsonifiableObject'],
    moduleSpecifier: 'type-fest/source/jsonifiable.js',
    isTypeOnly: true,
  });

  const typesModuleSpecifier =
    `./${typesFile.getBaseNameWithoutExtension()}.js` ||
    relative(commandsFile.getDirectoryPath(), typesFile.getFilePath());

  const typesImportDecl =
    commandsFile.getImportDeclaration(
      (decl) =>
        decl.getModuleSpecifier().getLiteralValue() === typesModuleSpecifier,
    ) ||
    commandsFile.addImportDeclaration({
      moduleSpecifier: typesModuleSpecifier,
      namedImports: [],
    });

  const ensureImport = (
    type: TypeAliasDeclaration | InterfaceDeclaration | undefined,
    alias?: string,
  ) => {
    if (
      type &&
      !typesImportDecl
        .getNamedImports()
        .some((namedImport) => namedImport.getName() === type.getName())
    ) {
      typesImportDecl?.addNamedImport({
        name: type.getName(),
        ...(alias && { alias }),
      });
      typesImportDecl.setIsTypeOnly(true);
    }
  };

  const typesAndInterfaces = new Map<
    string,
    InterfaceDeclaration | TypeAliasDeclaration
  >();

  const schemaGraph = Object.entries(schema.components?.schemas || {}).flatMap(
    ([schemaName, schemaObject]) => {
      const deps = getDependents(schemaObject);
      return deps.map((dep): [string, string] => [
        `#/components/schemas/${schemaName}`,
        dep,
      ]);
    },
  );

  const sorted = toposort(schemaGraph).reverse();

  const sortedSchemas = Object.entries(schema.components?.schemas || {}).sort(
    ([a], [b]) =>
      sorted.findIndex(
        (schemaName) => schemaName === `#/components/schemas/${a}`,
      ) -
      sorted.findIndex(
        (schemaName) => schemaName === `#/components/schemas/${b}`,
      ),
  );

  for (const [schemaName, schemaObject] of sortedSchemas) {
    registerTypesFromSchema(
      typesAndInterfaces,
      typesFile,
      schemaName,
      schemaObject,
    );
  }

  for (const [path, pathItemObject] of Object.entries(schema.paths || {})) {
    if (pathItemObject) {
      for (const [method, operationObject] of Object.entries(
        pathItemObject,
      ).filter(
        ([, o]) =>
          !tags ||
          (typeof o === 'object' && 'tags' in o
            ? o.tags.some((t) => tags.includes(t))
            : false),
      )) {
        if (
          typeof operationObject === 'object' &&
          'operationId' in operationObject
        ) {
          /** @deprecated */
          const func = commandsFile.addFunction({
            name: camelcase(
              `${operationObject.operationId.replace(/command$/i, '')} Command`,
            ),
            isExported: true,
            isAsync: false,
          });

          const pathParameterNames: string[] = [];

          const classDeclaration = commandsFile.addClass({
            name: pascalCase(
              `${operationObject.operationId.replace(/command$/i, '')} Command`,
            ),
            isExported: true,
            extends: 'Command',
            properties: [
              {
                name: 'method',
                initializer: Writers.assertion((w) => w.quote(method), 'const'),
                hasOverrideKeyword: true,
                scope: Scope.Public,
              },
            ],
          });
          const ctor = classDeclaration.addConstructor();

          // classs.getExtends()?.addTypeArguments(['never', 'never']);

          const jsDocStructure = {
            description: `\n${wordWrap(
              operationObject.description || operationObject.operationId,
            )}\n\n`,

            tags: [
              ...(operationObject.summary
                ? [
                    {
                      tagName: 'summary',
                      text: wordWrap(operationObject.summary),
                    },
                  ]
                : []),
              ...(operationObject.deprecated
                ? [
                    {
                      tagName: 'deprecated',
                    },
                  ]
                : []),
            ],
          };

          const jsdoc = func.addJsDoc(jsDocStructure);
          classDeclaration.addJsDoc(jsDocStructure);

          if (operationObject.deprecated) {
            jsdoc.addTag({
              tagName: 'deprecated',
            });
          }

          const requestBodyObject =
            operationObject.requestBody &&
            !('$ref' in operationObject.requestBody)
              ? operationObject.requestBody
              : undefined;

          const queryParameters: OpenAPIV3.ParameterObject[] = [];

          const parameters = [
            ...(operationObject.parameters || []),
            ...(pathItemObject.parameters || []),
          ];

          for (const parameter of parameters) {
            const resolvedParameter =
              '$ref' in parameter
                ? (refs.get(parameter.$ref) as any)
                : parameter;

            const parameterName = camelcase(resolvedParameter.name);

            if (resolvedParameter.in === 'path') {
              func.addParameter({
                name: parameterName,
                type: 'string',
              });

              pathParameterNames.push(parameterName);

              jsdoc.addTag({
                tagName: 'param',
                text: wordWrap(
                  `${parameterName} {String} ${
                    resolvedParameter.description || ''
                  }`,
                ).trim(),
              });
            }

            if (resolvedParameter.in === 'query') {
              queryParameters.push(resolvedParameter);
            }
          }

          const queryType =
            queryParameters.length > 0
              ? typesFile.addTypeAlias({
                  name: pascalCase(
                    `${classDeclaration.getName() || 'INVALID'}Query`,
                  ),
                  isExported: true,
                  type: Writers.objectType({
                    properties: queryParameters.map((qp) => {
                      if (!qp.schema) {
                        return {
                          name: camelcase(qp.name),
                          hasQuestionToken: false,
                        };
                      }

                      const type = schemaToType(
                        typesAndInterfaces,
                        qp.required ? { required: [qp.name] } : {},
                        qp.name,
                        qp.schema,
                        {
                          // query parameters can't be strictly "boolean"
                          booleanAsStringish: true,
                          integerAsStringish: true,
                        },
                      );

                      return type;
                    }),
                  }),
                })
              : undefined;

          const hasRequiredQueryParam = queryParameters.some((p) => p.required);

          ensureImport(queryType);

          const requestBodyObjectJson =
            requestBodyObject?.content['application/json'];

          const requestBodyIsArray =
            requestBodyObjectJson?.schema &&
            'type' in requestBodyObjectJson.schema &&
            requestBodyObjectJson.schema?.type === 'array';

          // get the ref from the schema or the array items
          const requestBodyObjectJsonSchema =
            (requestBodyObjectJson?.schema &&
              (('$ref' in requestBodyObjectJson.schema &&
                requestBodyObjectJson?.schema) ||
                (requestBodyIsArray &&
                  'items' in requestBodyObjectJson.schema &&
                  '$ref' in requestBodyObjectJson.schema.items &&
                  requestBodyObjectJson.schema.items))) ||
            undefined;

          const bodyType =
            requestBodyObjectJsonSchema &&
            typesAndInterfaces.get(requestBodyObjectJsonSchema.$ref);

          ensureImport(bodyType);

          const paramsParamName = 'parameters';

          if (bodyType || queryType) {
            const paramsHasQuestionToken = !bodyType && !hasRequiredQueryParam;

            const pathParamsProperties = [
              ...(bodyType
                ? [
                    {
                      name: 'body',
                      type: `${bodyType.getName()}${
                        requestBodyIsArray ? '[]' : ''
                      }`,
                      hasQuestionToken: false,
                    },
                  ]
                : []),
              ...(queryType
                ? [
                    {
                      name: 'query',
                      type: queryType.getName(),
                      hasQuestionToken: !hasRequiredQueryParam,
                    },
                  ]
                : []),
            ];

            if (pathParamsProperties.length > 0) {
              func.addParameter({
                name: paramsParamName,
                hasQuestionToken: paramsHasQuestionToken,
                type: Writers.objectType({
                  properties: pathParamsProperties,
                }),
              });
            }
          }

          if (bodyType) {
            jsdoc.addTag({
              tagName: 'param',
              text: wordWrap(
                `${paramsParamName}.body {${bodyType.getName()}} ${maybeJsDocDescription()}`,
              ).trim(),
            });
          }

          const paramsType =
            pathParameterNames.length > 0
              ? typesFile.addTypeAlias({
                  name: pascalCase(
                    `${classDeclaration.getName() || 'INVALID'}Params`,
                  ),
                  type: Writers.objectType({
                    properties: pathParameterNames.map((p) => ({
                      name: p,
                      type: 'string',
                    })),
                  }),
                  isExported: true,
                })
              : null;

          const inputType = typesFile.addTypeAlias({
            name: pascalCase(`${classDeclaration.getName() || 'INVALID'}Input`),
            type: createIntersection(
              bodyType?.getName(),
              queryType?.getName(),
              paramsType?.getName(),
            ),
            isExported: true,
          });

          const inputBodyType = typesFile.addTypeAlias({
            name: pascalCase(`${classDeclaration.getName() || 'INVALID'}Body`),
            type: bodyType?.getName() || 'void', // createIntersection(bodyType?.getName(), queryType?.getName()),
            isExported: true,
          });

          ensureImport(inputType);
          ensureImport(inputBodyType);

          // CommandInput
          classDeclaration
            .getExtends()
            ?.addTypeArgument(
              isVoidKeyword(inputType) ? 'void' : inputType.getName(),
            );

          if (!isVoidKeyword(inputType)) {
            ctor.addParameter({
              name: 'input',
              type: inputType.getName(),
            });
          }

          // if (queryType && !isVoidKeyword(queryType)) {
          //   ctor.addParameter({
          //     name: 'query',
          //     type: queryType.getName(),
          //   });
          // }

          for (const queryParam of queryParameters) {
            const queryParameterName = camelcase(queryParam.name);

            jsdoc.addTag({
              tagName: 'param',
              text: wordWrap(
                `${paramsParamName}.query.${queryParameterName}${
                  queryParam.required ? '' : '?'
                } {String} ${maybeJsDocDescription(
                  queryParam.deprecated && 'DEPRECATED',
                  queryParam.description,
                  String(queryParam.example || ''),
                )}`,
              ).trim(),
            });
          }

          // this is just like a 204 response.
          if (
            !operationObject.responses ||
            Object.keys(operationObject.responses).length === 0
          ) {
            func.setReturnType('RequestMethodCaller<void>');
            classDeclaration.getExtends()?.addTypeArgument('void');
          }

          for (const [statusCode, response] of Object.entries(
            operationObject.responses,
          ).filter(([s]) => s.startsWith('2'))) {
            // early out if response is 204
            if (statusCode === '204') {
              func.setReturnType('RequestMethodCaller<void>');
              classDeclaration.getExtends()?.addTypeArgument('void');
              break;
            }

            // we dont support refs as response objects
            if ('$ref' in response) {
              break;
            }

            const jsonResponse = response.content?.['application/json'];

            const arrayRef =
              jsonResponse?.schema &&
              'items' in jsonResponse.schema &&
              '$ref' in jsonResponse.schema.items &&
              jsonResponse.schema.items.$ref;

            const regularRef =
              jsonResponse?.schema &&
              '$ref' in jsonResponse.schema &&
              jsonResponse.schema.$ref;

            const outputRef = arrayRef || regularRef;

            if (outputRef) {
              const outputType = typesAndInterfaces.get(outputRef);

              // const outputTypeAlias = `${
              //   outputType?.getName() || 'void'
              // }Output`;
              // ensureImport(outputType, outputTypeAlias);

              if (outputType) {
                outputTypes.push(outputType);
                ensureImport(outputType);
              }

              const outputTypeName = `${outputType?.getName()}${
                arrayRef ? '[]' : ''
              }`;

              const retVal = `RequestMethodCaller<${outputTypeName}>`;

              func.setReturnType(retVal);
              classDeclaration.getExtends()?.addTypeArgument(outputTypeName);

              jsdoc.addTag({
                tagName: 'returns',
                text: `{${retVal}} HTTP ${statusCode}`,
              });
            } else {
              const retVal = 'RequestMethodCaller<void>';

              func.setReturnType(retVal);
              classDeclaration.getExtends()?.addTypeArgument('void');

              jsdoc.addTag({
                tagName: 'returns',
                text: `{${retVal}} HTTP ${statusCode}`,
              });
            }
          }

          // body
          classDeclaration
            .getExtends()
            ?.addTypeArgument(inputBodyType.getName());

          // query
          if (queryType) {
            classDeclaration.getExtends()?.addTypeArgument(queryType.getName());
          }

          const pathname = `\`${path
            .replaceAll(/\{(\w+)\}/g, camelcase)
            .replaceAll(/{/g, '${')}\``;

          func.addVariableStatement({
            declarationKind: VariableDeclarationKind.Const,
            declarations: [
              {
                name: 'req',
                initializer: Writers.object({
                  method: Writers.assertion((w) => w.quote(method), 'const'),
                  pathname,
                  ...(queryType && {
                    query: `${paramsParamName}?.query`,
                  }),
                  ...(bodyType && { body: `${paramsParamName}.body` }),
                }),
              },
            ],
          });

          func.addStatements((writer) => {
            writer.writeLine(
              'return (requestMethod, options) => requestMethod(req, options);',
            );
          });

          const bodyName = 'body';
          const ctorArgName = ctor.getParameters()[0]?.getName() || 'never';
          // const hasParams = paramsType && !isVoidKeyword(paramsType);
          const hasBody = !isVoidKeyword(inputBodyType);
          const hasQuery = queryType && !isVoidKeyword(queryType);

          const queryParameterNames = queryParameters.map((q) => q.name);

          const varsToDestructure = [
            ...pathParameterNames,
            ...queryParameterNames,
          ];

          ctor.addStatements([
            !isVoidKeyword(inputType)
              ? {
                  kind: StructureKind.VariableStatement,
                  declarationKind: VariableDeclarationKind.Const,
                  declarations: [
                    {
                      kind: StructureKind.VariableDeclaration,
                      initializer: ctorArgName,
                      name:
                        varsToDestructure.length > 0
                          ? `{${[
                              ...varsToDestructure,
                              hasBody || hasQuery ? `...${bodyName}` : '',
                            ].join(',')} }`
                          : bodyName,
                    },
                  ],
                }
              : '// no input parameters',
            'super();',
          ]);

          const superKeyword = ctor.getFirstDescendantByKind(
            SyntaxKind.SuperKeyword,
          );

          const callExpr = superKeyword?.getParentIfKindOrThrow(
            SyntaxKind.CallExpression,
          );

          // type narrowing
          if (Node.isCallExpression(callExpr)) {
            callExpr.addArguments(
              hasBody || hasQuery
                ? [
                    pathname,
                    hasBody ? bodyName : 'undefined',
                    ...(hasQuery
                      ? [`{${queryParameterNames.join(', ')}}`]
                      : []),
                  ]
                : [pathname],
            );
          }
        }
      }
    }
  }

  const isInput = (t: TypeAliasDeclaration | InterfaceDeclaration) =>
    t.getName()?.endsWith('Input');
  // const isOutput = (t: string) => t.endsWith('Output');

  const inputTypes = typesFile.getTypeAliases().filter((t) => isInput(t));
  const inputUnion = createUnion(
    ...new Set(inputTypes.map((t) => t.getName())),
  );
  const outputUnion = createUnion(
    ...new Set(outputTypes.map((t) => t.getName())),
  );

  const allInputs = inputUnion
    ? clientFile.addTypeAlias({
        name: 'AllInputs',
        type: inputUnion,
      })
    : undefined;

  const allOutputs = outputUnion
    ? clientFile.addTypeAlias({
        name: 'AllOutputs',
        type: outputUnion,
      })
    : undefined;

  const serviceClientClassName = 'RestServiceClient';
  const fetcherName = 'createIsomorphicFetcher';
  const configType = 'RestServiceClientConfig';

  clientFile.addImportDeclarations([
    {
      moduleSpecifier: '@block65/rest-client',
      namedImports: [
        serviceClientClassName,
        fetcherName,
        {
          name: configType,
          isTypeOnly: true,
        },
      ],
    },
  ]);

  clientFile.addImportDeclaration({
    moduleSpecifier: typesModuleSpecifier,
    namedImports: [...new Set([...inputTypes, ...outputTypes])].map((t) => ({
      name: t.getName(),
      isTypeOnly: true,
    })),
  });

  const clientClassDeclaration = clientFile.addClass({
    name: pascalCase(schema.info.title, 'RestClient'),
    isExported: true,
    extends: `${serviceClientClassName}<${allInputs?.getName() || 'void'}, ${
      allOutputs?.getName() || 'void'
    }>`,
  });

  const ctor = clientClassDeclaration.addConstructor();

  const baseUrl = ctor.addParameter({
    name: 'baseUrl',
    initializer: `new URL('${new URL(
      `${schema.servers?.[0]?.url || 'https://api.example.com'}/`,
    )}')`,
  });

  const fetcherParam = ctor.addParameter({
    name: 'fetcher',
    // type: fetcherMethodType,
    initializer: `${fetcherName}()`,
  });

  const configParam = ctor.addParameter({
    name: 'config',
    type: configType,
    hasQuestionToken: true,
  });

  ctor.addStatements(['super();']);

  const superKeyword = ctor.getFirstDescendantByKind(SyntaxKind.SuperKeyword);
  const callExpr = superKeyword?.getParentIfKindOrThrow(
    SyntaxKind.CallExpression,
  );

  // type narrowing
  if (Node.isCallExpression(callExpr)) {
    callExpr?.addArguments([
      baseUrl.getName(),
      fetcherParam.getName(),
      configParam.getName(),
    ]);
  }

  return { commandsFile, typesFile, clientFile };
}
