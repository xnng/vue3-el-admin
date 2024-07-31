import { customAlphabet } from 'nanoid';

export const getRandomId = (length?: number) => {
  const alphabet =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const nanoid = customAlphabet(alphabet, length || 10);
  return nanoid();
};

export const getRandomIdV2 = (length?: number) => {
  const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
  const nanoid = customAlphabet(alphabet, length || 10);
  return nanoid();
};

/**
 * 将 object 转换为排序好的 querystring 格式的字符串
 * 示例：{ b: 1, a: 2 } => 'a=2&b=1'
 * @param payload object
 * @returns 排序后的字符串
 */
export const sortQueryStringByCharCode = (payload: object): string => {
  if (!payload) return '';
  let arr = [];
  Object.entries(payload).forEach(([key, value]) => {
    arr.push(`${key}=${value}`);
  });
  arr = arr.sort(
    (prev, next) =>
      prev.slice(0, 1).charCodeAt() - next.slice(0, 1).charCodeAt()
  );
  return arr.join('&');
};

/**
 * 将列表转换成树
 * @param list 树列表数据
 * @param keyField 自定义的 parendId 字段名
 * @returns 转换好的树
 */
export const covertListToTree = (
  list: Array<{
    id: number;
  }>,
  keyField: string
): Array<object> => {
  const res = [];
  const map = list.reduce((res, v) => ((res[v.id] = v), res), {});
  for (const item of list) {
    if (item[keyField] === -1) {
      res.push(item);
      continue;
    }
    if (item[keyField] in map) {
      const parent = map[item[keyField]];
      parent.children = parent.children || [];
      parent.children.push(item);
    }
  }
  return res;
};

/**
 * 将树转换成 list
 * @param tree 需要转换的树
 */
export const covertTreeToList = (tree: Array<any>) => {
  const list = [];
  const queue = [...tree];
  while (queue.length) {
    const node = queue.shift();
    const children = node.children;
    if (children) {
      queue.push(...children);
    }
    list.push(node);
  }
  return list;
};

/**
 * 查找树中某个节点及其所有子节点的 id
 */
export const findNodeAndChildrenIds = (treeList, nodeId) => {
  const result = [];

  function traverse(node) {
    if (node.id === nodeId) {
      collectIds(node);
      return true; // 找到目标节点，停止遍历
    }
    if (node.children) {
      for (const child of node.children) {
        if (traverse(child)) {
          return true; // 找到目标节点，停止遍历
        }
      }
    }
    return false;
  }

  function collectIds(node) {
    result.push(node.id);
    if (node.children) {
      for (const child of node.children) {
        collectIds(child);
      }
    }
  }

  for (const tree of treeList) {
    if (traverse(tree)) {
      break; // 找到目标节点，停止遍历其他树
    }
  }

  return result;
};
