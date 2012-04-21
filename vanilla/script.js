/* Navigation constructor function */
function Navigation(DOM) {
	Navigation.extendDOM(this, DOM);
	this.navigationItems = [];
	this.visibleNavigationItem;
	this.init();

	Navigation.getInstance = (function(_this) {
		return function() { return _this; }
	})(this);
}

Navigation.extendDOM = function(child, DOM) {
	for(var i in DOM) {
		child[i] = DOM[i];
	}
}

Navigation.timer = null;
Navigation.mouseOverSensitivity = 70; // in ms
Navigation.mouseOutSensitivity = 500; // in ms

Navigation.prototype.init = function() {
	var childNodes = this.childNodes;
	for(var i=0; i<childNodes.length; i++) {
		var childNode = childNodes[i];
		if (childNode.nodeType === 1 && childNode.className == 'has-drop-down-menu') {
			this.navigationItems.push(new NavigationItem(childNode));
		}
	}
}

Navigation.prototype.setVisibleNavigationItem = function(navigationItem) {
	if (navigationItem.constructor === NavigationItem) {
		this.visibleNavigationItem = navigationItem;
	} else {
		throw new Error('This is not a NavigationItem object.');
	}
}

Navigation.prototype.getVisibleNavigationItem = function() {
	return this.visibleNavigationItem;
}


/* NavigationItem constructor function */
function NavigationItem(DOM) {
	Navigation.extendDOM(this, DOM);
	this.itemLink;
	this.dropDownMenu;
	this.init();
}

NavigationItem.prototype.init = function() {
	this.initItemLink();
	this.initDropDownMenu();
}

NavigationItem.prototype.initItemLink = function() {
	this.itemLink = this.findItemLink();

	var _this = this;
	var mouseOverEventHandler = function(e) { _this.mouseOverHandler(e); };
	var mouseOutEventHandler = function(e) { _this.mouseOutHandler(e); };
	if (window.attachEvent) {
		this.itemLink.attachEvent('onmouseover', mouseOverEventHandler, false);
		this.itemLink.attachEvent('onmouseout', mouseOutEventHandler, false);
	} else {
		this.itemLink.addEventListener('mouseover', mouseOverEventHandler, false);
		this.itemLink.addEventListener('mouseout', mouseOutEventHandler, false);
	}
}

NavigationItem.prototype.findItemLink = function() {
	var childNodes = this.childNodes;
	for(var i=0; i<childNodes.length; i++) {
		var childNode = childNodes[i];
		if (childNode.nodeType === 1) {
			return childNode;
		}
	}
}

NavigationItem.prototype.initDropDownMenu = function() {
	this.dropDownMenu = this.findDropDownMenu();
	
	var _this = this;
	var mouseOverEventHandler = function(e) { _this.mouseOverHandler(e); };
	var mouseOutEventHandler = function(e) { _this.mouseOutHandler(e); };
	if (window.attachEvent) {
		this.dropDownMenu.attachEvent('onmouseover', mouseOverEventHandler, false);
		this.dropDownMenu.attachEvent('onmouseout', mouseOutEventHandler, false);
	} else {
		this.dropDownMenu.addEventListener('mouseover', mouseOverEventHandler, false);
		this.dropDownMenu.addEventListener('mouseout', mouseOutEventHandler, false);
	}
}

NavigationItem.prototype.findDropDownMenu = function() {
	var nextSibling = this.itemLink.nextSibling;
	while(nextSibling.nodeType !== 1) {
		nextSibling = nextSibling.nextSibling;
	}
	return nextSibling;
}


NavigationItem.prototype.mouseOverHandler = function(e) {

	window.clearTimeout(Navigation.timer);

	var _this = this;
	Navigation.timer = window.setTimeout(function() {
		var visibleNavigationItem = Navigation.getInstance().getVisibleNavigationItem();
		if (visibleNavigationItem !== _this) {
			if (visibleNavigationItem != undefined) {
				visibleNavigationItem.hide();
			}
			Navigation.getInstance().setVisibleNavigationItem(_this);
		}
		_this.show();
	}, Navigation.mouseOverSensitivity);
}

NavigationItem.prototype.mouseOutHandler = function(e) {
	window.clearTimeout(Navigation.timer);
	
	Navigation.timer = window.setTimeout(function() {
		/*
		Here, instead of calling this.hide() we're retriving the visible menu from the navigation object.
		This is because the mouseout event might be fired from a different navigation item.
		
		This would easily happen if the user moves the mouse from an open drop-down menu to another
		navigation item and there to outside of the navigation menu very quickly
		
		All this is the side effect of using one universal timer instead creating a timer for each navigation items
		*/
		var visibleNavigationItem = nav.getVisibleNavigationItem();
		if (visibleNavigationItem != undefined) {
			visibleNavigationItem.hide();
		}
	}, Navigation.mouseOutSensitivity);
}

NavigationItem.prototype.hide = function() {
	this.dropDownMenu.className = 'drop-down-menu';
}

NavigationItem.prototype.show = function() {
	this.dropDownMenu.className = 'drop-down-menu drop-down-menu-visible';
}


/* Initialize a variable with new Navigation object */
var nav = new Navigation(document.getElementById('nav'));