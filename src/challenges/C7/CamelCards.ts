
/*
In Camel Cards, you get a list of hands, and your goal is to order them based on the strength of each hand. A hand consists of five cards labeled one of A, K, Q, J, T, 9, 8, 7, 6, 5, 4, 3, or 2. The relative strength of each card follows this order, where A is the highest and 2 is the lowest.

Every hand is exactly one type. From strongest to weakest, they are:

Five of a kind, where all five cards have the same label: AAAAA
Four of a kind, where four cards have the same label and one card has a different label: AA8AA
Full house, where three cards have the same label, and the remaining two cards share a different label: 23332
Three of a kind, where three cards have the same label, and the remaining two cards are each different from any other card in the hand: TTT98
Two pair, where two cards share one label, two other cards share a second label, and the remaining card has a third label: 23432
One pair, where two cards share one label, and the other three cards have a different label from the pair and each other: A23A4
High card, where all cards' labels are distinct: 23456

Hands are ordered by TYPE first, then by the strength of INDEX[0] of the hand.

Input:
32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483

Each hand wins an amount equal to its bid multiplied by its rank.

Steps:
1. Put the hands in order of strength.
2. Multiply each hands bid by its assigned rank.
3. Sum the total and return it.
*/

const exampleInput = '32T3K 765\n' +
  'T55J5 684\n' +
  'KK677 28\n' +
  'KTJJT 220\n' +
  'QQQJA 483'

const cards = [ '2' , '3' , '4' , '5' , '6' , '7' , '8' , '9' , 'T' , 'J' , 'Q' , 'K' , 'A' ] as const
type Card = typeof cards[number]
interface Hand {
  cards: Card[]
  bid: number
}
const convertToCards = (cardString: string): Card[] => cardString.split('').map(maybeCard => {
    if (cards.find(validCard => validCard === maybeCard)) return <Card>maybeCard
    throw new Error('Invalid Input for convertToCard()')
  })

const parseHand = (singleHand: string): Hand => {
  const split = singleHand.split(' ')
  return { cards: convertToCards(split[0]), bid: Number.parseInt(split[1]) }
}
const parseAllHands = (inputStr: string): Hand[] => inputStr.split('\n').map(parseHand)

const handStrengths = [ 'high-card', 'one-pair', 'two-pair', 'three-of-a-kind', 'full-house', 'four-of-a-kind', 'five-of-a-kind' ] as const
type HandStrength = typeof handStrengths[number]
interface HandWithStrength {
  hand: Hand,
  handStrength: HandStrength
}
const countOccurrences = (arr: any[]) => arr.reduce((acc, cur) => { return acc[cur] ? ++acc[cur] : acc[cur] = 1, acc }, {})
const orderedByOccurrences = (arr: any[]) => Object.values(countOccurrences(arr)).sort().reverse()

const addTypeToHand = (hand: Hand): HandWithStrength => {
  const isFiveOfKind = (cards: Card[], occurancesObj: any[]): boolean => new Set(cards).size === 1
  const isFourOfKind = (cards: Card[], occurancesObj: any[]): boolean => new Set(cards).size === 2 && occurancesObj[0] === 4
  const isFullHouse = (cards: Card[], occurancesObj: any[]): boolean => new Set(cards).size === 2 && occurancesObj[0] === 3 && occurancesObj[1] === 2
  const isThreeOfKind = (cards: Card[], occurancesObj: any[]): boolean => occurancesObj[0] === 3
  const isTwoPair = (cards: Card[], occurancesObj: any[]): boolean => new Set(cards).size === 3 && occurancesObj[0] === 2 && occurancesObj[1] === 2
  const isPair = (cards: Card[], occurancesObj: any[]): boolean => new Set(cards).size === 4 && occurancesObj[0] === 2

  const occurancesArr = orderedByOccurrences(hand.cards)

  if (isFiveOfKind(hand.cards, occurancesArr)) return { hand: hand, handStrength: 'five-of-a-kind' }
  if (isFourOfKind(hand.cards, occurancesArr)) return { hand: hand, handStrength: 'four-of-a-kind' }
  if (isFullHouse(hand.cards, occurancesArr)) return { hand: hand, handStrength: 'full-house' }
  if (isThreeOfKind(hand.cards, occurancesArr)) return { hand: hand, handStrength: 'three-of-a-kind' }
  if (isTwoPair(hand.cards, occurancesArr)) return { hand: hand, handStrength: 'two-pair' }
  if (isPair(hand.cards, occurancesArr)) return { hand: hand, handStrength: 'one-pair' }
  return { hand: hand, handStrength: 'high-card' }
}

const compareByHighCards = (h1: HandWithStrength, h2: HandWithStrength): number => {
  return h1.hand.cards.map((card, index) => {
    if (cards.indexOf(card) > cards.indexOf(h2.hand.cards[index])) return 1
    if (cards.indexOf(card) < cards.indexOf(h2.hand.cards[index])) return -1
    return 0
  }).reduce((acc, cur) => {
    if (acc === 0 && cur === 1) return 1
    if (acc === 0 && cur === -1) return -1
    return acc
  }, 0)
}

const compareHands = (h1: HandWithStrength, h2: HandWithStrength): number => {
  const isStronger = handStrengths.indexOf(h1.handStrength) > handStrengths.indexOf(h2.handStrength)
  const isWeaker = handStrengths.indexOf(h1.handStrength) < handStrengths.indexOf(h2.handStrength)
  const isSame = handStrengths.indexOf(h1.handStrength) === handStrengths.indexOf(h2.handStrength)
  if (isStronger) return 1
  if (isWeaker) return -1
  else if (isSame) return compareByHighCards(h1, h2)
  throw new Error('un-expected error in compareHands()')
}

const sortHands = (hands: HandWithStrength[]): HandWithStrength[] => hands.sort(compareHands)
const sumHands = (hands: HandWithStrength[]): number => hands.map((hand, index) => hand.hand.bid * (index + 1)).reduce((cur, acc) => acc + cur )

const execute = (input: string): number => {
  return sumHands(sortHands(parseAllHands(input).map(addTypeToHand)))
}

console.log(execute(exampleInput))