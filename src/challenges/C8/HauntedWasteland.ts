/*
* You feel like AAA is where you are now, and you have to follow the left/right instructions until you reach ZZZ.

This format defines each node of the network individually. For example:

RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)
Starting with AAA, you need to look up the next element based on the next left/right instruction in your input. In this example, start with AAA and go right (R) by choosing the right element of AAA, CCC. Then, L means to choose the left element of CCC, ZZZ. By following the left/right instructions, you reach ZZZ in 2 steps.

Of course, you might not find ZZZ right away. If you run out of left/right instructions, repeat the whole sequence of instructions as necessary: RL really means RLRLRLRLRLRLRLRL... and so on. For example, here is a situation that takes 6 steps to reach ZZZ:

LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)
Starting at AAA, follow the left/right instructions. How many steps are required to reach ZZZ?
* */

const example2 = "LLR\n" +
  "\n" +
  "AAA = (BBB, BBB)\n" +
  "BBB = (AAA, ZZZ)\n" +
  "ZZZ = (ZZZ, ZZZ)"

interface DirectionsNode {
  start: string
  left: string
  right: string
}

const cleanRow = (row: string) => row.replace('(', '').replace(')', '').split(',').map(loc => loc.trim())
const rowToNode = (row: string): DirectionsNode => {
  const split = row.split('=')
  const splitAgain = cleanRow(split[1])
  return { start: split[0].trim(), left: splitAgain[0], right: splitAgain[1] }
}

interface ResultsObj {
  instructions: string[]
  nodes: DirectionsNode[]
  currentNode: DirectionsNode
  numberOfSteps: number
}

const doStep = (res: ResultsObj, index: number): ResultsObj => {
  const getSide = (node: DirectionsNode, side: string) => side === 'L' ? node.start === res.currentNode.left : node.start === res.currentNode.right
  const position = index % res.instructions.length
  if (res.instructions[position] === 'L') return { ...res, currentNode: res.nodes.find(node => getSide(node, 'L')) ?? res.currentNode, numberOfSteps: res.numberOfSteps + 1 }
  if (res.instructions[position] === 'R') return { ...res, currentNode: res.nodes.find(node => getSide(node, 'R')) ?? res.currentNode, numberOfSteps: res.numberOfSteps + 1 }
  throw new Error(`Invalid instruction at position ${position}: ${res.instructions[position]}`)
}

const dirtyWhileLoop = (instructionList: string[], nodesList: DirectionsNode[]): ResultsObj => {
  let res = { instructions: instructionList, nodes: nodesList, currentNode: nodesList[0], numberOfSteps: 0 }
  let i = 0
  while (res.currentNode.start !== 'ZZZ') res = doStep(res, i++)
  return res
}

const parseAndTraverse = (inputStr: string) => {
  const split = inputStr.split('\n')
  const instructionList = split[0].trim().split('')
  const nodesList: DirectionsNode[] = split.slice(2).map(rowToNode)
  return dirtyWhileLoop(instructionList, nodesList)
}

console.log(parseAndTraverse(example2))