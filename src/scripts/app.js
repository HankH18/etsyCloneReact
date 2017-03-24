import React from 'react'
import ReactDOM from 'react-dom'
import Backbone from 'backbone'
import init from './init'
import {EtsyCollection} from "./models/collections.js"
import {ProductModel} from "./models/collections.js"
import {ListingCollection} from "./models/collections.js"
import {ListingModel} from "./models/collections.js"
import STORE from './store'
import ACTIONS from './actions'


var baseUrl = "https://openapi.etsy.com/v2/listings/active.js"
var apiKey = "mvk7lu427evopxj9ggvyb3q3"
var searchUrl = "https://openapi.etsy.com/v2/listings/"

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
			<div className='listingsContainer'>
			<Banner />
			{this.makeItems()}</div>
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
		<Banner />
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

var MyListings = React.createClass({
	handleSubmit: function(eventObj) {
		eventObj.preventDefault()
		var formEl = eventObj.target
		var listingData = {
			item: formEl.item.value,
			price: formEl.price.value,
			description: formEl.description.value
		}
		formEl.reset()
		ACTIONS.addListing(listingData)
	},
	render: function() {
		return(
			<div className="myListings">
				<Banner />
				<form onSubmit={this.handleSubmit} className="listingsForm">
					<h3>New Listing:</h3>
					<input placeholder='item' name='item'/>
					<input placeholder='price' name='price'/>
					<input placeholder='description' name='description'/>
					<button type='submit'>Submit</button>
					<h1>My Listings</h1>
					<MyListingsDisplay />
				</form>
			</div>
		)
	}
})

var Banner = React.createClass({
	handleKeyDown: function(evtObj) {
		if (evtObj.keyCode === 13) {
			location.hash = `search/${evtObj.target.value}`
			evtObj.target.value = ''
		}
	},
	render: function(){
		return (
			<div className="banner">
				<a href="#home" className="headline"><h1 className='header'>ETSY 2.0</h1></a>
    			<hr />
    			<div className='navBar'>
    				<input className='search' placeholder="Search ETSY Products" onKeyDown={this.handleKeyDown}/>
    				<div className='myListings'>My Listings:
    				<a href="#myListings" className="listings"> View</a>
    				</div>
				</div>
			</div>
		)
	}
})

var MyListingsDisplay = React.createClass({
	componentWillMount: function() {
		ACTIONS.fetchAllListings()
		STORE.on('dataUpdated', () => {
			this.setState(STORE.data)
		})
	},
	getInitialState: function() {
		return STORE.data
	},
	render: function() {
	 	return (
	 		<div className='listingsPage' >
	 			<ListingsList listingCollection={this.state.listingCollection} />
	 		</div>
	 	)
 	}
})

var ListingsList = React.createClass({
	makeListing: function(model) {
		return <Listing listingModel={model} key={model.cid} />
	},
	render: function() {
		return (
			<div className="listingsList">
				{this.props.listingCollection.map(this.makeListing)}
			</div>
		)
	}
})

var Listing = React.createClass({
	render: function() {
		return (
			<div className="listingContainer">
				<h2 className="listingText">Item:&nbsp;
				{this.props.listingModel.get('item')}
				</h2>
				<h2 className="listingText">Price:&nbsp;
				{this.props.listingModel.get('price')}
				</h2>
				<h2 className="listingText">Description:&nbsp;
				{this.props.listingModel.get('description')}
				</h2>
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
	 	"myListings": "showMyListings",
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
	 	showMyListings: function() {
	 		ReactDOM.render(<MyListings />, document.querySelector('.container'))
	 	},
	 	goHome: function() {
	 		location.hash = "home"
	 	}
	})

	new PageRtr
	Backbone.history.start()
}



// x..x..x..x..x..x..x..x..x..x..x..x..x..x..x..x..
// NECESSARY FOR USER FUNCTIONALITY. DO NOT CHANGE. 
export const app_name = init()
app()
// x..x..x..x..x..x..x..x..x..x..x..x..x..x..x..x..