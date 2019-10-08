import { useQuery } from '@apollo/react-hooks'
import React from 'react'
import { Link, Route, Switch } from 'react-router-dom'
import './App.css'
import Home from './Home'
import { gql } from 'apollo-boost'

const EXCHANGE_RATES = gql`
  query Rates($getName: Boolean!, $currency: String!) {
    rates(currency: $currency) {
      currency
      rate
      name @include(if: $getName)
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
      {/* <Rates1 /> */}
    </>
  )
}

const Rates = () => {
  const { loading, error, data, refetch } = useQuery(EXCHANGE_RATES, {
    variables: { getName: false, currency: 'USD' },
  })
  if (typeof window === 'undefined') {
    console.log('server')
  } else {
    console.log('client')
  }
  console.log(loading)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  return (
    <>
      <button onClick={() => refetch({ getName: true, currency: 'CNY' })}>refetch</button>
      {data.rates.map(({ currency, rate, name }) => (
        <div key={currency}>
          <div onClick={() => console.log(`You clicked ${name}!`)}>
            {name && <h3>{name}</h3>}

            <p>{`${currency}: ${rate}`}</p>
          </div>
        </div>
      ))}
    </>
  )
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
