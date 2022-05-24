function Node(value, left, right) {
  this.value = value
  this.left = left
  this.right = right
}

Node.prototype = {
  show: function () {
    console.log(value)
  },
}

function Tree() {
  this.root = null
}

Tree.prototype = {
  insert: function (value) {
    let node = new Node(value, null, null)
    if (!this.root) {
      this.root = node
      return
    }
    let current = this.root
    let parent = null
    while (current) {
      parent = current
      if (value < parent.value) {
        current = current.left
        if (!current) {
          parent.left = node
          return
        }
      } else {
        current = current.right
        if (!current) {
          parent.right = node
          return
        }
      }
    }
  },
  preOrder: function (node) {
    if (node) {
      node.show()
      this.preOrder(node.left)
      this.preOrder(node.right)
    }
  },
  middleOrder: function (node) {
    if (node) {
      this.middleOrder(node.left)
      node.show()
      this.middleOrder(node.right)
    }
  },
  laterOrder: function (node) {
    if (node) {
      this.laterOrder(node.left)
      this.laterOrder(node.right)
      node.show()
    }
  },
  getMin: function () {
    let current = this.root
    while (current) {
      if (!current.left) {
        return current
      }
      current = current.left
    }
  },
  getMax: function () {
    let current = this.root
    while (current) {
      if (!current.right) {
        return current
      }
      current = current.right
    }
  },
  getDeep: function (node, deep) {
    deep = deep || 0
    if (deep == null) {
      return deep
    }
    deep++
    let deepLeft = this.getDeep(node.left, deep)
    let deepRight = this.getDeep(node.right, deep)
    return Math.max(deepLeft, deepRight)
  },
  getNode: function (value, node) {
    if (node) {
      if (value === node.value) {
        return node
      } else if (value < node.value) {
        return this.getNode(value, node.left)
      } else {
        return this.getNode(value, node.right)
      }
    } else {
      return null
    }
  },
}

let t = new Tree()
t.insert(3)
t.insert(8)
t.insert(1)
t.insert(2)
t.insert(5)
t.insert(7)
t.insert(6)
t.insert(0)
console.log(t)
// t.middleOrder(t.root);
// console.log(t.getMin(), t.getMax())
// console.log(t.getDeep(t.root, 0))
// console.log(t.getNode(5, t.root))
