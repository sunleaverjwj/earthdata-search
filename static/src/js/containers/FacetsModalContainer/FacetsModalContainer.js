import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions'

import FacetsModal from '../../components/Facets/FacetsModal'

const mapStateToProps = state => ({
  collectionHits: state.searchResults.viewAllFacets.hits,
  viewAllFacets: state.searchResults.viewAllFacets,
  isOpen: state.ui.facetsModal.isOpen
})

const mapDispatchToProps = dispatch => ({
  onChangeViewAllFacet:
    (e, facetLinkInfo) => dispatch(actions.changeViewAllFacet(e, facetLinkInfo)),
  onToggleFacetsModal:
    state => dispatch(actions.toggleFacetsModal(state)),
  onApplyViewAllFacets:
    () => dispatch(actions.applyViewAllFacets())
})

export const FacetsModalContainer = ({
  collectionHits,
  viewAllFacets,
  isOpen,
  onApplyViewAllFacets,
  onChangeViewAllFacet,
  onToggleFacetsModal
}) => (
  <FacetsModal
    collectionHits={collectionHits}
    viewAllFacets={viewAllFacets}
    isOpen={isOpen}
    onApplyViewAllFacets={onApplyViewAllFacets}
    onChangeViewAllFacet={onChangeViewAllFacet}
    onToggleFacetsModal={onToggleFacetsModal}
  />
)

FacetsModalContainer.defaultProps = {
  collectionHits: null
}

FacetsModalContainer.propTypes = {
  collectionHits: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  onApplyViewAllFacets: PropTypes.func.isRequired,
  onChangeViewAllFacet: PropTypes.func.isRequired,
  onToggleFacetsModal: PropTypes.func.isRequired,
  viewAllFacets: PropTypes.shape({}).isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(FacetsModalContainer)
