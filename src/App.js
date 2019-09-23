import { useQuery } from '@apollo/react-hooks'
import React from 'react'
import { Link, Route, Switch } from 'react-router-dom'
import './App.css'
import Home from './Home'
import { gql } from 'apollo-boost'

const EXCHANGE_RATES = gql`
  {
    rates(currency: "USD") {
      currency
      rate
    }
  }
`

const EXCHANGE_RATES_WITH_NAME = gql`
  {
    rates(currency: "USD") {
      currency
      rate
      name
    }
  }
`

const Hi = () => {
  return (
    <>
      <Rates />
      <Rates1 />
    </>
  )
}

const Rates = () => {
  const { loading, error, data } = useQuery(EXCHANGE_RATES)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  return data.rates.map(({ currency, rate }) => (
    <div key={currency}>
      <p>
        {currency}: {rate}
      </p>
    </div>
  ))
}

const Rates1 = () => {
  const { loading, error, data } = useQuery(EXCHANGE_RATES_WITH_NAME)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  return data.rates.map(({ currency, rate, name }) => (
    <div key={currency}>
      <h2>{name}</h2>
      <p>
        {currency}: {rate}
      </p>
    </div>
  ))
}

const App = () => (
  <>
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/hi">Hi</Link>
      </li>
    </ul>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/hi" component={Hi} />
    </Switch>
  </>
)

export default App
