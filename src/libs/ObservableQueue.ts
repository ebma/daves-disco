import _ from "lodash"

export type CurrentElementCallback<T> = (currentElement: T) => void
export type QueueCallback<T> = (currentQueue: T[]) => void

class ObservableQueue<T extends object | string> {
  private itemList: T[] = []
  private elementObservers: CurrentElementCallback<T>[] = []
  private queueObservers: QueueCallback<T>[] = []
  private currentIndex = 0
  loopState: LoopState = "none"

  constructor() {}

  public addElement(element: T) {
    this.itemList.push(element)
    if (this.itemList.length - 1 === this.currentIndex) {
      this.notifyElementObservers()
    }
    this.notifyQueueObservers()
  }

  public addAll(elements: T[]) {
    _.forEach(elements, element => {
      this.itemList.push(element)
    })
    this.notifyElementObservers()
    this.notifyQueueObservers()
  }

  public removeElement(element: T) {
    _.remove(this.itemList, value => value === element)
    this.notifyQueueObservers()
  }

  public moveForward(amount: number = 1, force: boolean = false) {
    if (!force && this.loopState !== "none") {
      if (this.loopState === "repeat-one") {
        // don't skip
      } else if (this.loopState === "repeat-all") {
        this.currentIndex += amount
        if (this.currentIndex >= this.itemList.length) {
          this.currentIndex = 0
        }
      }
      this.notifyElementObservers()
    } else {
      const previousIndex = this.currentIndex
      _.times(amount, () => {
        if (this.currentIndex + 1 <= this.itemList.length) {
          this.currentIndex++
        }
      })
      // if changed notify observers
      if (this.currentIndex !== previousIndex) {
        this.notifyElementObservers()
      }
    }
  }

  // will only move back to the first element in the list
  // so moving back to the max will result in the first entry being the current
  public moveBack(amount: number = 1) {
    _.times(amount, () => {
      if (this.currentIndex > 0) {
        this.currentIndex--
      }
    })

    this.notifyElementObservers()
  }

  public getAll() {
    return this.itemList
  }

  public getRemaining() {
    const remaining = this.itemList.slice(this.currentIndex + 1, this.itemList.length)
    return remaining
  }

  public getCurrent() {
    const current = this.itemList[this.currentIndex]
    return current
  }

  public consumeCurrent() {
    const current = this.getCurrent()
    this.moveForward()
    return current
  }

  public getNext() {
    const next = this.itemList[this.currentIndex + 1]
    return next
  }

  public getPrevious() {
    const previous = this.itemList[this.currentIndex - 1]
    return previous
  }

  public clear() {
    this.itemList = []
    this.notifyElementObservers()
    this.notifyQueueObservers()
  }

  public size() {
    return this.itemList.length
  }

  public subscribeCurrentElement(callback: CurrentElementCallback<T>) {
    this.elementObservers.push(callback)
    return () => {
      this.elementObservers = this.elementObservers.filter(cb => cb !== callback)
    }
  }

  public subscribeQueue(callback: QueueCallback<T>) {
    this.queueObservers.push(callback)
    return () => {
      this.queueObservers = this.queueObservers.filter(cb => cb !== callback)
    }
  }

  public replace(newItems: Array<T>, newCurrentIndex: number) {
    const oldCurrent = this.getCurrent()
    this.itemList = newItems
    this.currentIndex = newCurrentIndex
    const newCurrent = this.getCurrent()
    if (!_.isEqual(oldCurrent, newCurrent)) {
      this.notifyElementObservers()
    }
    this.notifyQueueObservers()
  }

  notifyElementObservers() {
    this.elementObservers.forEach(callback => {
      callback(this.getCurrent())
    })
  }

  notifyQueueObservers() {
    this.queueObservers.forEach(callback => {
      callback(this.getAll())
    })
  }
}

export default ObservableQueue
