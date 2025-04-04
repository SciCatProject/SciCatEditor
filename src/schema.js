import { traverse } from './util.js';


/**
 * Downloads the full API schema
 */
export async function fetchSwaggerSchema() {
    const swagger_url = "https://www.scicatproject.org/api-documentation/swagger.json";
    return fetch(swagger_url)
        .then(response => response.json())
}

/**
 * Fixes the raw Swagger schema so that more accurately reflects the requirements of
 * datasetInjestor
 */
export function fixSchema(schema) {
    // make auto-filled fields optional
    schema.definitions.RawDataset.required = schema.definitions.RawDataset.required.filter(
        (v) => ["pid", 'contactEmail', 'creationTime'].indexOf(v) < 0);
    traverse(schema, (node, path) => {
        // "double" format is not recognized by ajv
        if(node["format"] == "double") {
            delete node["format"];
        }
    });
    return schema;
}

/**
 * Takes definitions from an input schema, and makes a new schema validating against
 * one of those definitions.
 * @param {*} schema Input schema, used only for schema["definitions"]
 * @param {string} term Specific definition to use (e.g. "Dataset")
 */
export function makeConcreteSchema(schema, term) {
    return {
        "$ref": "#/definitions/" + term,
        "definitions": schema.definitions,
    };
}

/**
 * Returns a map from each term to a concrete schema validating that term
 * @param {Schema} schema
 * @param {Array} terms
 */
function schemaMapping(schema, terms) {
    return terms.reduce( (schemas, definition) => {
        schemas[definition] = makeConcreteSchema(schema, definition);
        return schemas;
    }, {});
}

/**
 * Promise yielding the (fixed) swagger schema
 */
export const fixedSchema = fetchSwaggerSchema().then(swagger_data => fixSchema(swagger_data));

/**
 * Promise yielding a mapping from
 */
export const datasetSchemas = fixedSchema.then(fixed =>
    schemaMapping(fixed, ["RawDataset", "DerivedDataset", "Dataset"]))
