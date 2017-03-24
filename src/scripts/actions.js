import STORE from './store'
import {ListingModel} from './models/collections'

var ACTIONS = {
	addListing: function(listingData) {
		var newListing = new ListingModel(listingData)
		newListing.save()
			.then(
				function(response) {
					ACTIONS.fetchAllListings()
				},
				function(err) {
				}
			)
		STORE.set({
			listingCollection: listingColl
		})
	},
	fetchAllListings: function() {
		var listingColl = STORE.get('listingCollection')
		listingColl.fetch()
			.then(function() {
				STORE.set({
					listingCollection: listingColl
				})
			})
	}
}

export default ACTIONS