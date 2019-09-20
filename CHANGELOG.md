# Leaflet-WFST Changelog
All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
* Option `forceMulti` for explicitly create Multi GML even when L.Layer is simple polyline or polygon
* Add xsi:nil attribute for non-value properties in transaction requests
* Store geometryTypeName in featureType
* Add parsing for double primitive
* Add new option `withCredentials` to configure outgoing requests sending through XMLHttpRequest.

### Fixed
* Transaction request represent dates as ISO formatted strings


### Changed
* helper function in wfst change names to insertElement, updateElement, removeElement
* Change multiclasses `toGml` to gml3 syntax

## [2.0.0] - 2017-08-30
### Added
* Add `getCapabilities` and `getBoundingBox` methods.
* Add new and refactor old filters: Equals, Disjoint, Touches, Within, Overlaps, Crosses, Intersects, Contains, Dwithin, Beyond, BBox, GmlObjectID, Add, Sub, Mul, Div, EQ, NotEQ, LT, GT, LEQ, GEQ, Like, IsNull, IsBetween, And, Or, Not, Function.

## [1.1.1] - 2017-05-30
### Added
* Add support for custom headers in AJAX requests.
* Add GML-format support for L.CircleMarker.

### Fixed
* Fix several typos and bugs in plugin helpers and utils.

## [1.1.0] - 2016-11-10
### Added
* Add `error` event.
* Add L.LatLngBounds `toGml` extension method.
* Add BBOX filer.
* Add EQ filter.
* Add Intersects filter.

### Fixed
* Fix some features geometry & properties parsing problems.

## [1.0.0] - 2015-06-15
### Added
* Add WFS and WFST layers.
* Add GmlObjectID filter.
* Add `addLayer`, `editLayer`, `removeLayer` and `save` methods for WFST.
