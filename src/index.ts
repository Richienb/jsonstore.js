/**
 * @license
 *
 * MIT License
 *
 * Copyright (c) 2019 Richie Bendall
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */


import fetch from "cross-fetch"
import Promise from "bluebird"
import joinURL = require("url-join")

export class JSONStore {
  private token: string
  private path = ""

  constructor({token, path}) {
    if (token === void 0) {
      fetch("https://www.jsonstore.io/get-token")
        .then(res => res.json())
        .then(({ token }) => this.token = token)
        .catch(reject)
    } else {
      if (token.length !== 64) throw new RangeError("The token must be 64 characters long.")
      if (!(/^.*?(?:[a-z][a-z]*[0-9]*[a-z0-9]*)$/.test(token))) throw new ReferenceError("Invalid token specified.")
      this.token = token
    }
    this.path = path || ""
  }

  get({
    path,
    order,
    filter,
    type
  }) {
    return new Promise((resolve, reject) => {
      fetch(joinURL("https://www.jsonstore.io", this.token, this.path, path || "",
        order ? `?orderKey=${order}` : "",
        filter ? `?filterValue=${filter}` : "",
        type ? `?valueType = ${type}` : "" 
      ))
        .then(res => res.json())
        .then(({ result, ok }) => {
          if (!ok) reject("Non-ok response returned.")
          resolve(result)
        })
        .catch(reject)
    })
  }

  set(data: any, path = "") {
    return new Promise((resolve, reject) => {
      fetch(joinURL("https://www.jsonstore.io", this.token, this.path, path), {method: "POST", headers: {
    'Content-type': 'application/json'
  }, body: data})
        .then(res => res.json())
        .then(({ ok }) => {
          if (!ok) reject("Non-ok response returned.")
          resolve()
        })
        .catch(reject)
    })
  }

  chg(data: any, path = "") {
    return new Promise((resolve, reject) => {
      fetch(joinURL("https://www.jsonstore.io", this.token, this.path, path), {method: "PUT", headers: {
    'Content-type': 'application/json'
  }, body: data})
        .then(res => res.json())
        .then(({ ok }) => {
          if (!ok) reject("Non-ok response returned.")
          resolve()
        })
        .catch(reject)
    })
  }

  del({ path = "" }) {
    return new Promise((resolve, reject) => {
      fetch(joinURL("https://www.jsonstore.io", this.token, this.path, path), { method: "DELETE" })
        .then(res => res.json())
        .then(({ ok }) => {
          if (!ok) reject("Non-ok response returned.")
          resolve()
        })
        .catch(reject)
    })
  }
}
