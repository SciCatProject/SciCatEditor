import _ from 'lodash';

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
