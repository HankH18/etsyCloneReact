import Backbone from 'backbone'

var baseUrl = "https://openapi.etsy.com/v2/listings/active.js"
var apiKey = "mvk7lu427evopxj9ggvyb3q3"
var searchUrl = "https://openapi.etsy.com/v2/listings/"

export var EtsyCollection = Backbone.Collection.extend({
	url: baseUrl,
	parse: function(apiResponse) {
		return apiResponse.results
	},
})

export var ProductModel = Backbone.Model.extend({
	url: searchUrl,
	parse: function(apiResponse) {
		return apiResponse.results[0]
	}
})

export var ListingModel = Backbone.Model.extend({
	url: '/api/myListings',
	idAttribute: '_id'
})

export var ListingCollection = Backbone.Collection.extend({
	comparator: function(mod) {
		return new Date(mod.get('createdAt')).getTime() * -1
	},
	model: ListingModel,
	url: '/api/myListings'
})