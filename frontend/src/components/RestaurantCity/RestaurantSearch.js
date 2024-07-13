import React from 'react'
import RestaurantDisplay from './RestaurantDisplay'
import Footer from '../../Footer'
import RestaurantSearchNav from './RestaurantSearchNav'

const RestaurantSearch = () => {
  return (
    <div>
<RestaurantSearchNav/>
      <RestaurantDisplay/>
      <Footer/>
    </div>
  )
}

export default RestaurantSearch
