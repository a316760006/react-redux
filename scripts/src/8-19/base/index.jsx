import React, { Component } from 'react'
import store from "./store"
import { Provider } from "react-redux"
import Home from "./components/Home"
export default class Html extends Component {
    render() {
        return (
            <Provider store={store}>
                <Home />
            </Provider>
        )
    }
}
