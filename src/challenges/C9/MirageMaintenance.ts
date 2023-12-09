
/*
Find the next value in each sequence and add those values together.
In order to do this, we must find the difference between the numbers in each sequence.
We must repeat this process until the difference between each number in sequence is 0.
*/


const maintInput = "0 3 6 9 12 15\n" +
  "1 3 6 10 15 21\n" +
  "10 13 16 21 30 45"

const parseSequences = (input: string): number[][] => input.split("\n").map(seq => seq.split(' ').map(digit => Number.parseInt(digit)))

const mapSeqToDifSeq = (seq: number[]): number[] => {
  return seq.map((digit, index) => {
    if (index === 0) return 0
    return Math.abs(digit - seq[index - 1])
  }).slice(1)
}

interface SingleRes {
  curSeq: number[],
  difSeqs: number[][]
}

const isZeroDifs = (difSeq: number[]): boolean => difSeq.length > 0 && difSeq.filter(x => x === 0).length === difSeq.length

const recursiveMapSeq = (singleRes: SingleRes): SingleRes => {
  if (isZeroDifs(singleRes.difSeqs[singleRes.difSeqs.length - 1])) return singleRes
  return recursiveMapSeq({
    curSeq: mapSeqToDifSeq(singleRes.curSeq),
    difSeqs: [...singleRes.difSeqs, singleRes.curSeq]
  })
}

const trimCompletedSeq = (res: SingleRes): SingleRes => ({ curSeq: res.curSeq, difSeqs: res.difSeqs.slice(1) })
const mapSingleSeq = (sequence: number[]): SingleRes => trimCompletedSeq(recursiveMapSeq({ curSeq: sequence, difSeqs: [[]] }))

interface ResObj {
  seqs: number[][]
  currentDif: number
  newNums: number[]
}

const reduceToDif = (seqs: number[][]): ResObj => seqs.reverse().reduce((acc, cur, ind): ResObj => {
  if (ind === 0) return { seqs: seqs, currentDif: 0, newNums: [0] }
  const newVal = cur[cur.length - 1] + acc.currentDif
  const before = [...acc.seqs.slice(0, ind)]
  const current = [...cur, cur[cur.length - 1] + acc.currentDif]
  const after = [...acc.seqs.slice(ind + 1)]
  return {
      seqs: [...before, current, ...after],
      currentDif: newVal,
      newNums: [...acc.newNums, newVal]
    }
  }, <ResObj>{})


const executeMirage = (input: string): number => {
  const sequences: number[][] = parseSequences(input)
  const mappedSeqs: SingleRes[] = sequences.map(seq => mapSingleSeq(seq))
  const allSequences = mappedSeqs.map(res => res.difSeqs)
  const reducedSeqs: ResObj[] = allSequences.map(seqs => reduceToDif(seqs))
  return reducedSeqs.map(resObj => resObj.newNums[resObj.newNums.length - 1]).reduce((acc, cur) => acc + cur)
}

console.log(executeMirage(maintInput))