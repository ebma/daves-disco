import ObservableQueue from "./ObservableQueue"

interface TestObject {
  data: number
}

let queue: ObservableQueue<TestObject>
const testData1 = { data: 1 }
const testData2 = { data: 2 }
const testData3 = { data: 3 }

beforeEach(() => {
  queue = new ObservableQueue<TestObject>()
})

it("adds 1 element", () => {
  queue.addElement(testData1)

  expect(queue.size()).toBe(1)
  expect(queue.getCurrent()).toBe(testData1)
  expect(queue.getRemaining()).toEqual([])
  expect(queue.getPrevious()).toBeUndefined()
  expect(queue.getNext()).toBeUndefined()
  expect(queue.getAll()).toEqual([testData1])
})

it("adds multiple elements", () => {
  const elements = [testData1, testData2, testData3]
  queue.addAll(elements)

  expect(queue.size()).toBe(3)
  expect(queue.getCurrent()).toBe(testData1)
  expect(queue.getRemaining()).toEqual([testData2, testData3])
  expect(queue.getAll()).toEqual(elements)
})

it("removes 1 element", () => {
  queue.addElement(testData1)
  queue.removeElement(testData1)
  expect(queue.size()).toBe(0)

  queue.addElement(testData1)
  queue.addElement(testData1)
  queue.addElement(testData1)
  queue.removeElement(testData1)
  expect(queue.size()).toBe(0)
})

it("consumes 1 element", () => {
  queue.addElement(testData1)
  queue.consumeCurrent()

  expect(queue.size()).toBe(1)
  expect(queue.getCurrent()).toBeUndefined()
  expect(queue.getPrevious()).toBe(testData1)
  expect(queue.getAll()).toEqual([testData1])
})

it("can move back and forth", () => {
  queue.addElement(testData1)
  queue.addElement(testData2)
  queue.addElement(testData3)

  queue.moveForward()
  expect(queue.getPrevious()).toBe(testData1)
  expect(queue.getCurrent()).toBe(testData2)
  expect(queue.getNext()).toBe(testData3)

  queue.moveForward()
  expect(queue.getPrevious()).toBe(testData2)
  expect(queue.getCurrent()).toBe(testData3)
  expect(queue.getNext()).toBeUndefined()

  queue.moveForward()
  expect(queue.getPrevious()).toBe(testData3)
  expect(queue.getCurrent()).toBeUndefined()
  expect(queue.getNext()).toBeUndefined()

  // try moving beyond the end
  queue.moveForward()
  expect(queue.getPrevious()).toBe(testData3)
  expect(queue.getCurrent()).toBeUndefined()
  expect(queue.getNext()).toBeUndefined()

  // move backwards
  queue.moveBack()
  expect(queue.getPrevious()).toBe(testData2)
  expect(queue.getCurrent()).toBe(testData3)
  expect(queue.getNext()).toBeUndefined()

  queue.moveBack()
  expect(queue.getPrevious()).toBe(testData1)
  expect(queue.getCurrent()).toBe(testData2)
  expect(queue.getNext()).toBe(testData3)

  queue.moveBack()
  expect(queue.getPrevious()).toBeUndefined()
  expect(queue.getCurrent()).toBe(testData1)
  expect(queue.getNext()).toBe(testData2)

  // try moving beyond the start
  queue.moveBack()
  expect(queue.getPrevious()).toBeUndefined()
  expect(queue.getCurrent()).toBe(testData1)
  expect(queue.getNext()).toBe(testData2)
})

it("cannot move too far back", () => {
  queue.addElement(testData1)
  queue.moveBack(10)

  expect(queue.getCurrent()).toBe(testData1)
})

it("cannot move too far ahead", () => {
  queue.addElement(testData1)
  queue.addElement(testData2)

  expect(queue.getCurrent()).toBe(testData1)

  queue.moveForward(10)

  expect(queue.getCurrent()).toBeUndefined()
  expect(queue.getPrevious()).toBe(testData2)
})

it("can move forward more than once at a time", () => {
  queue.addElement(testData1)
  queue.addElement(testData2)
  queue.addElement(testData3)

  expect(queue.getCurrent()).toBe(testData1)

  queue.moveForward(2)

  expect(queue.getCurrent()).toBe(testData3)
})

it("can move back more than once at a time", () => {
  queue.addElement(testData1)
  queue.addElement(testData2)
  queue.addElement(testData3)

  expect(queue.getCurrent()).toBe(testData1)

  queue.moveForward(2)

  expect(queue.getCurrent()).toBe(testData3)

  queue.moveBack(2)

  expect(queue.getCurrent()).toBe(testData1)
})

it("can be cleared", () => {
  queue.addElement(testData1)
  queue.addElement(testData2)
  queue.addElement(testData3)

  expect(queue.size()).toBe(3)

  queue.clear()
  expect(queue.size()).toBe(0)
})

it("can return remaining elements", () => {
  queue.addElement(testData1)
  queue.addElement(testData2)
  queue.addElement(testData3)

  expect(queue.getAll()).toEqual([testData1, testData2, testData3])
  expect(queue.getRemaining()).toEqual([testData2, testData3])

  queue.moveForward()
  expect(queue.getAll()).toEqual([testData1, testData2, testData3])
  expect(queue.getRemaining()).toEqual([testData3])
})

it("can be shuffled", () => {
  queue.addElement(testData1)
  queue.addElement(testData2)
  queue.addElement(testData3)
  queue.addElement(testData3)
  queue.addElement(testData2)
  queue.addElement(testData1)

  queue.shuffle()

  expect(queue.getAll()).not.toEqual([testData1, testData2, testData3, testData3, testData2, testData1])
})

it("can be subscribed", done => {
  expect.assertions(8)

  const mockCallback = jest.fn((currentElement, remainingElements) => {
    console.log("current", currentElement, "remaining:", remainingElements)
  })

  queue.subscribe(mockCallback)

  queue.addElement(testData1)
  expect(mockCallback.mock.calls[0][0]).toBe(testData1)
  expect(mockCallback.mock.calls[0][1]).toEqual([])

  queue.addElement(testData2)
  expect(mockCallback.mock.calls[1][0]).toBe(testData1)
  expect(mockCallback.mock.calls[1][1]).toEqual([testData2])

  queue.addElement(testData3)
  expect(mockCallback.mock.calls[2][0]).toBe(testData1)
  expect(mockCallback.mock.calls[2][1]).toEqual([testData2, testData3])

  queue.moveForward()
  expect(mockCallback.mock.calls[3][0]).toBe(testData2)
  expect(mockCallback.mock.calls[3][1]).toEqual([testData3])

  done()
})
