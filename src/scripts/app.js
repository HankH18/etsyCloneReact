import React from 'react'
import ReactDOM from 'react-dom'
import Backbone from 'backbone'
import init from './init'

var baseUrl = "https://openapi.etsy.com/v2/listings/active.js"
var apiKey = "mvk7lu427evopxj9ggvyb3q3"
var searchUrl = "https://openapi.etsy.com/v2/listings/"

//******************
//Models
//******************
var EtsyCollection = Backbone.Collection.extend({
	url: baseUrl,
	parse: function(apiResponse) {
		return apiResponse.results
	},
})

var ProductModel = Backbone.Model.extend({
	url: searchUrl,
	parse: function(apiResponse) {
		return apiResponse.results[0]
	}
})

//******************
//Views
//******************
var ViewCollection = React.createClass({
	
	makeItems: function() {
		var itemsArray = []
		for (var i = 0; i < this.props.multiCollection.models.length; i++) {
			itemsArray.push(<SingleItem itemModel={this.props.multiCollection.models[i]}/>)
		}
		return (
			itemsArray
		)
	},
	render: function() {
		return(
			<div className='listingsContainer'>{this.makeItems()}</div>
		)
	}
})

var SingleItem = React.createClass({
	render: function() {
		return(
			<a href={`#details/${this.props.itemModel.get('listing_id')}`}>
				<div className={`item${this.props.itemModel.get('listing_id')}`}>
					<img className='image' src={this.props.itemModel.get('Images')[0].url_170x135}/>
					<p className='title'>{this.props.itemModel.get('title')}</p>
				 	<p className= 'price'>{'$'}{this.props.itemModel.get('price')}</p>
			</div></a>
		)
	}
})

var ViewModel = React.createClass({
	render: function() {
		return(
		<div className='itemPage'>
		<div className='itemTop'>
		<h1 className='itemShop'>{this.props.singleModel.attributes.Shop.shop_name}</h1>
		<a href={this.props.singleModel.attributes.Shop.url} target='blank'>
		<button type='button' className='shopButtton'>{'Visit My Store!'}</button></a></div>
		<div className='itemBottom'>
		<h2 className='itemTitle'>{this.props.singleModel.attributes.title}</h2>
		<img className='itemImg' src={this.props.singleModel.attributes.Images[0].url_570xN}/>
		<p className='itemDetail'>{this.props.singleModel.attributes.description}</p>
		<p className='itemPrice'>{'$'}{this.props.singleModel.attributes.price}</p>
		<a href={`https://www.etsy.com/listing/${this.props.singleModel.attributes.listing_id}`} target='blank'>
		<button type='button' className='buyButton'>{'Buy Now!'}</button></a></div>
		</div>
		)
	}
})

//******************
//Controller
//******************
var app = function() {
	var PageRtr = Backbone.Router.extend({
	 	routes: {
	 	"home": "showViewCollection",
	 	"search/:query": "showSearchCollection",
	 	"details/:id": "showViewModel",
	 	"*notFound": "goHome",
	 	},
	 	showViewCollection: function() {
	 		var homeInstance = new EtsyCollection()
	 		var promise = homeInstance.fetch({
	 			dataType: 'jsonp',
	 			data: {
	 				includes: "Images,Shop",
	 				"api_key": apiKey,
	 				limit: 50,
	 			}
	 		})
	 		promise.then(function() {
	 			ReactDOM.render(<ViewCollection multiCollection={homeInstance}/>,document.querySelector('.container'))
	 		})
	 	},
	 	showSearchCollection: function(query) {
	 		var searchInstance = new EtsyCollection()
	 		var promise = searchInstance.fetch ({
	 			"dataType": "jsonp",
	 			data: {
	 				"api_key": apiKey,
	 				"keywords": query,
	 				includes: "Images,Shop",
	 				limit: 50
	 			},
	 		})
	 		promise.then(function() {
	 			ReactDOM.render(<ViewCollection multiCollection={searchInstance}/>,document.querySelector('.container'))
	 		})
	 	},
	 	showViewModel: function(id) {
	 		var modelInstance = new ProductModel()
	 		modelInstance.url += id + '.js'
	 		var promise = modelInstance.fetch ({
	 			dataType: "jsonp",
	 			data:{
	 				"api_key": apiKey,
	 				includes: "Images,Shop"
	 			}

	 		})
	 		promise.then(function() {
	 			ReactDOM.render(<ViewModel singleModel={modelInstance}/>,document.querySelector('.container'))
	 		})
	 	},
	 	goHome: function() {
	 		location.hash = "home"
	 	}
	})

	//******************
	//Search
	//******************
	var searchBarNode = document.querySelector('.searchBar')
	searchBarNode.addEventListener('keydown', function(eventObj) {
		if(eventObj.keyCode === 13) {
			var input = eventObj.target.value
			location.hash = 'search/' + input
			eventObj.target.value = ''
		}
	})

	//******************
	//LET'S GET THIS PARTY STARTED!!!
	//******************

	new PageRtr
	Backbone.history.start()
}



// x..x..x..x..x..x..x..x..x..x..x..x..x..x..x..x..
// NECESSARY FOR USER FUNCTIONALITY. DO NOT CHANGE. 
export const app_name = init()
app()
// x..x..x..x..x..x..x..x..x..x..x..x..x..x..x..x..