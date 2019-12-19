import _ from "lodash"

export type SubscriptionCallback<T> = (currentElement: T, remainingElements: T[]) => void

class ObservableQueue<T extends object> {
  private itemList: T[] = []
  private observers: SubscriptionCallback<T>[] = []
  private currentIndex = 0

  constructor() {}

  public addElement(element: T) {
    this.itemList.push(element)
    this.notifyObservers()
  }

  public removeElement(element: T) {
    _.remove(this.itemList, value => value === element)
    this.notifyObservers()
  }

  public moveForward() {
    if (this.currentIndex + 1 <= this.itemList.length) {
      this.currentIndex++
      this.notifyObservers()
      return true
    } else {
      return false
    }
  }

  // will only move back to the first element in the list
  // so moving back to the max will result in the first entry being the current
  public moveBack() {
    if (this.currentIndex > 0) {
      this.currentIndex--
      this.notifyObservers()
      return true
    } else {
      this.notifyObservers() // notify anyways
      return false
    }
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
    this.notifyObservers()
  }

  public shuffle() {
    this.itemList = _.shuffle(this.itemList)
    this.notifyObservers()
  }

  public size() {
    return this.itemList.length
  }

  public subscribe(callback: SubscriptionCallback<T>) {
    this.observers.push(callback)
  }

  notifyObservers() {
    this.observers.forEach(callback => {
      callback(this.getCurrent(), this.getRemaining())
    })
  }
}

export default ObservableQueue
