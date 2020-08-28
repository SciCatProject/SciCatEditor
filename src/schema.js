import _ from 'lodash';

/* Fixes a Swagger schema so that it is an acceptable JSON schema */
export function fixSchema(schema) {
    schema.definitions.RawDataset.required = schema.definitions.RawDataset.required.filter(
        (v) => ["pid", 'contactEmail', 'creationTime'].indexOf(v) < 0);
    traverse(schema, (node, path) => {
        if(node["format"] == "double") {
            delete node["format"];
        }
    });
    return schema;
}

/* maps a function to each property of an object
 */
// https://stackoverflow.com/a/14810722/81658
export function objectMap(obj, fn) {
    return Object.fromEntries(
        Object.entries(obj).map(
            ([k, v], i) => [k, fn(v, k, i)]
        )
    )
}

/** For every node in an object tree, call iteratee with (node, keyPath, root).
 * Nodes are traversed in pre-order.
 *
 * For instance, for a node `root[a][b][c]` call
 * iteratee(root[a][b][c], [a,b,c], root)
 */
export function traverse(root, iteratee) {
    function inner(node, keys) {
        for(const key in node) {
            const child = node[key];
            keys.push(key)
            // (node, path, key, valu)
            iteratee(child, keys, root);
            if(_.isObject(child)) {
                inner(child, keys);
            }
            keys.pop()
        }
    }
    iteratee(root, [], root);
    inner(root, []);
}

export async function getSchema() {
    const swagger_url = "https://scicatproject.github.io/api-documentation/swagger.json";
    return fetch(swagger_url)
        .then(response => response.json())
        //.then(swagger_data => objectMap(swagger_data.definitions, fixSchema));
}
// const schema = {definitions: schemas.definitions, "$ref": "#/definitions/RawDataset"}
export default getSchema;