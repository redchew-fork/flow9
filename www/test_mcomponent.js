var $global = typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this;
var $estr = function() { return js_Boot.__string_rec(this,''); },$hxEnums = $hxEnums || {},$_;
function $extend(from, fields) {
	var proto = Object.create(from);
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var AccessWidgetTree = function(id,accessWidget,parent) {
	this.childrenTabIndex = 1;
	this.zorder = 0;
	this.nextId = 0;
	this.childrenSize = 0;
	this.children = new haxe_ds_IntMap();
	PIXI.utils.EventEmitter.call(this);
	this.set_changed(false);
	this.set_childrenChanged(false);
	this.set_id(id);
	this.set_accessWidget(accessWidget);
	this.set_parent(parent);
};
AccessWidgetTree.__name__ = true;
AccessWidgetTree.__super__ = PIXI.utils.EventEmitter;
AccessWidgetTree.prototype = $extend(PIXI.utils.EventEmitter.prototype,{
	get_id: function() {
		return this.id;
	}
	,set_id: function(id) {
		if(this.get_id() != id) {
			var parent = this.get_parent();
			if(parent != null) {
				parent.removeChild(this,false);
			}
			this.id = id;
			this.set_changed(true);
			if(parent != null) {
				parent.addChild(this);
			}
		}
		return this.get_id();
	}
	,get_accessWidget: function() {
		return this.accessWidget;
	}
	,set_accessWidget: function(accessWidget) {
		if(this.get_accessWidget() != accessWidget) {
			this.accessWidget = accessWidget;
			if(this.get_accessWidget() != null) {
				this.get_accessWidget().set_parent(this);
				this.set_changed(true);
			}
		}
		return this.get_accessWidget();
	}
	,get_parent: function() {
		return this.parent;
	}
	,set_parent: function(parent) {
		if(this.get_parent() != parent) {
			this.parent = parent;
			if(this.get_parent() != null) {
				this.get_parent().updateZorder();
			}
		}
		return this.get_parent();
	}
	,get_changed: function() {
		return this.changed;
	}
	,set_changed: function(changed) {
		if(this.get_changed() != changed) {
			this.changed = changed;
			if(this.get_changed() && this.get_parent() != null) {
				this.get_parent().set_childrenChanged(true);
			}
		}
		return this.get_changed();
	}
	,get_childrenChanged: function() {
		return this.childrenChanged;
	}
	,set_childrenChanged: function(childrenChanged) {
		if(this.get_childrenChanged() != childrenChanged) {
			this.childrenChanged = childrenChanged;
			if(this.get_childrenChanged() && this.get_parent() != null) {
				this.get_parent().set_childrenChanged(true);
			}
		}
		return this.get_childrenChanged();
	}
	,getZorder: function() {
		if(this.zorder != null) {
			return this.zorder;
		} else if(this.get_parent() != null) {
			return this.get_parent().getZorder();
		} else {
			return AccessWidget.tree.zorder;
		}
	}
	,updateZorder: function() {
		var previousZOrder = this.zorder;
		this.zorder = this.get_accessWidget() != null && this.get_accessWidget().get_zorder() != null ? this.get_accessWidget().get_zorder() : null;
		var child = this.children.iterator();
		while(child.hasNext()) {
			var child1 = child.next();
			if(child1.zorder > this.zorder || this.zorder == null) {
				this.zorder = child1.zorder;
			}
		}
		if(this.zorder == null) {
			this.updateDisplay();
			return true;
		} else if(previousZOrder != this.zorder) {
			if(this.get_parent() == null || !this.get_parent().updateZorder()) {
				this.updateDisplay();
			}
			return true;
		} else {
			return false;
		}
	}
	,getAccessWidgetTransform: function(append) {
		if(append == null) {
			append = true;
		}
		if(this.get_accessWidget() != null && this.get_accessWidget().clip != null && this.get_accessWidget().clip.parent != null && this.get_accessWidget().clip.nativeWidget != null) {
			if(append && this.get_parent() != null) {
				var parentTransform = this.get_parent().getAccessWidgetTransform(false);
				return this.get_accessWidget().clip.worldTransform.clone().append(parentTransform.clone().invert());
			} else {
				return this.get_accessWidget().clip.worldTransform;
			}
		} else if(!append && this.get_parent() != null) {
			return this.get_parent().getAccessWidgetTransform();
		} else {
			return new PIXI.Matrix();
		}
	}
	,getWidth: function() {
		if(this.get_accessWidget() != null) {
			var clip = this.get_accessWidget().clip;
			var _e = clip;
			if(clip.getWidth != null) {
				return clip.getWidth();
			} else {
				return clip.getLocalBounds().width;
			}
		} else {
			return 0;
		}
	}
	,getHeight: function() {
		if(this.get_accessWidget() != null) {
			var clip = this.get_accessWidget().clip;
			var _e = clip;
			return DisplayObjectHelper.getHeight(clip);
		} else {
			return 0;
		}
	}
	,updateDisplay: function() {
		var tmp;
		if(RenderSupport.RendererType != "html") {
			if(!(this.get_accessWidget() == null || this.get_accessWidget().clip != null)) {
				var clip = this.get_accessWidget().clip;
				tmp = !((RenderSupport.RendererType == "html" || clip.isHTML) && !clip.isCanvas);
			} else {
				tmp = true;
			}
		} else {
			tmp = false;
		}
		if(tmp) {
			this.updateTransform();
			var child = this.children.iterator();
			while(child.hasNext()) {
				var child1 = child.next();
				child1.updateDisplay();
			}
		}
	}
	,updateTransform: function() {
		var tmp;
		if(this.get_accessWidget() != null && this.get_accessWidget().clip != null) {
			var clip = this.get_accessWidget().clip;
			tmp = !((RenderSupport.RendererType == "html" || clip.isHTML) && !clip.isCanvas);
		} else {
			tmp = false;
		}
		if(tmp) {
			var nativeWidget = this.get_accessWidget().get_element();
			var clip = this.get_accessWidget().clip;
			if(nativeWidget != null) {
				if(nativeWidget.style.zIndex == null || nativeWidget.style.zIndex == "") {
					var localStage = clip.stage;
					if(localStage != null) {
						var zIndex = 1000 * localStage.parent.children.indexOf(localStage) + nativeWidget.className == "droparea" ? AccessWidget.zIndexValues.droparea : AccessWidget.zIndexValues.nativeWidget;
						nativeWidget.style.zIndex = zIndex == null ? "null" : "" + zIndex;
					}
				}
				if(DisplayObjectHelper.DebugAccessOrder) {
					nativeWidget.setAttribute("worldTransform","matrix(" + clip.worldTransform.a + ", " + clip.worldTransform.b + ", " + clip.worldTransform.c + ", " + clip.worldTransform.d + ", " + clip.worldTransform.tx + ", " + clip.worldTransform.ty + ")");
					nativeWidget.setAttribute("zorder","" + this.zorder);
					nativeWidget.setAttribute("nodeindex","" + Std.string(this.get_accessWidget().get_nodeindex()));
				}
				if(this.getZorder() >= AccessWidget.tree.zorder && clip.clipVisible) {
					nativeWidget.style.display = "block";
					nativeWidget.style.opacity = clip.worldAlpha;
				} else {
					nativeWidget.style.display = "none";
					return;
				}
				DisplayObjectHelper.updateNativeWidget(clip);
			}
		}
	}
	,isFocusable: function() {
		if(this.get_accessWidget() != null && this.get_accessWidget().get_enabled() && this.get_accessWidget().get_element() != null && this.get_accessWidget().clip != null && this.get_accessWidget().clip.clipVisible) {
			return this.get_accessWidget().get_element().tabIndex >= 0;
		} else {
			return false;
		}
	}
	,getFirstAccessWidget: function() {
		if(this.get_parent() != null || this == AccessWidget.tree) {
			var _g = -1;
			var _g1 = this.nextId;
			while(_g < _g1) {
				var i = _g++;
				var child = this.children.h[i];
				if(child != null) {
					if(child.isFocusable()) {
						return child.get_accessWidget();
					} else {
						var accessWidget = child.getFirstAccessWidget();
						if(accessWidget != null) {
							return accessWidget;
						}
					}
				}
			}
		}
		return null;
	}
	,getLastAccessWidget: function() {
		if(this.get_parent() != null || this == AccessWidget.tree) {
			var _g = 1;
			var _g1 = this.nextId + 1;
			while(_g < _g1) {
				var i = _g++;
				var child = this.children.h[this.nextId - i];
				if(child != null) {
					if(child.isFocusable()) {
						return child.get_accessWidget();
					} else {
						var accessWidget = child.getLastAccessWidget();
						if(accessWidget != null) {
							return accessWidget;
						}
					}
				}
			}
		}
		return null;
	}
	,getPreviousAccessWidget: function() {
		if(this.get_parent() != null) {
			if(this.get_id() != -1) {
				var _g = 1;
				var _g1 = this.get_id() + 2;
				while(_g < _g1) {
					var i = _g++;
					var this1 = this.get_parent().children;
					var key = this.get_id() - i;
					var child = this1.h[key];
					if(child != null) {
						var accessWidget = child.getLastAccessWidget();
						if(accessWidget != null) {
							return accessWidget;
						}
						if(child.isFocusable()) {
							return child.get_accessWidget();
						}
					}
				}
			}
			return this.get_parent().getPreviousAccessWidget();
		}
		return null;
	}
	,getNextAccessWidget: function() {
		if(this.get_parent() != null) {
			var _g = this.get_id() + 1;
			var _g1 = this.get_parent().nextId;
			while(_g < _g1) {
				var i = _g++;
				var child = this.get_parent().children.h[i];
				if(child != null) {
					var accessWidget = child.getFirstAccessWidget();
					if(accessWidget != null) {
						return accessWidget;
					}
					if(child.isFocusable()) {
						return child.get_accessWidget();
					}
				}
			}
			return this.get_parent().getNextAccessWidget();
		}
		return null;
	}
	,getChild: function(id) {
		return this.children.h[id];
	}
	,addChild: function(child) {
		if(child.get_parent() != null) {
			child.get_parent().removeChild(child,false);
		}
		var previousChild = this.getChild(child.get_id());
		if(previousChild == child) {
			return;
		}
		if(previousChild != null) {
			if(previousChild.get_accessWidget() != null && previousChild.get_accessWidget() != child.get_accessWidget()) {
				previousChild.set_id(this.nextId);
				this.nextId++;
				this.childrenSize++;
				var this1 = this.children;
				var key = child.get_id();
				this1.h[key] = child;
				child.set_parent(this);
				child.emit("added");
			} else {
				previousChild.set_accessWidget(child.get_accessWidget());
			}
		} else {
			if(child.get_id() >= this.nextId) {
				this.nextId = child.get_id() + 1;
			}
			this.childrenSize++;
			var this1 = this.children;
			var key = child.get_id();
			this1.h[key] = child;
			child.set_parent(this);
			child.emit("added");
		}
		this.updateZorder();
		this.set_childrenChanged(true);
	}
	,removeChild: function(child,destroy) {
		if(destroy == null) {
			destroy = true;
		}
		if(destroy && child.get_accessWidget() != null) {
			child.get_accessWidget().set_element(null);
			child.get_accessWidget().clip.accessWidget = null;
		}
		var this1 = this.children;
		var key = child.get_id();
		if(this1.h[key] == child) {
			this.children.remove(child.get_id());
			if(this.nextId == child.get_id() + 1) {
				this.nextId--;
			}
			this.childrenSize--;
			child.set_parent(null);
			child.emit("removed");
		}
		if(destroy && this.childrenSize == 0 && this.get_accessWidget() == null && this.get_parent() != null) {
			this.get_parent().removeChild(this);
		} else {
			this.updateZorder();
		}
		this.set_childrenChanged(true);
	}
	,__class__: AccessWidgetTree
});
var AccessWidget = function(clip,element,nodeindex,zorder) {
	this.focused = false;
	this.keepTagName = false;
	this.tagName = "div";
	var _gthis = this;
	PIXI.utils.EventEmitter.call(this);
	this.clip = clip;
	this.set_tabindex(-1);
	this.set_element(element);
	this.set_nodeindex(nodeindex);
	this.set_zorder(zorder);
	this.set_enabled(true);
	DisplayObjectHelper.onAdded(clip,function() {
		if(clip.accessWidget == _gthis) {
			AccessWidget.addAccessWidget(_gthis);
		}
		return function() {
			AccessWidget.removeAccessWidget(_gthis);
		};
	});
};
AccessWidget.__name__ = true;
AccessWidget.createAccessWidget = function(clip,attributes) {
	if((RenderSupport.RendererType == "html" || clip.isHTML) && !clip.isCanvas) {
		return;
	}
	if(clip.accessWidget != null) {
		AccessWidget.removeAccessWidget(clip.accessWidget);
	}
	var tagName = attributes.h["tag"];
	if(tagName == null) {
		tagName = AccessWidget.accessRoleMap.h[attributes.h["role"]];
	}
	if(tagName == null) {
		tagName = "div";
	}
	clip.accessWidget = new AccessWidget(clip,window.document.createElement(tagName));
	clip.accessWidget.addAccessAttributes(attributes);
};
AccessWidget.parseNodeIndex = function(nodeindex) {
	var nodeindexStrings = new EReg(" ","g").split(nodeindex);
	var parsedNodeindex = [];
	var _g = 0;
	var _g1 = nodeindexStrings.length;
	while(_g < _g1) {
		var i = _g++;
		parsedNodeindex = parsedNodeindex.concat([Std.parseInt(nodeindexStrings[i])]);
	}
	return parsedNodeindex;
};
AccessWidget.addAccessWidget = function(accessWidget,nodeindexPosition,tree) {
	if(nodeindexPosition == null) {
		nodeindexPosition = 0;
	}
	if(accessWidget.get_nodeindex() == null || accessWidget.get_nodeindex().length == 0) {
		AccessWidget.addAccessWidgetWithoutNodeindex(accessWidget,accessWidget.clip.parent);
		return;
	}
	if(tree == null) {
		tree = AccessWidget.tree;
	}
	var id = accessWidget.get_nodeindex()[nodeindexPosition];
	if(nodeindexPosition == accessWidget.get_nodeindex().length - 1) {
		if(accessWidget.get_parent() != null) {
			accessWidget.get_parent().set_id(id);
			tree.addChild(accessWidget.get_parent());
		} else {
			tree.addChild(new AccessWidgetTree(id,accessWidget));
		}
	} else {
		if(tree.getChild(id) == null) {
			tree.addChild(new AccessWidgetTree(id,null));
		}
		AccessWidget.addAccessWidget(accessWidget,nodeindexPosition + 1,tree.getChild(id));
	}
};
AccessWidget.addAccessWidgetWithoutNodeindex = function(accessWidget,parent) {
	if(parent == null) {
		return;
	} else if(parent == RenderSupport.PixiStage || parent.accessWidget != null && parent.accessWidget.parent != null) {
		var id = parent == RenderSupport.PixiStage ? AccessWidget.tree.nextId : parent.accessWidget.parent.nextId;
		var tree = parent == RenderSupport.PixiStage ? AccessWidget.tree : parent.accessWidget.parent;
		if(accessWidget.get_parent() != null) {
			accessWidget.get_parent().set_id(id);
			tree.addChild(accessWidget.get_parent());
		} else {
			tree.addChild(new AccessWidgetTree(id,accessWidget));
		}
	} else if(parent.parent == null) {
		parent.once("added",function() {
			if(parent != null && parent.parent != null && accessWidget != null && accessWidget.clip != null && accessWidget.clip.parent != null) {
				AccessWidget.addAccessWidgetWithoutNodeindex(accessWidget,parent);
			}
		});
	} else if(parent.accessWidget != null && parent.accessWidget.parent == null) {
		parent.accessWidget.once("added",function() {
			if(parent != null && parent.parent != null && parent.accessWidget != null && accessWidget.clip != null && accessWidget.clip.parent != null) {
				AccessWidget.addAccessWidgetWithoutNodeindex(accessWidget,parent);
			}
		});
	} else {
		AccessWidget.addAccessWidgetWithoutNodeindex(accessWidget,parent.parent);
	}
};
AccessWidget.removeAccessWidget = function(accessWidget) {
	if(accessWidget != null && accessWidget.get_parent() != null) {
		AccessWidget.removeAccessWidgetTree(accessWidget.get_parent());
		accessWidget.emit("removed");
	}
};
AccessWidget.removeAccessWidgetTree = function(tree) {
	if(tree.get_parent() != null) {
		tree.get_parent().removeChild(tree);
		tree.emit("removed");
	}
};
AccessWidget.printTree = function(tree,id) {
	if(id == null) {
		id = "";
	}
	if(tree == null) {
		tree = AccessWidget.tree;
	}
	var key = tree.children.keys();
	while(key.hasNext()) {
		var key1 = key.next();
		var parent = tree.children.h[key1];
		var accessWidget = parent.get_accessWidget();
		haxe_Log.trace(id + key1 + " " + (accessWidget != null && accessWidget.get_element() != null ? Std.string(accessWidget.get_nodeindex()) + " " + accessWidget.get_element().getAttribute("role") : "null"),{ fileName : "AccessWidget.hx", lineNumber : 1129, className : "AccessWidget", methodName : "printTree"});
		AccessWidget.printTree(tree.children.h[key1],id + key1 + " ");
	}
};
AccessWidget.updateAccessTree = function(tree,parent,previousElement,childrenChanged) {
	if(childrenChanged == null) {
		childrenChanged = false;
	}
	if(tree == null) {
		tree = AccessWidget.tree;
		if(DisplayObjectHelper.DebugAccessOrder && tree.get_childrenChanged()) {
			AccessWidget.printTree();
		}
	}
	if(!tree.get_childrenChanged() && !childrenChanged) {
		return tree.childrenTabIndex;
	}
	tree.childrenTabIndex = tree.get_parent() != null ? tree.get_parent().childrenTabIndex : 1;
	if(parent == null) {
		parent = window.document.body;
	}
	var key = tree.children.keys();
	while(key.hasNext()) {
		var key1 = key.next();
		var child = tree.children.h[key1];
		childrenChanged = childrenChanged || child.get_childrenChanged();
		if(!child.get_childrenChanged() && !child.get_changed() && !childrenChanged) {
			tree.childrenTabIndex = child.childrenTabIndex;
			continue;
		}
		var accessWidget = child.get_accessWidget();
		if(accessWidget != null && accessWidget.get_element() != null) {
			var tmp;
			if(RenderSupport.RendererType != "html") {
				if(accessWidget.clip != null) {
					var clip = accessWidget.clip;
					tmp = !((RenderSupport.RendererType == "html" || clip.isHTML) && !clip.isCanvas);
				} else {
					tmp = true;
				}
			} else {
				tmp = false;
			}
			if(tmp) {
				if(child.get_changed()) {
					try {
						if(previousElement != null && previousElement.nextSibling != null && previousElement.parentNode == parent) {
							parent.insertBefore(accessWidget.get_element(),previousElement.nextSibling);
						} else {
							parent.appendChild(accessWidget.get_element());
						}
						child.set_changed(false);
					} catch( _g ) {
						haxe_NativeStackTrace.lastError = _g;
					}
				}
				previousElement = accessWidget.get_element();
			}
			if(accessWidget.tagName == "button" || accessWidget.tagName == "input" || accessWidget.tagName == "textarea" || accessWidget.get_role() == "slider" || accessWidget.tagName == "iframe") {
				tree.childrenTabIndex++;
				accessWidget.set_tabindex(tree.childrenTabIndex);
			}
			tree.childrenTabIndex = AccessWidget.updateAccessTree(child,accessWidget.get_element(),accessWidget.get_element().firstElementChild,childrenChanged);
		} else {
			tree.childrenTabIndex = AccessWidget.updateAccessTree(child,parent,previousElement,childrenChanged);
		}
	}
	tree.set_childrenChanged(false);
	return tree.childrenTabIndex;
};
AccessWidget.__super__ = PIXI.utils.EventEmitter;
AccessWidget.prototype = $extend(PIXI.utils.EventEmitter.prototype,{
	get_element: function() {
		return this.element;
	}
	,hasTabIndex: function() {
		if(!(this.tagName == "button" || this.tagName == "input" || this.tagName == "textarea" || this.get_role() == "slider")) {
			return this.tagName == "iframe";
		} else {
			return true;
		}
	}
	,set_element: function(element) {
		var _gthis = this;
		if(this.get_element() != element) {
			var tmp;
			if(this.get_element() != null && this.get_element().parentNode != null) {
				if(element == null) {
					if(RenderSupport.RendererType != "html") {
						if(this.clip != null) {
							var clip = this.clip;
							tmp = !((RenderSupport.RendererType == "html" || clip.isHTML) && !clip.isCanvas);
						} else {
							tmp = true;
						}
					} else {
						tmp = false;
					}
				} else {
					tmp = true;
				}
			} else {
				tmp = false;
			}
			if(tmp) {
				this.get_element().parentNode.removeChild(this.get_element());
				delete this.element;
			}
			this.element = element;
			if(this.get_element() != null) {
				this.tagName = element.tagName.toLowerCase();
				if(this.clip != null) {
					var tmp = this.tagName == "button" || this.tagName == "input" || this.tagName == "textarea" || this.get_role() == "slider" || this.tagName == "iframe" || this.tagName == "iframe" || this.get_role() == "iframe";
					this.clip.keepNativeWidget = tmp;
					DisplayObjectHelper.updateKeepNativeWidgetChildren(this.clip);
				}
				var onFocus = function() {
					_gthis.focused = true;
					if(RenderSupport.EnableFocusFrame) {
						_gthis.get_element().classList.add("focused");
					}
					if(RenderSupport.Animating) {
						RenderSupport.once("stagechanged",function() {
							if(_gthis.focused) {
								if(_gthis.get_element() != null) {
									_gthis.get_element().focus();
								}
								if(RenderSupport.EnableFocusFrame) {
									_gthis.get_element().classList.add("focused");
								}
							}
						});
						return;
					}
					_gthis.clip.emit("focus");
					var parent = _gthis.clip.parent;
					if(parent != null) {
						DisplayObjectHelper.emitEvent(parent,"childfocused",_gthis.clip);
					}
				};
				var onBlur = function() {
					if(RenderSupport.Animating || _gthis.clip.preventBlur) {
						RenderSupport.once("stagechanged",function() {
							if(_gthis.focused) {
								if(_gthis.get_element() != null) {
									_gthis.get_element().focus();
								}
								if(RenderSupport.EnableFocusFrame) {
									_gthis.get_element().classList.add("focused");
								}
							}
						});
						return;
					}
					RenderSupport.once("drawframe",function() {
						_gthis.focused = false;
						if(_gthis.get_element() != null) {
							_gthis.get_element().classList.remove("focused");
						}
						_gthis.clip.emit("blur");
					});
				};
				if(this.get_element().tagName.toLowerCase() == "iframe") {
					this.get_element().tabIndex = this.get_tabindex();
					var fn = function() {
					};
					fn = function() {
						RenderSupport.defer(function() {
							if(window.document.activeElement == _gthis.get_element()) {
								onFocus();
							} else {
								onBlur();
								window.removeEventListener("focus",fn);
								window.removeEventListener("blur",fn);
							}
						});
					};
					this.get_element().addEventListener("mouseenter",function() {
						if(window.document.activeElement == null || window.document.activeElement == window.document.body) {
							window.focus();
						}
						window.addEventListener("focus",fn);
						window.addEventListener("blur",fn);
					});
					this.get_element().addEventListener("mouseleave",function() {
						if(!_gthis.focused) {
							window.removeEventListener("focus",fn);
							window.removeEventListener("blur",fn);
						}
					});
				}
				this.get_element().addEventListener("focus",onFocus);
				this.get_element().addEventListener("blur",onBlur);
				if(this.tagName == "button") {
					this.get_element().classList.remove("accessElement");
					this.get_element().classList.add("accessButton");
				} else if(this.tagName == "div") {
					this.get_element().classList.remove("accessButton");
					this.get_element().classList.add("accessElement");
				} else if(this.tagName == "form") {
					this.get_element().classList.remove("accessButton");
					this.get_element().classList.remove("accessElement");
					this.get_element().onsubmit = function() {
						return false;
					};
				}
				if((this.tagName == "button" || this.tagName == "input" || this.tagName == "textarea" || this.get_role() == "slider" || this.tagName == "iframe") && this.get_tabindex() < 0) {
					this.set_tabindex(0);
				}
				if(this.get_parent() != null) {
					this.get_parent().set_changed(true);
				}
			}
		}
		return this.get_element();
	}
	,get_nodeindex: function() {
		return this.nodeindex;
	}
	,set_nodeindex: function(nodeindex) {
		if(this.get_nodeindex() != nodeindex) {
			this.nodeindex = nodeindex;
			if(this.clip.parent != null) {
				AccessWidget.addAccessWidget(this);
			}
		}
		return this.get_nodeindex();
	}
	,get_zorder: function() {
		return this.zorder;
	}
	,set_zorder: function(zorder) {
		if(this.get_zorder() != zorder) {
			this.zorder = zorder;
			this.updateZorder();
		}
		return this.get_zorder();
	}
	,get_tabindex: function() {
		return this.tabindex;
	}
	,set_tabindex: function(tabindex) {
		if(this.get_tabindex() != tabindex) {
			this.tabindex = tabindex;
			if(this.get_enabled() && (this.tagName == "button" || this.tagName == "input" || this.tagName == "textarea" || this.get_role() == "slider" || this.tagName == "iframe")) {
				this.get_element().tabIndex = tabindex;
			}
		}
		return this.get_tabindex();
	}
	,get_role: function() {
		return this.get_element().getAttribute("role");
	}
	,set_role: function(role) {
		var _gthis = this;
		if(role != "" && role != "iframe") {
			this.get_element().setAttribute("role",role);
		} else {
			this.get_element().removeAttribute("role");
		}
		if(this.clip != null) {
			var tmp = this.tagName == "button" || this.tagName == "input" || this.tagName == "textarea" || this.get_role() == "slider" || this.tagName == "iframe" || this.tagName == "iframe" || role == "iframe";
			this.clip.keepNativeWidget = tmp;
			DisplayObjectHelper.updateKeepNativeWidgetChildren(this.clip);
		}
		var tmp;
		if(RenderSupport.RendererType == "html" && !this.keepTagName) {
			if(this.clip != null) {
				var clip = this.clip;
				tmp = (RenderSupport.RendererType == "html" || clip.isHTML) && !clip.isCanvas;
			} else {
				tmp = true;
			}
		} else {
			tmp = false;
		}
		if(tmp && AccessWidget.accessRoleMap.h[role] != null && AccessWidget.accessRoleMap.h[role] != "input" && this.get_element().tagName.toLowerCase() != AccessWidget.accessRoleMap.h[role]) {
			var newElement = AccessWidget.accessRoleMap.h[role];
			var newElement1 = window.document.createElement(newElement);
			var _g = 0;
			var _g1 = this.get_element().attributes;
			while(_g < _g1.length) {
				var attr = _g1[_g];
				++_g;
				newElement1.setAttribute(attr.name,attr.value);
			}
			var _g = 0;
			var _g1 = this.get_element().childNodes;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				newElement1.appendChild(child);
			}
			if(this.get_element().parentNode != null) {
				this.get_element().parentNode.insertBefore(newElement1,this.get_element());
				this.get_element().parentNode.removeChild(this.get_element());
			}
			this.clip.nativeWidget = newElement1;
			this.set_element(newElement1);
		}
		if(AccessWidget.accessRoleMap.h[role] == "button") {
			this.get_element().onclick = function(e) {
				if(Util.getParameter("debug_click") == "1") {
					console.log("button onclick");
				}
				if(e.target == _gthis.get_element() && (e.detail == 0 || e.detail == 1 && RenderSupport.IsFullScreen)) {
					if(_gthis.clip.accessCallback != null) {
						_gthis.clip.accessCallback();
					}
				}
			};
			var stage = RenderSupport.PixiStage;
			var onpointerdown = function(e) {
				if(Util.getParameter("debug_click") == "1") {
					console.log("button onpointerdown");
				}
				e.preventDefault();
				var rootPos = RenderSupport.getRenderRootPos(stage);
				var mousePos = RenderSupport.getMouseEventPosition(e,rootPos);
				if(e.touches != null) {
					RenderSupport.TouchPoints = e.touches;
					RenderSupport.emit("touchstart");
					if(e.touches.length == 1) {
						var touchPos = RenderSupport.getMouseEventPosition(e.touches[0],rootPos);
						RenderSupport.setMousePosition(touchPos);
						if(RenderSupport.MouseUpReceived) {
							stage.emit("mousedown");
						}
					} else if(e.touches.length > 1) {
						var touchPos1 = RenderSupport.getMouseEventPosition(e.touches[0],rootPos);
						var touchPos2 = RenderSupport.getMouseEventPosition(e.touches[1],rootPos);
						GesturesDetector.processPinch(touchPos1,touchPos2);
					}
				} else if(!Platform.isMobile || e.pointerType == null || e.pointerType != "touch" || !RenderSupport.isMousePositionEqual(mousePos)) {
					RenderSupport.setMousePosition(mousePos);
					if(e.which == 3 || e.button == 2) {
						stage.emit("mouserightdown");
					} else if(e.which == 2 || e.button == 1) {
						stage.emit("mousemiddledown");
					} else if(e.which == 1 || e.button == 0) {
						if(RenderSupport.MouseUpReceived) {
							stage.emit("mousedown");
						}
					}
				}
				e.preventDefault();
				e.stopPropagation();
			};
			var onpointerup = function(e) {
				if(Util.getParameter("debug_click") == "1") {
					console.log("button onpointerup");
				}
				var rootPos = RenderSupport.getRenderRootPos(stage);
				var mousePos = RenderSupport.getMouseEventPosition(e,rootPos);
				if(e.touches != null) {
					RenderSupport.TouchPoints = e.touches;
					RenderSupport.emit("touchend");
					GesturesDetector.endPinch();
					if(e.touches.length == 0) {
						if(!RenderSupport.MouseUpReceived) {
							stage.emit("mouseup");
						}
					}
				} else if(!Platform.isMobile || e.pointerType == null || e.pointerType != "touch" || !RenderSupport.isMousePositionEqual(mousePos)) {
					RenderSupport.setMousePosition(mousePos);
					if(e.which == 3 || e.button == 2) {
						stage.emit("mouserightup");
					} else if(e.which == 2 || e.button == 1) {
						stage.emit("mousemiddleup");
					} else if(e.which == 1 || e.button == 0) {
						if(!RenderSupport.MouseUpReceived) {
							stage.emit("mouseup");
						}
					}
				}
				e.preventDefault();
				e.stopPropagation();
			};
			if(Platform.isMobile) {
				if(role == "button") {
					if(Platform.isAndroid || Platform.isSafari && Platform.browserMajorVersion >= 13) {
						this.get_element().onpointerdown = onpointerdown;
						this.get_element().onpointerup = onpointerup;
					}
					this.get_element().ontouchstart = onpointerdown;
					this.get_element().ontouchend = onpointerup;
				}
			} else if(Platform.isSafari) {
				this.get_element().onmousedown = onpointerdown;
				this.get_element().onmouseup = onpointerup;
			} else {
				this.get_element().onpointerdown = onpointerdown;
				this.get_element().onpointerup = onpointerup;
			}
			this.get_element().oncontextmenu = function(e) {
				var preventContextMenu = _gthis.clip.isInput != true;
				if(preventContextMenu) {
					e.preventDefault();
				}
				e.stopPropagation();
				return !preventContextMenu;
			};
		} else if(role == "textbox") {
			this.get_element().onkeyup = function(e) {
				if(e.keyCode == 13 && _gthis.clip.accessCallback != null) {
					_gthis.clip.accessCallback();
				}
			};
		}
		if((this.tagName == "button" || this.tagName == "input" || this.tagName == "textarea" || this.get_role() == "slider" || this.tagName == "iframe") && this.get_tabindex() < 0) {
			this.set_tabindex(0);
		}
		return this.get_role();
	}
	,get_description: function() {
		return this.get_element().getAttribute("aria-label");
	}
	,set_description: function(description) {
		if(description != "") {
			this.get_element().setAttribute("aria-label",description);
		} else {
			this.get_element().removeAttribute("aria-label");
		}
		return this.get_description();
	}
	,get_id: function() {
		return this.get_element().id;
	}
	,set_id: function(id) {
		this.get_element().id = id;
		return this.get_id();
	}
	,get_enabled: function() {
		return this.enabled;
	}
	,set_enabled: function(enabled) {
		if(this.get_enabled() != enabled) {
			this.enabled = enabled;
			if(enabled) {
				this.get_element().removeAttribute("disabled");
				if(this.tagName == "button" || this.tagName == "input" || this.tagName == "textarea" || this.get_role() == "slider" || this.tagName == "iframe") {
					this.get_element().tabIndex = this.get_tabindex();
				}
			} else {
				if(!Platform.isFirefox && !Platform.isSafari) {
					this.get_element().setAttribute("disabled","disabled");
				}
				if(this.tagName == "button" || this.tagName == "input" || this.tagName == "textarea" || this.get_role() == "slider" || this.tagName == "iframe") {
					this.get_element().tabIndex = -1;
				}
			}
		}
		return this.get_enabled();
	}
	,get_autocomplete: function() {
		return this.get_element().autocomplete;
	}
	,set_autocomplete: function(autocomplete) {
		this.get_element().autocomplete = autocomplete;
		if(this.clip.setReadOnly != null) {
			this.clip.setReadOnly(this.clip.readOnly);
		}
		return this.get_autocomplete();
	}
	,get_parent: function() {
		return this.parent;
	}
	,set_parent: function(parent) {
		if(this.get_parent() != parent) {
			this.parent = parent;
			if(parent != null) {
				this.emit("added");
				this.updateZorder();
			}
		}
		return this.get_parent();
	}
	,addAccessAttributes: function(attributes) {
		var _gthis = this;
		var h = attributes.h;
		var key_h = h;
		var key_keys = Object.keys(h);
		var key_length = key_keys.length;
		var key_current = 0;
		while(key_current < key_length) {
			var key = key_keys[key_current++];
			switch(key) {
			case "aria-hidden":
				DisplayObjectHelper.updateIsAriaHidden(this.clip,attributes.h[key] == "true");
				break;
			case "autocomplete":
				this.set_autocomplete(attributes.h[key]);
				break;
			case "description":
				this.set_description(attributes.h[key]);
				break;
			case "enabled":
				this.set_enabled(attributes.h[key] == "true");
				break;
			case "id":
				this.set_id(attributes.h[key]);
				break;
			case "keepableTagName":
				this.tagName = attributes.h[key];
				this.keepTagName = true;
				break;
			case "nextWidgetId":
				this.clip.nextWidgetId = attributes.h[key];
				RenderSupport.once("stagechanged",function() {
					var _g = 0;
					var _g1 = _gthis.getTextClipChildren(_gthis.clip);
					while(_g < _g1.length) {
						var textClip = _g1[_g];
						++_g;
						textClip.temporarilyPreventBlur();
					}
					DisplayObjectHelper.addNativeWidget(_gthis.clip);
				});
				break;
			case "nodeindex":
				var nodeindex = attributes.h[key];
				var nodeindexStrings = new EReg(" ","g").split(nodeindex);
				var parsedNodeindex = [];
				var _g = 0;
				var _g1 = nodeindexStrings.length;
				while(_g < _g1) {
					var i = _g++;
					parsedNodeindex = parsedNodeindex.concat([Std.parseInt(nodeindexStrings[i])]);
				}
				this.set_nodeindex(parsedNodeindex);
				break;
			case "role":
				this.set_role(attributes.h[key]);
				break;
			case "tabindex":
				this.set_tabindex(Std.parseInt(attributes.h[key]));
				break;
			case "zorder":
				if(this.get_zorder() != null) {
					this.set_zorder(Std.parseInt(attributes.h[key]));
					this.updateZorder();
				} else {
					this.set_zorder(Std.parseInt(attributes.h[key]));
				}
				break;
			default:
				if(this.get_element() != null) {
					if(key.indexOf("style:") == 0) {
						this.get_element().style.setProperty(HxOverrides.substr(key,6,key.length),attributes.h[key]);
					} else if(attributes.h[key] != "") {
						this.get_element().setAttribute(key,attributes.h[key]);
					} else {
						this.get_element().removeAttribute(key);
					}
				}
			}
		}
	}
	,getTextClipChildren: function(clip) {
		var _gthis = this;
		if(clip.children == null) {
			return [];
		}
		var textClips = [];
		clip.children.map(function(child) {
			if(HaxeRuntime.instanceof(child,TextClip)) {
				textClips = textClips.concat([child]);
			} else {
				textClips = textClips.concat(_gthis.getTextClipChildren(child));
			}
		});
		return textClips;
	}
	,getAccessWidgetTransform: function() {
		if(this.get_parent() != null) {
			return this.get_parent().getAccessWidgetTransform();
		} else if(this.clip != null) {
			return this.clip.worldTransform;
		} else {
			return new PIXI.Matrix();
		}
	}
	,updateZorder: function() {
		if(this.get_parent() != null) {
			this.get_parent().updateZorder();
		}
	}
	,updateDisplay: function() {
		if(this.get_parent() != null) {
			this.get_parent().updateDisplay();
		}
	}
	,updateTransform: function() {
		if(this.get_parent() != null) {
			this.get_parent().updateTransform();
		}
	}
	,__class__: AccessWidget
});
var Assert = function() { };
Assert.__name__ = true;
Assert.check = function(cond,message) {
	if(!cond) {
		var message1 = "Assertion" + (message != null ? ": " + message : "");
		Assert.printStack("Failure: " + message1);
		throw haxe_Exception.thrown(message1);
	}
};
Assert.fail = function(message) {
	Assert.printStack("Failure: " + message);
	throw haxe_Exception.thrown(message);
};
Assert.printStack = function(message) {
	if(message != null) {
		Errors.print(message);
	}
	Errors.print(Assert.callStackToString(haxe_CallStack.callStack()));
};
Assert.printExnStack = function(message) {
	if(message != null) {
		Errors.print(message);
	}
	Errors.print(Assert.callStackToString(haxe_CallStack.exceptionStack()));
};
Assert.callStackToString = function(stack) {
	return haxe_CallStack.toString(stack);
};
Assert.trace = function(s) {
	var stack = haxe_CallStack.callStack();
	var loc = "<unknown>";
	var i = 2;
	var _g = 0;
	while(_g < stack.length) {
		var s1 = stack[_g];
		++_g;
		if(s1._hx_index == 2) {
			var _g1 = s1.column;
			var item = s1.s;
			var file = s1.file;
			var pos = s1.line;
			if(--i == 0) {
				loc = file + ": " + pos;
				break;
			}
		}
	}
	Errors.print("TRACE: at " + loc + ": " + s);
};
Assert.memStat = function(message) {
	var msg = message != null ? message + ": " : "";
};
Assert.println = function(message) {
	Errors.print(message);
};
var BlurBackdropFilter = function(spread) {
	this.spread = spread;
};
BlurBackdropFilter.__name__ = true;
BlurBackdropFilter.prototype = {
	__class__: BlurBackdropFilter
};
var Util = function() { };
Util.__name__ = true;
Util.getParameter = function(name) {
	var href = window.location.href;
	var href2 = window.urlParameters ? window.urlParameters : "";
	var regexS = "[\\?&]" + name + "=([^&#]*)";
	var regex = new EReg(regexS,"");
	if(regex.match(href)) {
		var s = regex.matched(1);
		return decodeURIComponent(s.split("+").join(" "));
	} else if(regex.match(href2)) {
		var s = regex.matched(1);
		return decodeURIComponent(s.split("+").join(" "));
	} else {
		return null;
	}
};
Util.makePath = function(dir,name) {
	if(StringTools.endsWith(dir,"/")) {
		return dir + name;
	} else {
		return dir + "/" + name;
	}
};
Util.openFile = function(path,mode) {
	if(mode == null) {
		mode = true;
	}
	return null;
};
Util.createDir = function(dir) {
};
Util.println = function(s) {
};
Util.clearCache = function() {
	Util.filesCache = new haxe_ds_StringMap();
	Util.filesHashCache = new haxe_ds_StringMap();
};
Util.readFile = function(file) {
	var content = Util.filesCache.h[file];
	var tmp = content == null;
	return content;
};
Util.setFileContent = function(file,content) {
	Util.filesCache.h[file] = content;
	Util.filesHashCache.h[file] = null;
};
Util.getFileContent = function(file,content) {
	var this1 = Util.filesCache;
};
Util.fileMd5 = function(file) {
	var hash = Util.filesHashCache.h[file];
	if(hash == null) {
		var content = Util.readFile(file);
		if(content != null) {
			var this1 = Util.filesHashCache;
			var value = Md5.encode(content);
			this1.h[file] = value;
		}
	}
	return hash;
};
Util.writeFile = function(file,content) {
};
Util.compareStrings = function(a,b) {
	if(a < b) {
		return -1;
	}
	if(a > b) {
		return 1;
	}
	return 0;
};
Util.fromCharCode = function(code) {
	return String.fromCodePoint(code);
};
Util.determineCrossOrigin = function(url) {
	if(url.indexOf("data:") == 0) {
		return "";
	}
	var loc = window.location;
	var tempAnchor = window.document.createElement("a");
	tempAnchor.href = url;
	var samePort = !tempAnchor.port && loc.port == "" || tempAnchor.port == loc.port;
	if(tempAnchor.hostname != loc.hostname || !samePort || tempAnchor.protocol != loc.protocol) {
		return "anonymous";
	}
	return "";
};
Util.isMouseEventName = function(event) {
	if(!(event == "pointerdown" || event == "pointerup" || event == "pointermove" || event == "pointerover" || event == "pointerout" || event == "mouseout" || event == "mousedown" || event == "mousemove" || event == "mouseup" || event == "mousemiddledown" || event == "mousemiddleup" || event == "mousemiddledown" || event == "mousemiddleup" || event == "touchstart" || event == "touchmove")) {
		return event == "touchend";
	} else {
		return true;
	}
};
Util.getPointerEventPosition = function(e) {
	if(e.type == "touchstart" || e.type == "touchend" || e.type == "touchmove") {
		return new PIXI.Point(e.touches[0].pageX,e.touches[0].pageY);
	} else if(Util.isMouseEventName(e.type)) {
		return new PIXI.Point(e.clientX,e.clientY);
	} else {
		return new PIXI.Point(null,null);
	}
};
Util.loadJS = function(url) {
	return new Promise(function(resolve,reject) {
		var script = window.document.createElement("script");
		script.addEventListener("load",resolve);
		script.addEventListener("error",reject);
		script.addEventListener("abort",reject);
		script.src = url;
		window.document.head.appendChild(script);
	});
};
var EReg = function(r,opt) {
	this.r = new RegExp(r,opt.split("u").join(""));
};
EReg.__name__ = true;
EReg.prototype = {
	match: function(s) {
		if(this.r.global) {
			this.r.lastIndex = 0;
		}
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,matched: function(n) {
		if(this.r.m != null && n >= 0 && n < this.r.m.length) {
			return this.r.m[n];
		} else {
			throw haxe_Exception.thrown("EReg::matched");
		}
	}
	,split: function(s) {
		var d = "#__delim__#";
		return s.replace(this.r,d).split(d);
	}
	,__class__: EReg
};
var HaxeRuntime = function() { };
HaxeRuntime.__name__ = true;
HaxeRuntime.ref__ = function(val) {
	return new FlowRefObject(val);
};
HaxeRuntime.deref__ = function(val) {
	return val.__v;
};
HaxeRuntime.setref__ = function(r,v) {
	r.__v = v;
};
HaxeRuntime._s_ = function(v) {
	return v;
};
HaxeRuntime.initStruct = function(id,name,args,atypes) {
	var j='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';var l=j.length;function f(i){var c=j[i%l|0];var r=i/l|0;return r>0?c+f(r-1):c;}
	if(args!=[]){var a='';for(var i=0;i<args.length;i++)a+=(args[i]+':'+args[i]+ ','); a=a.substring(0, a.length -1);(new Function('g', 'g.c$'+f(id) + '=function(' + args.join(',') + '){return {_id:'+id.toString()+',' + a + '};}'))($global)}
	HaxeRuntime._structnames_.h[id] = name;
	HaxeRuntime._structids_.h[name] = id;
	HaxeRuntime._structargs_.h[id] = args;
	HaxeRuntime._structargtypes_.h[id] = atypes;
};
HaxeRuntime.compareEqual = function(a,b) {
	
if (a === b) return true;

	var isArray = Array.isArray;
	var keyList = Object.keys;
	var hasProp = Object.prototype.hasOwnProperty;

	if (a && b && typeof a == 'object' && typeof b == 'object') {
		var arrA = isArray(a)
		  , arrB = isArray(b)
		  , i
		  , length
		  , key;

	if (arrA && arrB) {
	  length = a.length;
	  if (length != b.length) return false;
	  for (i = length; i-- !== 0;)
		if (!HaxeRuntime.compareEqual(a[i], b[i])) return false;
	  return true;
	}

	if (arrA != arrB) return false;

	var result = false;
;
	
	if (hasProp.call(a, '_id') && hasProp.call(b, '_id')) {
		if (a._id !== b._id) {
			return false;
		} else {
			result = true;
		}
;
	
		var keys = keyList(a);
		length = keys.length;

		for (i = 1; i < length; i++) {
			key = keys[i];
			if (!HaxeRuntime.compareEqual(a[key], b[key])) return false;
		}
	}

	if (hasProp.call(a, '__v') && hasProp.call(b, '__v')) {
		return false;
	}

	return result;
}
;
	return false;
};
HaxeRuntime.compareByValue = function(o1,o2) {
	if (o1 === o2) return 0;
	if(o1 == null || o2 == null) {
		return 1;
	}
	if(Array.isArray(o1)) {
		if(!Array.isArray(o2)) {
			return 1;
		}
		var l1 = o1.length;
		var l2 = o2.length;
		var l = l1 < l2 ? l1 : l2;
		var _g = 0;
		var _g1 = l;
		while(_g < _g1) {
			var i = _g++;
			var c = HaxeRuntime.compareByValue(o1[i],o2[i]);
			if(c != 0) {
				return c;
			}
		}
		if(l1 == l2) {
			return 0;
		} else if(l1 < l2) {
			return -1;
		} else {
			return 1;
		}
	}
	if(Object.prototype.hasOwnProperty.call(o1,"_id")) {
		if(!Object.prototype.hasOwnProperty.call(o2,"_id")) {
			return 1;
		}
		var i1 = o1._id;
		var i2 = o2._id;
		if(i1 < i2) {
			return -1;
		}
		if(i1 > i2) {
			return 1;
		}
		var args = HaxeRuntime._structargs_.h[i1];
		var _g = 0;
		while(_g < args.length) {
			var f = args[_g];
			++_g;
			var c = HaxeRuntime.compareByValue(Reflect.field(o1,f),Reflect.field(o2,f));
			if(c != 0) {
				return c;
			}
		}
		return 0;
	}
	if(o1 < o2) {
		return -1;
	} else {
		return 1;
	}
};
HaxeRuntime.extractStructArguments = function(value) {
	if(!Object.prototype.hasOwnProperty.call(value,"_id")) {
		return [];
	}
	var i = value._id;
	var sargs = HaxeRuntime._structargs_.h[i];
	var n = sargs.length;
	var result = Array(n);
	var _g = 0;
	var _g1 = n;
	while(_g < _g1) {
		var i = _g++;
		result[i] = Reflect.field(value,sargs[i]);
	}
	return result;
};
HaxeRuntime.isArray = function(o1) {
	return Array.isArray(o1);
};
HaxeRuntime.nop___ = function() {
};
HaxeRuntime.isSameStructType = function(o1,o2) {
	if(!Array.isArray(o1) && !Array.isArray(o2) && Object.prototype.hasOwnProperty.call(o1,"_id") && Object.prototype.hasOwnProperty.call(o2,"_id")) {
		return o1._id == o2._id;
	} else {
		return false;
	}
};
HaxeRuntime.toStringCommon = function(value,keepStringEscapes,additionalEscapingFn) {
	if(keepStringEscapes == null) {
		keepStringEscapes = false;
	}
	if(value == null) {
		return "{}";
	}
	if(!Reflect.isObject(value)) {
		return Std.string(value);
	}
	if(Array.isArray(value)) {
		var a = value;
		var r = "[";
		var s = "";
		var _g = 0;
		while(_g < a.length) {
			var v = a[_g];
			++_g;
			var vc = HaxeRuntime.toStringCommon(v,false,additionalEscapingFn);
			r += s + vc;
			s = ", ";
		}
		return r + "]";
	}
	if(Object.prototype.hasOwnProperty.call(value,"__v")) {
		return "ref " + HaxeRuntime.toStringCommon(value.__v,false,additionalEscapingFn);
	}
	if(Object.prototype.hasOwnProperty.call(value,"_id")) {
		var id = value._id;
		var structname = HaxeRuntime._structnames_.h[id];
		var r = structname + "(";
		if(structname == "DLink") {
			return r + "...)";
		}
		var s = "";
		var args = HaxeRuntime._structargs_.h[id];
		var argTypes = HaxeRuntime._structargtypes_.h[id];
		var _g = 0;
		var _g1 = args.length;
		while(_g < _g1) {
			var i = _g++;
			var f = args[i];
			var t = argTypes[i];
			var v = Reflect.field(value,f);
			switch(t._hx_index) {
			case 3:
				r += s + Std.string(v) + ((v | 0) == v ? ".0" : "");
				break;
			case 5:
				var arrtype = t.type;
				if(!Array.isArray(v) || arrtype != RuntimeType.RTDouble) {
					r += s + HaxeRuntime.toStringCommon(v,false,additionalEscapingFn);
				} else {
					r += s + "[";
					var _g2 = 0;
					var _g3 = v.length;
					while(_g2 < _g3) {
						var j = _g2++;
						r += (j > 0 ? ", " : "") + v[j] + ((v[j] | 0) == v[j] ? ".0" : "");
					}
					r += "]";
				}
				break;
			default:
				r += s + HaxeRuntime.toStringCommon(v,false,additionalEscapingFn);
			}
			s = ", ";
		}
		r += ")";
		return r;
	}
	if(Reflect.isFunction(value)) {
		return "<function>";
	}
	try {
		var s = value;
		if(!keepStringEscapes) {
			return additionalEscapingFn(value,s);
		} else {
			StringTools.replace(s,"\\","\\\\");
			return s;
		}
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		return "<native>";
	}
};
HaxeRuntime.toString = function(value,keepStringEscapes) {
	if(keepStringEscapes == null) {
		keepStringEscapes = false;
	}
	return HaxeRuntime.toStringCommon(value,keepStringEscapes,function(val,s) {
		
					return '"' + val.replace(HaxeRuntime.regexCharsToReplaceForString, function (c) {
						if (c==='\\') {
							return '\\\\';
						} else if (c==='\"') {
							return '\\"';
						} else if (c === '\n') {
							return '\\n';
						} else if (c==='\t') {
							return '\\t';
						} else {
							return c;
						}
					}) + '"';
				;
		return "\"" + s + "\"";
	});
};
HaxeRuntime.toStringForJson = function(value) {
	return HaxeRuntime.toStringCommon(value,false,function(val,s) {
		
					return '"' + val.replace(HaxeRuntime.regexCharsToReplaceForJson, function (c) {
						if (c==='\\') {
							return '\\\\';
						} else if (c==='\"') {
							return '\\"';
						} else if (c === '\n') {
							return '\\n';
						} else if (c==='\t') {
							return '\\t';
						} else if (c.length===1 && c.charCodeAt(0)<0x20) {
							return "\\u" + c.charCodeAt(0).toString(16).padStart(4, "0");
						} else {
							return c;
						}
					}) + '"';
				;
		return "\"" + s + "\"";
	});
};
HaxeRuntime.isValueFitInType = function(type,value) {
	switch(type._hx_index) {
	case 2:
		return HaxeRuntime.typeOf(value) == RuntimeType.RTDouble;
	case 5:
		var arrtype = type.type;
		if(!Array.isArray(value)) {
			return false;
		}
		if(arrtype != RuntimeType.RTUnknown) {
			var _g = 0;
			var _g1 = value.length;
			while(_g < _g1) {
				var i = _g++;
				if(!HaxeRuntime.isValueFitInType(arrtype,value[i])) {
					return false;
				}
			}
		}
		return true;
	case 6:
		var name = type.name;
		var _g = HaxeRuntime.typeOf(value);
		if(_g._hx_index == 6) {
			var n = _g.name;
			if(name != "") {
				return n == name;
			} else {
				return true;
			}
		} else {
			return false;
		}
		break;
	case 7:
		var reftype = type.type;
		var _g = HaxeRuntime.typeOf(value);
		if(_g._hx_index == 7) {
			var t = _g.type;
			return HaxeRuntime.isValueFitInType(reftype,value.__v);
		} else {
			return false;
		}
		break;
	case 8:
		return true;
	default:
		return HaxeRuntime.typeOf(value) == type;
	}
};
HaxeRuntime.makeStructValue = function(name,args,default_value) {
	try {
		var sid = HaxeRuntime._structids_.h[name];
		if(sid == null) {
			return default_value;
		}
		var types = HaxeRuntime._structargtypes_.h[sid];
		if(types.length != args.length) {
			return default_value;
		}
		var _g = 0;
		var _g1 = args.length;
		while(_g < _g1) {
			var i = _g++;
			if(!HaxeRuntime.isValueFitInType(types[i],args[i])) {
				return default_value;
			}
		}
		var sargs = HaxeRuntime._structargs_.h[sid];
		var o = HaxeRuntime.makeEmptyStruct(sid);
		var _g = 0;
		var _g1 = args.length;
		while(_g < _g1) {
			var i = _g++;
			o[sargs[i]] = args[i];
		}
		return o;
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		return default_value;
	}
};
HaxeRuntime.fastMakeStructValue = function(n,a1) {
	var sid = HaxeRuntime._structids_.h[n];
	var o = { _id : sid};
	o[HaxeRuntime._structargs_.h[sid][0]] = a1;
	return o;
};
HaxeRuntime.fastMakeStructValue2 = function(n,a1,a2) {
	var sid = HaxeRuntime._structids_.h[n];
	var o = { _id : sid};
	o[HaxeRuntime._structargs_.h[sid][0]] = a1;
	o[HaxeRuntime._structargs_.h[sid][1]] = a2;
	return o;
};
HaxeRuntime.makeEmptyStruct = function(sid) {
	if(HaxeRuntime._structtemplates_ != null) {
		var ff = HaxeRuntime._structtemplates_.h[sid];
		if(ff != null) {
			return ff._copy();
		}
	}
	return { _id : sid};
};
HaxeRuntime.typeOf = function(value) {
	if(value == null) {
		return RuntimeType.RTVoid;
	}
	var t = typeof(value);
	switch(t) {
	case "boolean":
		return RuntimeType.RTBool;
	case "number":
		return RuntimeType.RTDouble;
	case "object":
		if(Array.isArray(value)) {
			return RuntimeType.RTArray(RuntimeType.RTUnknown);
		}
		if(Object.prototype.hasOwnProperty.call(value,"_id")) {
			return RuntimeType.RTStruct(HaxeRuntime._structnames_.h[value._id]);
		}
		if(Object.prototype.hasOwnProperty.call(value,"__v")) {
			return RuntimeType.RTRefTo(HaxeRuntime.typeOf(value.__v));
		}
		break;
	case "string":
		return RuntimeType.RTString;
	default:
	}
	return RuntimeType.RTUnknown;
};
HaxeRuntime.mul_32 = function(a,b) {
	var ah = a >> 16 & 65535;
	var al = a & 65535;
	var bh = b >> 16 & 65535;
	var bl = b & 65535;
	var high = ah * bl + al * bh & 65535;
	return -1 & (high << 16) + al * bl;
};
HaxeRuntime.getStructName = function(id) {
	return HaxeRuntime._structnames_.h[id];
};
HaxeRuntime.wideStringSafe = function(str) {
	var _g = 0;
	var _g1 = str.length;
	while(_g < _g1) {
		var i = _g++;
		var c = HxOverrides.cca(str,i);
		if(55296 <= c && c < 57344) {
			return false;
		}
	}
	return true;
};
HaxeRuntime.instanceof = function(v1,v2) {
	return ((v1) instanceof v2);
};
HaxeRuntime.typeof = function(v) {
	return typeof(v);
};
HaxeRuntime.strictEq = function(v1,v2) {
	return ((v1) === v2);
};
HaxeRuntime.getArray = function(a,i) {
	if(i < 0 || i >= a.length) {
		if(a.length == 0) {
			throw haxe_Exception.thrown("array index " + i + " is out of bounds: array is empty");
		} else {
			throw haxe_Exception.thrown("array index " + i + " is out of bounds: 0 <= i < " + a.length);
		}
	}
	return a[i];
};
var Platform = function() { };
Platform.__name__ = true;
Platform.getIsRetinaDisplay = function() {
	if(Platform.isMacintosh && window.matchMedia != null) {
		if(!((window.matchMedia && (window.matchMedia('only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx), only screen and (min-resolution: 75.6dpcm)').matches || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min--moz-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2)').matches)) || (window.devicePixelRatio && window.devicePixelRatio >= 2)) && /(iPad|iPhone|iPod)/g.test(navigator.userAgent)) {
			return getIsHighDensity();
		} else {
			return true;
		}
	} else {
		return false;
	}
};
Platform.getIsHighDensityDisplay = function() {
	return ((window.matchMedia && (window.matchMedia('only screen and (min-resolution: 124dpi), only screen and (min-resolution: 1.3dppx), only screen and (min-resolution: 48.8dpcm)').matches || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (min-device-pixel-ratio: 1.3)').matches)) || (window.devicePixelRatio && window.devicePixelRatio > 1.3));
};
var DisplayObjectHelper = function() { };
DisplayObjectHelper.__name__ = true;
DisplayObjectHelper.log = function(s) {
	console.log(s);
};
DisplayObjectHelper.debugger = function() {
	debugger;
};
DisplayObjectHelper.lockStage = function() {
	DisplayObjectHelper.InvalidateStage = false;
};
DisplayObjectHelper.unlockStage = function() {
	DisplayObjectHelper.InvalidateStage = true;
};
DisplayObjectHelper.round = function(n) {
	if(RenderSupport.RoundPixels) {
		return Math.round(n);
	} else {
		return Math.round(n * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio);
	}
};
DisplayObjectHelper.floor = function(n) {
	if(RenderSupport.RoundPixels) {
		return Math.floor(n);
	} else {
		return Math.floor(n * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio);
	}
};
DisplayObjectHelper.ceil = function(n) {
	if(RenderSupport.RoundPixels) {
		return Math.ceil(n);
	} else {
		return Math.ceil(n * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio);
	}
};
DisplayObjectHelper.invalidateStage = function(clip) {
	if(DisplayObjectHelper.InvalidateStage && (clip.visible || clip.parent != null && clip.parent.visible) && clip.stage != null) {
		if(DisplayObjectHelper.Redraw && (clip.updateGraphics == null || clip.updateGraphics.parent == null)) {
			var updateGraphics = new FlowGraphics();
			if(clip.updateGraphics == null) {
				clip.updateGraphics = updateGraphics;
				updateGraphics.beginFill(255,0.2);
				var localBounds = clip.getLocalBounds();
				updateGraphics.drawRect(localBounds.x,localBounds.y,localBounds.width,localBounds.height);
			} else {
				updateGraphics = clip.updateGraphics;
			}
			updateGraphics._visible = true;
			updateGraphics.visible = true;
			updateGraphics.clipVisible = true;
			updateGraphics.renderable = true;
			PIXI.Container.prototype.addChild.call(clip, updateGraphics);
			Native.timer(100,function() {
				if (updateGraphics.parent) PIXI.Container.prototype.removeChild.call(updateGraphics.parent, updateGraphics);
			});
		}
		clip.stage.invalidateStage();
	}
};
DisplayObjectHelper.updateStage = function(clip,clear) {
	if(clear == null) {
		clear = false;
	}
	if(clip.stage != null) {
		return;
	}
	if(!clear && clip.parent != null) {
		if(clip.parent.stage != null && clip.parent.stage != clip.stage) {
			clip.stage = clip.parent.stage;
			var children = clip.children;
			if(children != null) {
				var _g = 0;
				while(_g < children.length) {
					var c = children[_g];
					++_g;
					DisplayObjectHelper.updateStage(c);
				}
			}
		} else if(clip.parent == RenderSupport.PixiStage) {
			clip.stage = clip;
			if(!((RenderSupport.RendererType == "html" || clip.isHTML) && !clip.isCanvas)) {
				clip.createView(clip.parent.children.indexOf(clip) + 1);
			}
			var children = clip.children;
			if(children != null) {
				var _g = 0;
				while(_g < children.length) {
					var c = children[_g];
					++_g;
					DisplayObjectHelper.updateStage(c);
				}
			}
		}
	} else {
		clip.stage = null;
		var children = clip.children;
		if(children != null) {
			var _g = 0;
			while(_g < children.length) {
				var c = children[_g];
				++_g;
				DisplayObjectHelper.updateStage(c,true);
			}
		}
	}
};
DisplayObjectHelper.invalidateTransform = function(clip,from,force) {
	if(force == null) {
		force = false;
	}
	if(DisplayObjectHelper.InvalidateStage) {
		DisplayObjectHelper.invalidateParentTransform(clip);
	}
	DisplayObjectHelper.invalidateWorldTransform(clip,true,DisplayObjectHelper.DebugUpdate ? from + " ->\ninvalidateTransform" : null,null,force);
};
DisplayObjectHelper.invalidateWorldTransform = function(clip,localTransformChanged,from,parentClip,force) {
	if(force == null) {
		force = false;
	}
	if(clip.parent != null && (!clip.worldTransformChanged || localTransformChanged && !clip.localTransformChanged || force)) {
		clip.worldTransformChanged = true;
		clip.transformChanged = true;
		if(!parentClip) {
			parentClip = clip.parentClip != null ? clip.parentClip : DisplayObjectHelper.findParentClip(clip);
		}
		clip.parentClip = parentClip;
		if(clip.isNativeWidget) {
			parentClip = clip;
		}
		if(localTransformChanged || force) {
			clip.localTransformChanged = true;
			if(DisplayObjectHelper.DebugUpdate) {
				if(clip.from) {
					clip.from = clip.from + "\n---------\n" + from;
				} else {
					clip.from = from;
				}
			}
		}
		if(!((RenderSupport.RendererType == "html" || clip.isHTML) && !clip.isCanvas)) {
			clip.rvlast = null;
		}
		if(clip.child != null && clip.localTransformChanged) {
			DisplayObjectHelper.invalidateTransform(clip.child,DisplayObjectHelper.DebugUpdate ? from + " ->\ninvalidateWorldTransform -> mask child" : null);
		}
		var _g = 0;
		var _g1 = clip.children || [];
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			if(child.visible) {
				DisplayObjectHelper.invalidateWorldTransform(child,localTransformChanged && !clip.isNativeWidget,DisplayObjectHelper.DebugUpdate ? from + " ->\ninvalidateWorldTransform -> child" : null,parentClip,force);
			}
		}
	}
};
DisplayObjectHelper.invalidateParentTransform = function(clip) {
	if(clip.parent != null) {
		clip.transformChanged = true;
		if(clip.isCanvas || clip.isCanvasStage) {
			clip.localTransformChanged = true;
		}
		if(!((RenderSupport.RendererType == "html" || clip.isHTML) && !clip.isCanvas)) {
			clip.rvlast = null;
		}
		if(clip.parent.parent != null && (!clip.parent.transformChanged || (clip.parent.isCanvas || clip.parent.isCanvasStage) && !clip.parent.localTransformChanged)) {
			DisplayObjectHelper.invalidateParentTransform(clip.parent);
		} else {
			DisplayObjectHelper.invalidateParentLocalBounds(clip);
			DisplayObjectHelper.invalidateStage(clip);
		}
	}
};
DisplayObjectHelper.invalidateParentLocalBounds = function(clip) {
	if(!clip.visible && clip.clipVisible && !clip.localBoundsChanged) {
		clip.localBoundsChanged = true;
		if(clip.parent != null && !clip.parent.transformChanged) {
			DisplayObjectHelper.invalidateParentLocalBounds(clip.parent);
		}
	}
};
DisplayObjectHelper.invalidateVisible = function(clip,updateAccess,parentClip) {
	if(updateAccess == null) {
		updateAccess = true;
	}
	var clipVisible = clip.parent != null && (clip._visible && clip.parent.clipVisible);
	var visible = (clip.parent != null && (clip.parent.visible || clip.keepNativeWidgetChildren || clip.keepNativeWidgetFSChildren) && (clip.isMask || clipVisible && (clip.renderable || clip.keepNativeWidgetChildren || clip.keepNativeWidgetFSChildren))) == true;
	if(!parentClip) {
		parentClip = clip.parentClip != null ? clip.parentClip : DisplayObjectHelper.findParentClip(clip);
	}
	clip.parentClip = parentClip;
	if(clip.clipVisible != clipVisible || clip.visible != visible) {
		clip.clipVisible = clipVisible;
		clip.visible = visible;
		clip.emit("visible");
		var updateAccessWidget = updateAccess && clip.accessWidget != null;
		if(clip.isNativeWidget) {
			parentClip = clip;
		}
		var _g = 0;
		var _g1 = clip.children || [];
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			DisplayObjectHelper.invalidateVisible(child,updateAccess && !updateAccessWidget,parentClip);
		}
		if(!((RenderSupport.RendererType == "html" || clip.isHTML) && !clip.isCanvas) && updateAccessWidget) {
			clip.accessWidget.updateDisplay();
		}
		DisplayObjectHelper.invalidateTransform(clip,"invalidateVisible");
	}
};
DisplayObjectHelper.invalidateInteractive = function(clip,interactiveChildren) {
	if(interactiveChildren == null) {
		interactiveChildren = false;
	}
	clip.interactive = clip.scrollRectListener != null || clip.listeners("pointerout").length > 0 || clip.listeners("pointerover").length > 0 || clip.cursor != null || clip.isInteractive;
	clip.interactiveChildren = clip.interactive || interactiveChildren;
	if(clip.interactive) {
		if((RenderSupport.RendererType == "html" || clip.isHTML) && !clip.isCanvas) {
			if(!clip.isNativeWidget) {
				DisplayObjectHelper.initNativeWidget(clip);
			} else {
				DisplayObjectHelper.invalidateTransform(clip,"invalidateInteractive");
			}
		}
		DisplayObjectHelper.setChildrenInteractive(clip);
	} else {
		if(!clip.interactiveChildren) {
			var children = clip.children;
			var i = 0;
			while(children.length > i && !clip.interactiveChildren) {
				if(children[i].interactiveChildren) {
					clip.interactiveChildren = true;
				}
				++i;
			}
		}
		if(clip.interactiveChildren) {
			DisplayObjectHelper.setChildrenInteractive(clip);
		}
	}
	if(clip.parent != null && clip.parent.interactiveChildren != clip.interactiveChildren) {
		DisplayObjectHelper.invalidateInteractive(clip.parent,clip.interactiveChildren);
	}
};
DisplayObjectHelper.setChildrenInteractive = function(clip) {
	if((RenderSupport.RendererType == "html" || clip.isHTML) && !clip.isCanvas) {
		return;
	}
	var children = clip.children;
	if(children != null) {
		var _g = 0;
		while(_g < children.length) {
			var c = children[_g];
			++_g;
			if(!c.interactiveChildren) {
				c.interactiveChildren = true;
				DisplayObjectHelper.setChildrenInteractive(c);
			}
		}
	}
};
DisplayObjectHelper.invalidate = function(clip) {
	DisplayObjectHelper.updateStage(clip);
	if(clip.parent != null) {
		DisplayObjectHelper.invalidateParentClip(clip);
		DisplayObjectHelper.invalidateVisible(clip);
		DisplayObjectHelper.invalidateInteractive(clip,clip.parent.interactiveChildren);
		DisplayObjectHelper.invalidateTransform(clip,"invalidate");
		if(clip.parent.hasMask) {
			DisplayObjectHelper.updateHasMask(clip);
		}
		if(clip.parent.isMask) {
			DisplayObjectHelper.updateIsMask(clip);
		}
		if(clip.parent.isCanvas || clip.parent.isCanvasStage) {
			DisplayObjectHelper.updateIsCanvas(clip);
		}
		if(clip.parent.isHTML || clip.parent.isHTMLStage) {
			DisplayObjectHelper.updateIsHTML(clip);
		}
		if(clip.keepNativeWidgetChildren || clip.keepNativeWidget) {
			DisplayObjectHelper.updateKeepNativeWidgetChildren(clip);
		}
		if(clip.parent.keepNativeWidgetParent) {
			DisplayObjectHelper.updateKeepNativeWidgetParent(clip,clip.parent.keepNativeWidgetParent);
		}
		clip.once("removed",function() {
			DisplayObjectHelper.invalidate(clip);
		});
	} else {
		clip.worldTransformChanged = false;
		clip.transformChanged = false;
		clip.localTransformChanged = false;
		clip.visible = false;
		if(clip.isNativeWidget) {
			DisplayObjectHelper.updateNativeWidgetDisplay(clip);
		}
	}
};
DisplayObjectHelper.invalidateParentClip = function(clip,parentClip) {
	if(!parentClip) {
		parentClip = DisplayObjectHelper.findParentClip(clip);
	}
	clip.parentClip = parentClip;
	if(clip.isNativeWidget) {
		var _g = 0;
		var _g1 = clip.children || [];
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			if(child.parentClip != clip) {
				DisplayObjectHelper.invalidateParentClip(child,clip);
			}
		}
	} else {
		var _g = 0;
		var _g1 = clip.children || [];
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			DisplayObjectHelper.invalidateParentClip(child,parentClip);
		}
	}
};
DisplayObjectHelper.setClipX = function(clip,x) {
	if(clip.scrollRect != null) {
		x -= clip.scrollRect.x;
	}
	if(!clip.destroyed && clip.x != x) {
		var from = DisplayObjectHelper.DebugUpdate ? "setClipX " + clip.x + " : " + x : null;
		clip.x = x;
		DisplayObjectHelper.invalidateTransform(clip,from);
	}
};
DisplayObjectHelper.setClipY = function(clip,y) {
	if(clip.scrollRect != null) {
		y -= clip.scrollRect.y;
	}
	if(!clip.destroyed && clip.y != y) {
		var from = DisplayObjectHelper.DebugUpdate ? "setClipY " + clip.y + " : " + y : null;
		clip.y = y;
		DisplayObjectHelper.invalidateTransform(clip,from);
	}
};
DisplayObjectHelper.setClipScaleX = function(clip,scale) {
	if(!clip.destroyed && clip.scale.x != scale) {
		var from = DisplayObjectHelper.DebugUpdate ? "setClipScaleX " + clip.scale.x + " : " + scale : null;
		clip.scale.x = scale;
		if((RenderSupport.RendererType == "html" || clip.isHTML) && !clip.isCanvas && scale != 0.0) {
			DisplayObjectHelper.initNativeWidget(clip);
		}
		DisplayObjectHelper.invalidateTransform(clip,from);
	}
};
DisplayObjectHelper.setClipScaleY = function(clip,scale) {
	if(!clip.destroyed && clip.scale.y != scale) {
		var from = DisplayObjectHelper.DebugUpdate ? "setClipScaleY " + clip.scale.y + " : " + scale : null;
		clip.scale.y = scale;
		if((RenderSupport.RendererType == "html" || clip.isHTML) && !clip.isCanvas && scale != 0.0) {
			DisplayObjectHelper.initNativeWidget(clip);
		}
		DisplayObjectHelper.invalidateTransform(clip,from);
	}
};
DisplayObjectHelper.setClipRotation = function(clip,rotation) {
	if(!clip.destroyed && clip.rotation != rotation) {
		var from = DisplayObjectHelper.DebugUpdate ? "setClipRotation " + clip.rotation + " : " + rotation : null;
		clip.rotation = rotation;
		DisplayObjectHelper.invalidateTransform(clip,from);
	}
};
DisplayObjectHelper.setClipOrigin = function(clip,x,y) {
	if(!clip.destroyed && clip.origin == null || clip.origin.x != x && clip.origin.y != y) {
		var from = DisplayObjectHelper.DebugUpdate ? "setClipOrigin " + (clip.origin + " : " + x + " " + y) : null;
		clip.origin = new PIXI.Point(x,y);
		if((RenderSupport.RendererType == "html" || clip.isHTML) && !clip.isCanvas) {
			DisplayObjectHelper.initNativeWidget(clip);
			if(clip.nativeWidget != null) {
				clip.nativeWidget.style.transformOrigin = clip.origin.x * 100 + "% " + (clip.origin.y * 100 + "%");
				clip.transform.pivot.x = 0.0;
				clip.transform.pivot.y = 0.0;
			} else {
				var tmp = clip.getWidth != null ? clip.getWidth() : clip.getLocalBounds().width;
				clip.transform.pivot.x = tmp * clip.origin.x;
				var tmp = DisplayObjectHelper.getHeight(clip);
				clip.transform.pivot.y = tmp * clip.origin.y;
			}
		} else {
			var tmp = clip.getWidth != null ? clip.getWidth() : clip.getLocalBounds().width;
			clip.transform.pivot.x = tmp * clip.origin.x;
			var tmp = DisplayObjectHelper.getHeight(clip);
			clip.transform.pivot.y = tmp * clip.origin.y;
		}
		DisplayObjectHelper.invalidateTransform(clip,from);
	}
};
DisplayObjectHelper.setClipAlpha = function(clip,alpha) {
	if(!clip.destroyed && clip.alpha != alpha) {
		var from = DisplayObjectHelper.DebugUpdate ? "setClipAlpha " + clip.alpha + " : " + alpha : null;
		clip.alpha = alpha;
		DisplayObjectHelper.invalidateTransform(clip,from);
	}
};
DisplayObjectHelper.setClipVisible = function(clip,visible) {
	if(clip._visible != visible) {
		clip._visible = visible;
		DisplayObjectHelper.invalidateVisible(clip);
	}
};
DisplayObjectHelper.setClipRenderable = function(clip,renderable) {
	if(clip.renderable != renderable) {
		clip.renderable = renderable;
		DisplayObjectHelper.invalidateVisible(clip);
		if(!clip.keepNativeWidget) {
			DisplayObjectHelper.invalidateTransform(clip,"setClipRenderable");
		}
	}
};
DisplayObjectHelper.forceClipRenderable = function(clip,renderable) {
	if(renderable == null) {
		renderable = true;
	}
	if(clip.renderable != renderable) {
		clip.renderable = renderable;
		DisplayObjectHelper.invalidateVisible(clip);
		if(!clip.keepNativeWidget) {
			DisplayObjectHelper.invalidateTransform(clip,"setClipRenderable");
		}
	}
	var _g = 0;
	var _g1 = clip.children || [];
	while(_g < _g1.length) {
		var child = _g1[_g];
		++_g;
		if(child.clipVisible && !child.isMask) {
			DisplayObjectHelper.forceClipRenderable(child,renderable);
		}
	}
};
DisplayObjectHelper.getClipVisible = function(clip) {
	return clip.clipVisible;
};
DisplayObjectHelper.getClipRenderable = function(clip) {
	return clip.visible;
};
DisplayObjectHelper.setClipCursor = function(clip,cursor) {
	if(clip.cursor != cursor) {
		clip.cursor = cursor;
		if((RenderSupport.RendererType == "html" || clip.isHTML) && !clip.isCanvas && !clip.isNativeWidget) {
			DisplayObjectHelper.initNativeWidget(clip);
		}
		DisplayObjectHelper.invalidateTransform(clip,"setClipCursor");
	}
};
DisplayObjectHelper.setClipFocus = function(clip,focus) {
	var accessWidget = clip.accessWidget;
	if(clip.setFocus != null && clip.setFocus(focus)) {
		return true;
	} else if(accessWidget != null && accessWidget.element != null && accessWidget.element.parentNode != null && accessWidget.element.tabIndex != null) {
		if(clip.nativeWidget && clip.nativeWidget.classList.contains("flow_focusable")) {
			if(focus) {
				clip.nativeWidget.setAttribute("tabindex","-1");
				clip.nativeWidget.focus();
				return true;
			}
		} else if(focus && accessWidget.element.focus != null) {
			accessWidget.element.focus();
			if(RenderSupport.EnableFocusFrame) {
				accessWidget.element.classList.add("focused");
			}
			return true;
		} else if(!focus && accessWidget.element.blur != null) {
			accessWidget.element.blur();
			accessWidget.element.classList.remove("focused");
			return true;
		}
	}
	var children = clip.children;
	if(children != null) {
		var _g = 0;
		while(_g < children.length) {
			var c = children[_g];
			++_g;
			if(DisplayObjectHelper.setClipFocus(c,focus)) {
				return true;
			}
		}
	}
	return false;
};
DisplayObjectHelper.setScrollRect = function(clip,left,top,width,height,fromSnapshot) {
	if(fromSnapshot == null) {
		fromSnapshot = false;
	}
	var scrollRect = clip.scrollRect;
	left = RenderSupport.RoundPixels ? Math.round(left) : Math.round(left * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio);
	top = RenderSupport.RoundPixels ? Math.round(top) : Math.round(top * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio);
	width = RenderSupport.RoundPixels ? Math.round(width) : Math.round(width * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio);
	height = RenderSupport.RoundPixels ? Math.round(height) : Math.round(height * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio);
	if(scrollRect != null) {
		if(left == scrollRect.x && top == scrollRect.y && width == scrollRect.width && height == scrollRect.height) {
			return;
		}
		clip.x = clip.x + scrollRect.x - left;
		clip.y = clip.y + scrollRect.y - top;
		clip.localTransformChanged = true;
		scrollRect.clear();
	} else {
		clip.x -= left;
		clip.y -= top;
		clip.localTransformChanged = true;
		clip.scrollRect = new FlowGraphics();
		scrollRect = clip.scrollRect;
		var clip1 = clip;
		var maskContainer = scrollRect;
		var fromSnapshot1 = fromSnapshot;
		if(fromSnapshot1 == null) {
			fromSnapshot1 = false;
		}
		if(maskContainer != clip1.scrollRect) {
			clip1.scrollRectListener = null;
			var scrollRect1 = clip1.scrollRect;
			if(scrollRect1 != null) {
				var x = clip1.x + scrollRect1.x;
				if(clip1.scrollRect != null) {
					x -= clip1.scrollRect.x;
				}
				if(!clip1.destroyed && clip1.x != x) {
					var from = DisplayObjectHelper.DebugUpdate ? "setClipX " + clip1.x + " : " + x : null;
					clip1.x = x;
					DisplayObjectHelper.invalidateTransform(clip1,from);
				}
				var y = clip1.y + scrollRect1.y;
				if(clip1.scrollRect != null) {
					y -= clip1.scrollRect.y;
				}
				if(!clip1.destroyed && clip1.y != y) {
					var from = DisplayObjectHelper.DebugUpdate ? "setClipY " + clip1.y + " : " + y : null;
					clip1.y = y;
					DisplayObjectHelper.invalidateTransform(clip1,from);
				}
				clip1.removeChild(scrollRect1);
				if(clip1.mask == scrollRect1) {
					clip1.mask = null;
				}
				clip1.scrollRect = null;
				clip1.mask = null;
				clip1.maskContainer = null;
				DisplayObjectHelper.invalidateTransform(clip1,"removeScrollRect");
			}
		}
		if(clip1.mask != null) {
			clip1.mask.child = null;
			clip1.mask = null;
		}
		if(RenderSupport.RendererType == "webgl") {
			clip1.mask = DisplayObjectHelper.getFirstGraphics(maskContainer);
		} else {
			clip1.alphaMask = null;
			var obj = DisplayObjectHelper.getLastGraphicsOrSprite(maskContainer);
			if(HaxeRuntime.instanceof(obj,FlowGraphics)) {
				clip1.mask = obj;
			} else if(HaxeRuntime.instanceof(obj,FlowSprite)) {
				clip1.alphaMask = obj;
			}
		}
		if(clip1.mask != null) {
			maskContainer.child = clip1;
			clip1.mask.child = clip1;
			clip1.maskContainer = maskContainer;
			if((RenderSupport.RendererType == "html" || clip1.isHTML) && !clip1.isCanvas && (Platform.isIE || Platform.isEdge) && clip1.mask.isSvg) {
				DisplayObjectHelper.updateHasMask(clip1);
			}
			clip1.mask.once("removed",function() {
				clip1.mask = null;
			});
		} else if(clip1.alphaMask != null) {
			maskContainer.child = clip1;
			maskContainer.url = clip1.alphaMask.url;
			clip1.alphaMask.child = clip1;
			clip1.maskContainer = maskContainer;
			DisplayObjectHelper.updateHasMask(clip1);
			clip1.alphaMask.once("removed",function() {
				clip1.alphaMask = null;
			});
		}
		DisplayObjectHelper.updateIsMask(maskContainer);
		if(maskContainer.renderable != false) {
			maskContainer.renderable = false;
			DisplayObjectHelper.invalidateVisible(maskContainer);
			if(!maskContainer.keepNativeWidget) {
				DisplayObjectHelper.invalidateTransform(maskContainer,"setClipRenderable");
			}
		}
		maskContainer.once("childrenchanged",function() {
			var clip = clip1;
			var maskContainer1 = maskContainer;
			if(maskContainer1 != clip.scrollRect) {
				clip.scrollRectListener = null;
				var scrollRect = clip.scrollRect;
				if(scrollRect != null) {
					var x = clip.x + scrollRect.x;
					if(clip.scrollRect != null) {
						x -= clip.scrollRect.x;
					}
					if(!clip.destroyed && clip.x != x) {
						var from = DisplayObjectHelper.DebugUpdate ? "setClipX " + clip.x + " : " + x : null;
						clip.x = x;
						DisplayObjectHelper.invalidateTransform(clip,from);
					}
					var y = clip.y + scrollRect.y;
					if(clip.scrollRect != null) {
						y -= clip.scrollRect.y;
					}
					if(!clip.destroyed && clip.y != y) {
						var from = DisplayObjectHelper.DebugUpdate ? "setClipY " + clip.y + " : " + y : null;
						clip.y = y;
						DisplayObjectHelper.invalidateTransform(clip,from);
					}
					clip.removeChild(scrollRect);
					if(clip.mask == scrollRect) {
						clip.mask = null;
					}
					clip.scrollRect = null;
					clip.mask = null;
					clip.maskContainer = null;
					DisplayObjectHelper.invalidateTransform(clip,"removeScrollRect");
				}
			}
			if(clip.mask != null) {
				clip.mask.child = null;
				clip.mask = null;
			}
			if(RenderSupport.RendererType == "webgl") {
				clip.mask = DisplayObjectHelper.getFirstGraphics(maskContainer1);
			} else {
				clip.alphaMask = null;
				var obj = DisplayObjectHelper.getLastGraphicsOrSprite(maskContainer1);
				if(HaxeRuntime.instanceof(obj,FlowGraphics)) {
					clip.mask = obj;
				} else if(HaxeRuntime.instanceof(obj,FlowSprite)) {
					clip.alphaMask = obj;
				}
			}
			if(clip.mask != null) {
				maskContainer1.child = clip;
				clip.mask.child = clip;
				clip.maskContainer = maskContainer1;
				if((RenderSupport.RendererType == "html" || clip.isHTML) && !clip.isCanvas && (Platform.isIE || Platform.isEdge) && clip.mask.isSvg) {
					DisplayObjectHelper.updateHasMask(clip);
				}
				clip.mask.once("removed",function() {
					clip.mask = null;
				});
			} else if(clip.alphaMask != null) {
				maskContainer1.child = clip;
				maskContainer1.url = clip.alphaMask.url;
				clip.alphaMask.child = clip;
				clip.maskContainer = maskContainer1;
				DisplayObjectHelper.updateHasMask(clip);
				clip.alphaMask.once("removed",function() {
					clip.alphaMask = null;
				});
			}
			DisplayObjectHelper.updateIsMask(maskContainer1);
			if(maskContainer1.renderable != false) {
				maskContainer1.renderable = false;
				DisplayObjectHelper.invalidateVisible(maskContainer1);
				if(!maskContainer1.keepNativeWidget) {
					DisplayObjectHelper.invalidateTransform(maskContainer1,"setClipRenderable");
				}
			}
			maskContainer1.once("childrenchanged",function() {
				DisplayObjectHelper.setClipMask(clip,maskContainer1,null);
			});
			if((RenderSupport.RendererType == "html" || clip.isHTML) && !clip.isCanvas) {
				if(clip.mask != null || clip.alphaMask != null) {
					DisplayObjectHelper.initNativeWidget(clip);
				}
			}
			DisplayObjectHelper.invalidateTransform(clip,"setClipMask");
		});
		if((RenderSupport.RendererType == "html" || clip1.isHTML) && !clip1.isCanvas && !(fromSnapshot1 && Util.getParameter("webclip_snapshot_enabled") != "0")) {
			if(clip1.mask != null || clip1.alphaMask != null) {
				DisplayObjectHelper.initNativeWidget(clip1);
			}
		}
		DisplayObjectHelper.invalidateTransform(clip1,"setClipMask");
		clip.addChild(scrollRect);
	}
	scrollRect.x = left;
	scrollRect.y = top;
	scrollRect.beginFill(16777215);
	scrollRect.drawRect(0.0,0.0,width,height);
};
DisplayObjectHelper.setCropEnabled = function(clip,enabled) {
	if(clip.cropEnabled != enabled) {
		clip.cropEnabled = enabled;
		DisplayObjectHelper.invalidateTransform(clip,"setCropEnabled");
	}
};
DisplayObjectHelper.setContentRect = function(clip,width,height) {
	if(clip.contentBounds == null) {
		clip.contentBounds = new PIXI.Bounds();
	}
	var contentBounds = clip.contentBounds;
	contentBounds.minX = 0.0;
	contentBounds.minY = 0.0;
	contentBounds.maxX = width;
	contentBounds.maxY = height;
	DisplayObjectHelper.invalidateTransform(clip,"setContentRect");
};
DisplayObjectHelper.listenScrollRect = function(clip,cb) {
	clip.scrollRectListener = cb;
	DisplayObjectHelper.invalidateInteractive(clip);
	DisplayObjectHelper.invalidateTransform(clip,"listenScrollRect");
	return function() {
		clip.scrollRectListener = null;
		DisplayObjectHelper.invalidateInteractive(clip);
		DisplayObjectHelper.invalidateTransform(clip,"listenScrollRect disposer");
	};
};
DisplayObjectHelper.removeScrollRect = function(clip) {
	clip.scrollRectListener = null;
	var scrollRect = clip.scrollRect;
	if(scrollRect != null) {
		var x = clip.x + scrollRect.x;
		if(clip.scrollRect != null) {
			x -= clip.scrollRect.x;
		}
		if(!clip.destroyed && clip.x != x) {
			var from = DisplayObjectHelper.DebugUpdate ? "setClipX " + clip.x + " : " + x : null;
			clip.x = x;
			DisplayObjectHelper.invalidateTransform(clip,from);
		}
		var y = clip.y + scrollRect.y;
		if(clip.scrollRect != null) {
			y -= clip.scrollRect.y;
		}
		if(!clip.destroyed && clip.y != y) {
			var from = DisplayObjectHelper.DebugUpdate ? "setClipY " + clip.y + " : " + y : null;
			clip.y = y;
			DisplayObjectHelper.invalidateTransform(clip,from);
		}
		clip.removeChild(scrollRect);
		if(clip.mask == scrollRect) {
			clip.mask = null;
		}
		clip.scrollRect = null;
		clip.mask = null;
		clip.maskContainer = null;
		DisplayObjectHelper.invalidateTransform(clip,"removeScrollRect");
	}
};
DisplayObjectHelper.setClipMask = function(clip,maskContainer,fromSnapshot) {
	if(fromSnapshot == null) {
		fromSnapshot = false;
	}
	if(maskContainer != clip.scrollRect) {
		clip.scrollRectListener = null;
		var scrollRect = clip.scrollRect;
		if(scrollRect != null) {
			var x = clip.x + scrollRect.x;
			if(clip.scrollRect != null) {
				x -= clip.scrollRect.x;
			}
			if(!clip.destroyed && clip.x != x) {
				var from = DisplayObjectHelper.DebugUpdate ? "setClipX " + clip.x + " : " + x : null;
				clip.x = x;
				DisplayObjectHelper.invalidateTransform(clip,from);
			}
			var y = clip.y + scrollRect.y;
			if(clip.scrollRect != null) {
				y -= clip.scrollRect.y;
			}
			if(!clip.destroyed && clip.y != y) {
				var from = DisplayObjectHelper.DebugUpdate ? "setClipY " + clip.y + " : " + y : null;
				clip.y = y;
				DisplayObjectHelper.invalidateTransform(clip,from);
			}
			clip.removeChild(scrollRect);
			if(clip.mask == scrollRect) {
				clip.mask = null;
			}
			clip.scrollRect = null;
			clip.mask = null;
			clip.maskContainer = null;
			DisplayObjectHelper.invalidateTransform(clip,"removeScrollRect");
		}
	}
	if(clip.mask != null) {
		clip.mask.child = null;
		clip.mask = null;
	}
	if(RenderSupport.RendererType == "webgl") {
		clip.mask = DisplayObjectHelper.getFirstGraphics(maskContainer);
	} else {
		clip.alphaMask = null;
		var obj = DisplayObjectHelper.getLastGraphicsOrSprite(maskContainer);
		if(HaxeRuntime.instanceof(obj,FlowGraphics)) {
			clip.mask = obj;
		} else if(HaxeRuntime.instanceof(obj,FlowSprite)) {
			clip.alphaMask = obj;
		}
	}
	if(clip.mask != null) {
		maskContainer.child = clip;
		clip.mask.child = clip;
		clip.maskContainer = maskContainer;
		if((RenderSupport.RendererType == "html" || clip.isHTML) && !clip.isCanvas && (Platform.isIE || Platform.isEdge) && clip.mask.isSvg) {
			DisplayObjectHelper.updateHasMask(clip);
		}
		clip.mask.once("removed",function() {
			clip.mask = null;
		});
	} else if(clip.alphaMask != null) {
		maskContainer.child = clip;
		maskContainer.url = clip.alphaMask.url;
		clip.alphaMask.child = clip;
		clip.maskContainer = maskContainer;
		DisplayObjectHelper.updateHasMask(clip);
		clip.alphaMask.once("removed",function() {
			clip.alphaMask = null;
		});
	}
	DisplayObjectHelper.updateIsMask(maskContainer);
	if(maskContainer.renderable != false) {
		maskContainer.renderable = false;
		DisplayObjectHelper.invalidateVisible(maskContainer);
		if(!maskContainer.keepNativeWidget) {
			DisplayObjectHelper.invalidateTransform(maskContainer,"setClipRenderable");
		}
	}
	maskContainer.once("childrenchanged",function() {
		DisplayObjectHelper.setClipMask(clip,maskContainer,null);
	});
	if((RenderSupport.RendererType == "html" || clip.isHTML) && !clip.isCanvas && !(fromSnapshot && Util.getParameter("webclip_snapshot_enabled") != "0")) {
		if(clip.mask != null || clip.alphaMask != null) {
			DisplayObjectHelper.initNativeWidget(clip);
		}
	}
	DisplayObjectHelper.invalidateTransform(clip,"setClipMask");
};
DisplayObjectHelper.updateHasMask = function(clip) {
	if((RenderSupport.RendererType == "html" || clip.isHTML) && !clip.isCanvas) {
		if(!clip.hasMask) {
			clip.hasMask = true;
			if(clip.updateNativeWidgetGraphicsData != null) {
				clip.updateNativeWidgetGraphicsData();
			}
			var _g = 0;
			var _g1 = clip.children || [];
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				DisplayObjectHelper.updateHasMask(child);
			}
		}
	}
};
DisplayObjectHelper.updateIsMask = function(clip) {
	if(!clip.isMask) {
		clip.isMask = true;
		clip.emitChildrenChanged = true;
		var _g = 0;
		var _g1 = clip.children || [];
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			DisplayObjectHelper.updateIsMask(child);
		}
	}
};
DisplayObjectHelper.updateEmitChildrenChanged = function(clip) {
	if(!clip.emitChildrenChanged) {
		clip.emitChildrenChanged = true;
		var _g = 0;
		var _g1 = clip.children || [];
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			DisplayObjectHelper.updateEmitChildrenChanged(child);
		}
	}
};
DisplayObjectHelper.updateIsCanvas = function(clip) {
	if(clip.parent != null && (clip.parent.isCanvas || clip.parent.isCanvasStage)) {
		clip.isCanvas = true;
		DisplayObjectHelper.deleteNativeWidget(clip);
		var _g = 0;
		var _g1 = clip.children || [];
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			DisplayObjectHelper.updateIsCanvas(child);
		}
	}
};
DisplayObjectHelper.isCanvas = function(clip) {
	return clip.isCanvas;
};
DisplayObjectHelper.isCanvasStage = function(clip) {
	return clip.isCanvasStage;
};
DisplayObjectHelper.updateIsHTML = function(clip) {
	if(clip.parent != null && (clip.parent.isHTML || clip.parent.isHTMLStage)) {
		clip.isHTML = true;
		if(clip.nativeWidget == null && !clip.isEmpty && !(clip == null ? false : clip.isHTMLStageContainer) && (clip.children == null || clip.children.length == 0 || clip.transform.a != 1 || clip.transform.d != 1)) {
			DisplayObjectHelper.initNativeWidget(clip);
		}
		var _g = 0;
		var _g1 = clip.children || [];
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			DisplayObjectHelper.updateIsHTML(child);
		}
	}
};
DisplayObjectHelper.isHTML = function(clip) {
	return clip.isHTML;
};
DisplayObjectHelper.isHTMLStage = function(clip) {
	return clip.isHTMLStage;
};
DisplayObjectHelper.isHTMLStageContainer = function(clip) {
	if(clip == null) {
		return false;
	} else {
		return clip.isHTMLStageContainer;
	}
};
DisplayObjectHelper.isHTMLRenderer = function(clip) {
	if(RenderSupport.RendererType == "html" || clip.isHTML) {
		return !clip.isCanvas;
	} else {
		return false;
	}
};
DisplayObjectHelper.updateKeepNativeWidgetChildren = function(clip,keepNativeWidgetChildren) {
	if(keepNativeWidgetChildren == null) {
		keepNativeWidgetChildren = false;
	}
	clip.keepNativeWidgetChildren = keepNativeWidgetChildren || clip.keepNativeWidget;
	if(!clip.keepNativeWidgetChildren) {
		var _g = 0;
		var _g1 = clip.children || [];
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			clip.keepNativeWidgetChildren = clip.keepNativeWidgetChildren || child.keepNativeWidgetChildren || child.keepNativeWidget;
		}
	}
	if((RenderSupport.RendererType == "html" || clip.isHTML) && !clip.isCanvas && clip.isNativeWidget && clip.nativeWidget.style != null) {
		clip.nativeWidget.style.visibility = clip.keepNativeWidget ? "visible" : clip.keepNativeWidgetChildren ? "inherit" : null;
	}
	if(clip.parent != null && clip.parent.keepNativeWidgetChildren != clip.keepNativeWidgetChildren) {
		DisplayObjectHelper.updateKeepNativeWidgetChildren(clip.parent,clip.keepNativeWidgetChildren);
	}
	DisplayObjectHelper.invalidateTransform(clip,"updateKeepNativeWidgetChildren");
};
DisplayObjectHelper.updateKeepNativeWidgetParent = function(clip,keepNativeWidget) {
	if(clip.keepNativeWidgetParent != keepNativeWidget) {
		clip.keepNativeWidget = keepNativeWidget;
		clip.keepNativeWidgetParent = keepNativeWidget;
		DisplayObjectHelper.updateKeepNativeWidgetChildren(clip);
		var _g = 0;
		var _g1 = clip.children || [];
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			DisplayObjectHelper.updateKeepNativeWidgetParent(child,keepNativeWidget);
		}
	}
};
DisplayObjectHelper.updateKeepNativeWidgetInFullScreenModeChildren = function(clip,keepNativeWidgetChildren) {
	if(keepNativeWidgetChildren == null) {
		keepNativeWidgetChildren = false;
	}
	clip.keepNativeWidgetFSChildren = keepNativeWidgetChildren || clip.keepNativeWidgetFS;
	if(!clip.keepNativeWidgetFSChildren) {
		var _g = 0;
		var _g1 = clip.children || [];
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			clip.keepNativeWidgetFSChildren = clip.keepNativeWidgetFSChildren || child.keepNativeWidgetFSChildren || child.keepNativeWidgetFSParent;
		}
	}
	if((RenderSupport.RendererType == "html" || clip.isHTML) && !clip.isCanvas && clip.isNativeWidget && clip.nativeWidget.style != null) {
		clip.nativeWidget.style.visibility = clip.keepNativeWidgetFSParent ? "visible" : clip.keepNativeWidgetFSChildren ? "inherit" : null;
	}
	if(clip.parent != null && clip.parent.keepNativeWidgetFSChildren != clip.keepNativeWidgetFSChildren) {
		DisplayObjectHelper.updateKeepNativeWidgetInFullScreenModeChildren(clip.parent,clip.keepNativeWidgetFSChildren);
	}
	DisplayObjectHelper.invalidateTransform(clip,"updateKeepNativeWidgetInFullScreenModeChildren");
};
DisplayObjectHelper.updateKeepNativeWidgetInFullScreenModeParent = function(clip,keepNativeWidget) {
	if(clip.keepNativeWidgetFSParent != keepNativeWidget) {
		clip.keepNativeWidgetFS = keepNativeWidget;
		clip.keepNativeWidgetFSParent = keepNativeWidget;
		DisplayObjectHelper.updateKeepNativeWidgetInFullScreenModeChildren(clip);
		var _g = 0;
		var _g1 = clip.children || [];
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			DisplayObjectHelper.updateKeepNativeWidgetInFullScreenModeParent(child,keepNativeWidget);
		}
	}
};
DisplayObjectHelper.updateIsAriaHidden = function(clip,isAriaHidden) {
	if(isAriaHidden == null) {
		isAriaHidden = false;
	}
	if(clip.isNativeWidget) {
		if(isAriaHidden) {
			clip.nativeWidget.setAttribute("aria-hidden","true");
		} else {
			clip.nativeWidget.removeAttribute("aria-hidden");
		}
	}
	var _g = 0;
	var _g1 = clip.children || [];
	while(_g < _g1.length) {
		var child = _g1[_g];
		++_g;
		DisplayObjectHelper.updateIsAriaHidden(child,isAriaHidden);
	}
};
DisplayObjectHelper.getViewBounds = function(clip) {
	return clip.viewBounds;
};
DisplayObjectHelper.updateTreeIds = function(clip,clean) {
	if(clean == null) {
		clean = false;
	}
	if(clean) {
		clip.id = [-1];
	} else if(clip.parent == null) {
		clip.id = [0];
	} else {
		clip.id = Array.from(clip.parent.id);
		clip.id.push(clip.parent.children.indexOf(clip));
	}
	var children = clip.children;
	if(children != null) {
		var _g = 0;
		while(_g < children.length) {
			var c = children[_g];
			++_g;
			DisplayObjectHelper.updateTreeIds(c,clean);
		}
	}
};
DisplayObjectHelper.getClipTreePosition = function(clip) {
	if(clip.parent != null) {
		var clipTreePosition = DisplayObjectHelper.getClipTreePosition(clip.parent);
		clipTreePosition.push(clip.parent.children.indexOf(clip));
		return clipTreePosition;
	} else {
		return [];
	}
};
DisplayObjectHelper.getFirstGraphicsOrSprite = function(clip) {
	if(clip.clipVisible && (HaxeRuntime.instanceof(clip,FlowGraphics) || HaxeRuntime.instanceof(clip,FlowSprite))) {
		return clip;
	}
	var _g = 0;
	var _g1 = clip.children || [];
	while(_g < _g1.length) {
		var c = _g1[_g];
		++_g;
		var g = DisplayObjectHelper.getFirstGraphicsOrSprite(c);
		if(g != null) {
			return g;
		}
	}
	return null;
};
DisplayObjectHelper.getLastGraphicsOrSprite = function(clip) {
	var g = null;
	if(HaxeRuntime.instanceof(clip,FlowGraphics) || HaxeRuntime.instanceof(clip,FlowSprite)) {
		g = clip;
	}
	var _g = 0;
	var _g1 = clip.children || [];
	while(_g < _g1.length) {
		var c = _g1[_g];
		++_g;
		var g2 = DisplayObjectHelper.getLastGraphicsOrSprite(c);
		if(g2 != null) {
			g = g2;
		}
	}
	return g;
};
DisplayObjectHelper.getFirstGraphics = function(clip) {
	if(HaxeRuntime.instanceof(clip,FlowGraphics)) {
		return js_Boot.__cast(clip , FlowGraphics);
	}
	var _g = 0;
	var _g1 = clip.children || [];
	while(_g < _g1.length) {
		var c = _g1[_g];
		++_g;
		var g = DisplayObjectHelper.getFirstGraphics(c);
		if(g != null) {
			return g;
		}
	}
	return null;
};
DisplayObjectHelper.getAllSprites = function(clip) {
	if(HaxeRuntime.instanceof(clip,FlowSprite)) {
		return [js_Boot.__cast(clip , FlowSprite)];
	}
	var r = [];
	var _g = 0;
	var _g1 = clip.children || [];
	while(_g < _g1.length) {
		var c = _g1[_g];
		++_g;
		r = r.concat(DisplayObjectHelper.getAllSprites(c));
	}
	return r;
};
DisplayObjectHelper.onImagesLoaded = function(clip,cb) {
	var sprites = DisplayObjectHelper.getAllSprites(clip);
	var _g = [];
	var _g1 = 0;
	var _g2 = sprites;
	while(_g1 < _g2.length) {
		var v = _g2[_g1];
		++_g1;
		if(!v.loaded && v.visible && !v.failed) {
			_g.push(v);
		}
	}
	if(_g.length > 0) {
		var disp = null;
		var fn = function() {
			disp = DisplayObjectHelper.onImagesLoaded(clip,cb);
		};
		RenderSupport.once("drawframe",fn);
		return function() {
			if(disp != null) {
				disp();
			}
			RenderSupport.off("drawframe",fn);
		};
	} else {
		cb();
		return function() {
		};
	}
};
DisplayObjectHelper.emitEvent = function(parent,event,value) {
	if(event == "childrenchanged" && !parent.emitChildrenChanged) {
		return;
	}
	parent.emit(event,value);
	if(parent.parent != null) {
		DisplayObjectHelper.emitEvent(parent.parent,event,value);
	}
};
DisplayObjectHelper.broadcastEvent = function(parent,event,value) {
	parent.emit(event,value);
	var _g = 0;
	var _g1 = parent.children || [];
	while(_g < _g1.length) {
		var c = _g1[_g];
		++_g;
		DisplayObjectHelper.broadcastEvent(c,event,value);
	}
	if(parent.mask != null) {
		DisplayObjectHelper.broadcastEvent(parent.mask,event,value);
	}
};
DisplayObjectHelper.onAdded = function(clip,fn) {
	var disp = function() {
	};
	if(clip.parent == null) {
		clip.once("added",function() {
			disp = fn();
			clip.once("removed",function() {
				disp();
				DisplayObjectHelper.onAdded(clip,fn);
			});
		});
	} else {
		disp = fn();
		clip.once("removed",function() {
			disp();
			DisplayObjectHelper.onAdded(clip,fn);
		});
	}
};
DisplayObjectHelper.onAddedDisposable = function(clip,fn0) {
	var disp = function() {
	};
	var alive = true;
	var fn = function() {
		if(alive) {
			return fn0();
		} else {
			return function() {
			};
		}
	};
	if(clip.parent == null) {
		clip.once("added",function() {
			disp = fn();
			clip.once("removed",function() {
				disp();
				disp = DisplayObjectHelper.onAddedDisposable(clip,fn);
			});
		});
	} else {
		disp = fn();
		clip.once("removed",function() {
			disp();
			disp = DisplayObjectHelper.onAddedDisposable(clip,fn);
		});
	}
	return function() {
		alive = false;
		disp();
	};
};
DisplayObjectHelper.updateClipID = function(clip) {
	var nativeWidget = clip.nativeWidget;
	if(nativeWidget != null && nativeWidget.getAttribute("id") == null) {
		var newId = '_' + Math.random().toString(36).substr(2, 9);
		if(DisplayObjectHelper.CheckUniqueClipID) {
			if(DisplayObjectHelper.UniqueClipIds.includes(newId)) {
				DisplayObjectHelper.updateClipID(clip);
			} else {
				nativeWidget.setAttribute("id",newId);
				DisplayObjectHelper.UniqueClipIds.push(newId);
			}
		} else {
			nativeWidget.setAttribute("id",newId);
		}
	}
};
DisplayObjectHelper.updateNativeWidget = function(clip) {
	if(clip.updateNativeWidget != null) {
		clip.updateNativeWidget();
	} else if((RenderSupport.RendererType == "html" || clip.isHTML) && !clip.isCanvas) {
		if(clip.isNativeWidget) {
			if(clip.visible) {
				if(DisplayObjectHelper.DebugUpdate) {
					var clip1 = clip.nativeWidget;
					var tmp = (clip.nativeWidget.getAttribute("update") | 0) + 1;
					clip1.setAttribute("update",tmp);
					if(clip.from) {
						clip.nativeWidget.setAttribute("from",clip.from);
						clip.from = null;
					}
					if(clip.info) {
						clip.nativeWidget.setAttribute("info",clip.info);
					}
				}
				if(DisplayObjectHelper.DebugAccessOrder && clip.accessWidget != null) {
					clip.nativeWidget.setAttribute("nodeindex","" + clip.accessWidget.nodeindex);
				}
				DisplayObjectHelper.updateNativeWidgetTransformMatrix(clip);
				DisplayObjectHelper.updateNativeWidgetOpacity(clip);
				DisplayObjectHelper.updateNativeWidgetMask(clip);
				DisplayObjectHelper.updateNativeWidgetInteractive(clip);
				if(clip.styleChanged) {
					clip.updateNativeWidgetStyle();
				} else if(clip.updateBaselineWidget != null) {
					clip.updateBaselineWidget();
				}
				DisplayObjectHelper.updateNativeWidgetFilters(clip);
			}
			DisplayObjectHelper.updateNativeWidgetDisplay(clip);
		}
	} else if(clip.nativeWidget) {
		DisplayObjectHelper.updateNativeWidgetTransformMatrix(clip);
		DisplayObjectHelper.updateNativeWidgetOpacity(clip);
		if(clip.styleChanged) {
			clip.updateNativeWidgetStyle();
		}
		if(Platform.isIE && clip.temporarilyPreventBlur != null) {
			clip.temporarilyPreventBlur();
		}
	}
};
DisplayObjectHelper.getNativeWidgetTransform = function(clip) {
	if((RenderSupport.RendererType == "html" || clip.isHTML) && !clip.isCanvas) {
		var tmp;
		if(!(!clip.parentClip || RenderSupport.RenderContainers)) {
			var clip1 = clip.parent;
			tmp = clip1 == null ? false : clip1.isHTMLStageContainer;
		} else {
			tmp = true;
		}
		if(tmp) {
			if(clip.localTransformChanged) {
				clip.transform.updateLocalTransform();
			}
			return clip.localTransform;
		} else {
			return DisplayObjectHelper.prependInvertedMatrix(clip.worldTransform,clip.parentClip.worldTransform);
		}
	} else if(clip.accessWidget != null) {
		return clip.accessWidget.getAccessWidgetTransform();
	} else {
		return clip.worldTransform;
	}
};
DisplayObjectHelper.updateNativeWidgetTransformMatrix = function(clip) {
	var nativeWidget = clip.nativeWidget;
	if(clip.localTransformChanged) {
		clip.transform.updateLocalTransform();
	}
	var transform;
	if((RenderSupport.RendererType == "html" || clip.isHTML) && !clip.isCanvas) {
		var transform1;
		if(!(!clip.parentClip || RenderSupport.RenderContainers)) {
			var clip1 = clip.parent;
			transform1 = clip1 == null ? false : clip1.isHTMLStageContainer;
		} else {
			transform1 = true;
		}
		if(transform1) {
			if(clip.localTransformChanged) {
				clip.transform.updateLocalTransform();
			}
			transform = clip.localTransform;
		} else {
			transform = DisplayObjectHelper.prependInvertedMatrix(clip.worldTransform,clip.parentClip.worldTransform);
		}
	} else {
		transform = clip.accessWidget != null ? clip.accessWidget.getAccessWidgetTransform() : clip.worldTransform;
	}
	var tx = 0.0;
	var ty = 0.0;
	if(clip.mask != null) {
		var clip1 = clip.mask;
		var widgetBounds = clip1.widgetBounds;
		var widgetWidth;
		var widgetWidth1;
		if(widgetBounds != null) {
			var f = widgetBounds.minX;
			widgetWidth1 = isFinite(f);
		} else {
			widgetWidth1 = false;
		}
		if(widgetWidth1) {
			var f = widgetBounds.minX;
			widgetWidth = isFinite(f) ? widgetBounds.maxX - widgetBounds.minX : -1;
		} else {
			widgetWidth = clip1.isFlowContainer && clip1.mask == null ? clip1.localBounds.maxX : clip1.getWidth != null ? clip1.getWidth() : clip1.getLocalBounds().width;
		}
		var maskWidth = widgetWidth;
		var clip1 = clip.mask;
		var widgetBounds = clip1.widgetBounds;
		var maskHeight;
		var maskHeight1;
		if(widgetBounds != null) {
			var f = widgetBounds.minY;
			maskHeight1 = isFinite(f);
		} else {
			maskHeight1 = false;
		}
		if(maskHeight1) {
			var f = widgetBounds.minY;
			maskHeight = isFinite(f) ? widgetBounds.maxY - widgetBounds.minY : -1;
		} else {
			maskHeight = clip1.isFlowContainer && clip1.mask == null ? clip1.localBounds.maxY : DisplayObjectHelper.getHeight(clip1);
		}
		if(nativeWidget.firstChild == null) {
			var cont = window.document.createElement("div");
			cont.className = "nativeWidget";
			nativeWidget.appendChild(cont);
		}
		if(nativeWidget.firstChild != null) {
			if(clip.contentBounds != null) {
				nativeWidget.firstChild.style.width = "" + Math.max(clip.contentBounds.maxX,maskWidth) + "px";
				nativeWidget.firstChild.style.height = "" + Math.max(clip.contentBounds.maxY,maskHeight) + "px";
			} else if(clip.maxLocalBounds != null) {
				nativeWidget.firstChild.style.width = "" + Math.max(clip.maxLocalBounds.maxX,maskWidth) + "px";
				nativeWidget.firstChild.style.height = "" + Math.max(clip.maxLocalBounds.maxY,maskHeight) + "px";
			}
		}
		if(clip.scrollRect != null) {
			var point = DisplayObjectHelper.applyTransformPoint(new PIXI.Point(clip.scrollRect.x,clip.scrollRect.y),transform);
			var n = point.x;
			tx = RenderSupport.RoundPixels ? Math.round(n) : Math.round(n * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio);
			var n = point.y;
			ty = RenderSupport.RoundPixels ? Math.round(n) : Math.round(n * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio);
		} else {
			var graphicsData = clip.mask.graphicsData;
			if(graphicsData != null && graphicsData.length > 0) {
				var data = graphicsData[0];
				var transform2 = DisplayObjectHelper.prependInvertedMatrix(clip.mask.worldTransform,clip.worldTransform);
				if(data.shape.type == 1) {
					var point = DisplayObjectHelper.applyTransformPoint(DisplayObjectHelper.applyTransformPoint(new PIXI.Point(data.shape.x,data.shape.y),transform2),transform);
					var n = point.x;
					tx = RenderSupport.RoundPixels ? Math.round(n) : Math.round(n * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio);
					var n = point.y;
					ty = RenderSupport.RoundPixels ? Math.round(n) : Math.round(n * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio);
				} else if(data.shape.type == 2) {
					var n = data.shape.x - data.shape.radius;
					var n1 = data.shape.y - data.shape.radius;
					var point = DisplayObjectHelper.applyTransformPoint(DisplayObjectHelper.applyTransformPoint(new PIXI.Point(RenderSupport.RoundPixels ? Math.round(n) : Math.round(n * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio),RenderSupport.RoundPixels ? Math.round(n1) : Math.round(n1 * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio)),transform2),transform);
					var n = point.x;
					tx = RenderSupport.RoundPixels ? Math.round(n) : Math.round(n * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio);
					var n = point.y;
					ty = RenderSupport.RoundPixels ? Math.round(n) : Math.round(n * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio);
				} else if(data.shape.type == 4) {
					var point = DisplayObjectHelper.applyTransformPoint(DisplayObjectHelper.applyTransformPoint(new PIXI.Point(data.shape.x,data.shape.y),transform2),transform);
					var n = point.x;
					tx = RenderSupport.RoundPixels ? Math.round(n) : Math.round(n * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio);
					var n = point.y;
					ty = RenderSupport.RoundPixels ? Math.round(n) : Math.round(n * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio);
				} else {
					var n = transform.tx;
					tx = RenderSupport.RoundPixels ? Math.round(n) : Math.round(n * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio);
					var n = transform.ty;
					ty = RenderSupport.RoundPixels ? Math.round(n) : Math.round(n * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio);
				}
			} else {
				var n = transform.tx;
				tx = RenderSupport.RoundPixels ? Math.round(n) : Math.round(n * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio);
				var n = transform.ty;
				ty = RenderSupport.RoundPixels ? Math.round(n) : Math.round(n * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio);
			}
		}
	} else {
		var n = transform.tx;
		tx = RenderSupport.RoundPixels ? Math.round(n) : Math.round(n * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio);
		var n = transform.ty;
		ty = RenderSupport.RoundPixels ? Math.round(n) : Math.round(n * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio);
	}
	if(clip.left != null && clip.top != null) {
		tx += clip.left * transform.a + clip.top * transform.c;
		ty += clip.left * transform.b + clip.top * transform.d;
		nativeWidget.style.transformOrigin = -clip.left + "px " + (-clip.top + "px");
	}
	var localBounds = clip.localBounds;
	if(clip.isCanvasStage) {
		tx -= Math.max(-localBounds.minX,0.0);
		ty -= Math.max(-localBounds.minY,0.0);
		clip.nativeWidgetBoundsChanged = true;
	}
	var tmp;
	var f = localBounds.minX;
	if(isFinite(f)) {
		var f = localBounds.minY;
		tmp = isFinite(f);
	} else {
		tmp = false;
	}
	if(tmp && clip.nativeWidgetBoundsChanged) {
		clip.nativeWidgetBoundsChanged = false;
		if(clip.isCanvasStage) {
			nativeWidget.setAttribute("width","" + (Math.ceil(localBounds.maxX * transform.a * RenderSupport.PixiRenderer.resolution) + Math.max(Math.ceil(-localBounds.minX * transform.a * RenderSupport.PixiRenderer.resolution),0.0)));
			nativeWidget.setAttribute("height","" + (Math.ceil(localBounds.maxY * transform.d * RenderSupport.PixiRenderer.resolution) + Math.max(Math.ceil(-localBounds.minY * transform.d * RenderSupport.PixiRenderer.resolution),0.0)));
			nativeWidget.style.width = "" + (Math.ceil(localBounds.maxX * transform.a * RenderSupport.PixiRenderer.resolution) + Math.max(Math.ceil(-localBounds.minX * transform.a * RenderSupport.PixiRenderer.resolution),0.0)) + "px";
			nativeWidget.style.height = "" + (Math.ceil(localBounds.maxY * transform.d * RenderSupport.PixiRenderer.resolution) + Math.max(Math.ceil(-localBounds.minY * transform.d * RenderSupport.PixiRenderer.resolution),0.0)) + "px";
		} else if(clip.alphaMask != null) {
			nativeWidget.style.width = "" + localBounds.maxX + "px";
			nativeWidget.style.height = "" + localBounds.maxY + "px";
		} else {
			var widgetBounds = clip.widgetBounds;
			var widgetWidth;
			var widgetWidth1;
			if(widgetBounds != null) {
				var f = widgetBounds.minX;
				widgetWidth1 = isFinite(f);
			} else {
				widgetWidth1 = false;
			}
			if(widgetWidth1) {
				var f = widgetBounds.minX;
				widgetWidth = isFinite(f) ? widgetBounds.maxX - widgetBounds.minX : -1;
			} else {
				widgetWidth = clip.isFlowContainer && clip.mask == null ? clip.localBounds.maxX : clip.getWidth != null ? clip.getWidth() : clip.getLocalBounds().width;
			}
			nativeWidget.style.width = "" + widgetWidth + "px";
			var widgetBounds = clip.widgetBounds;
			var tmp;
			var tmp1;
			if(widgetBounds != null) {
				var f = widgetBounds.minY;
				tmp1 = isFinite(f);
			} else {
				tmp1 = false;
			}
			if(tmp1) {
				var f = widgetBounds.minY;
				tmp = isFinite(f) ? widgetBounds.maxY - widgetBounds.minY : -1;
			} else {
				tmp = clip.isFlowContainer && clip.mask == null ? clip.localBounds.maxY : DisplayObjectHelper.getHeight(clip);
			}
			nativeWidget.style.height = "" + tmp + "px";
		}
	}
	nativeWidget.style.left = tx != 0 ? "" + tx + "px" : Platform.isIE ? "0" : null;
	nativeWidget.style.top = ty != 0 ? "" + ty + "px" : Platform.isIE ? "0" : null;
	if(clip.isCanvasStage) {
		nativeWidget.style.transform = "matrix(" + 1.0 / RenderSupport.PixiRenderer.resolution + ", 0, 0, " + 1.0 / RenderSupport.PixiRenderer.resolution + ", 0, 0)";
	} else {
		nativeWidget.style.transform = transform.a != 1 || transform.b != 0 || transform.c != 0 || transform.d != 1 ? "matrix(" + transform.a + ", " + transform.b + ", " + transform.c + ", " + transform.d + ", 0, 0)" : Platform.isIE ? "none" : null;
	}
	if(transform.a == 0 || transform.d == 0) {
		DisplayObjectHelper.invalidateTransform(clip,"updateNativeWidgetTransformMatrix",true);
	}
};
DisplayObjectHelper.getNativeWidgetAlpha = function(clip) {
	if((RenderSupport.RendererType == "html" || clip.isHTML) && !clip.isCanvas && !RenderSupport.RenderContainers) {
		if(clip.parentClip && clip.parentClip.worldAlpha > 0) {
			return clip.worldAlpha / clip.parentClip.worldAlpha;
		} else if(clip.parent != null && !clip.parent.isNativeWidget) {
			return clip.alpha * DisplayObjectHelper.getNativeWidgetAlpha(clip.parent);
		} else {
			return clip.alpha;
		}
	} else {
		return clip.alpha;
	}
};
DisplayObjectHelper.updateNativeWidgetOpacity = function(clip) {
	var nativeWidget = clip.nativeWidget;
	var alpha;
	if((RenderSupport.RendererType == "html" || clip.isHTML) && !clip.isCanvas && !RenderSupport.RenderContainers) {
		if(clip.parentClip && clip.parentClip.worldAlpha > 0) {
			alpha = clip.worldAlpha / clip.parentClip.worldAlpha;
		} else if(clip.parent != null && !clip.parent.isNativeWidget) {
			var clip1 = clip.parent;
			alpha = clip.alpha * ((RenderSupport.RendererType == "html" || clip1.isHTML) && !clip1.isCanvas && !RenderSupport.RenderContainers ? clip1.parentClip && clip1.parentClip.worldAlpha > 0 ? clip1.worldAlpha / clip1.parentClip.worldAlpha : clip1.parent != null && !clip1.parent.isNativeWidget ? clip1.alpha * DisplayObjectHelper.getNativeWidgetAlpha(clip1.parent) : clip1.alpha : clip1.alpha);
		} else {
			alpha = clip.alpha;
		}
	} else {
		alpha = clip.alpha;
	}
	if(clip.isInput) {
		if(Platform.isEdge || Platform.isIE) {
			var slicedColor = clip.style.fill.split(",");
			var newColor = slicedColor.slice(0,3).join(",") + ",";
			var newColor1 = clip.isFocused ? alpha : 0;
			var newColor2 = newColor + parseFloat(slicedColor[3]) * newColor1 + ")";
			nativeWidget.style.color = newColor2;
		} else {
			nativeWidget.style.opacity = clip.isFocused || clip.multiline || clip.autocomplete != "" ? alpha : 0;
		}
	} else {
		nativeWidget.style.opacity = alpha != 1 || Platform.isIE ? alpha : null;
	}
};
DisplayObjectHelper.updateNativeWidgetFilters = function(clip) {
	if(clip.parentClip.filters != null && DisplayObjectHelper.BoxShadow) {
		DisplayObjectHelper.updateNativeWidgetFilters(clip.parentClip);
	}
	if(clip.filters != null) {
		var filters = clip.filters;
		if(filters != null && filters.length > 0) {
			var filter = filters[0];
			if(HaxeRuntime.instanceof(filter,PIXI.filters.DropShadowFilter)) {
				if(DisplayObjectHelper.BoxShadow || filter.useBoxShadow || clip.isGraphics()) {
					DisplayObjectHelper.applyNativeWidgetBoxShadow(clip,filter);
				} else {
					var color = PIXI.utils.hex2rgb(filter.color,[]);
					var nativeWidget = clip.nativeWidget;
					if(nativeWidget.children != null) {
						var _g = 0;
						var _g1 = nativeWidget.children;
						while(_g < _g1.length) {
							var childWidget = _g1[_g];
							++_g;
							childWidget.style.boxShadow = null;
						}
					}
					nativeWidget.style.filter = "drop-shadow(\n\t\t\t\t\t\t\t" + Math.cos(filter.angle) * filter.distance + "px\n\t\t\t\t\t\t\t" + Math.sin(filter.angle) * filter.distance + "px\n\t\t\t\t\t\t\t" + filter.blur + "px\n\t\t\t\t\t\t\trgba(" + color[0] * 255 + ", " + color[1] * 255 + ", " + color[2] * 255 + ", " + filter.alpha + ")\n\t\t\t\t\t\t)";
				}
			} else if(HaxeRuntime.instanceof(filter,PIXI.filters.BlurFilter)) {
				var nativeWidget = clip.nativeWidget;
				nativeWidget.style.filter = "blur(" + filter.blur + "px)";
			} else if(HaxeRuntime.instanceof(filter,BlurBackdropFilter)) {
				var nativeWidget = clip.nativeWidget;
				nativeWidget.style.setProperty("backdrop-filter","blur(" + filter.spread + "px)");
				nativeWidget.style.setProperty("-webkit-backdrop-filter","blur(" + filter.spread + "px)");
			}
		}
	}
};
DisplayObjectHelper.applyNativeWidgetBoxShadow = function(parent,filter) {
	var color = PIXI.utils.hex2rgb(filter.color,[]);
	var clip = DisplayObjectHelper.getFirstGraphicsOrSprite(parent);
	if(clip == null) {
		return;
	}
	var nativeWidget = clip.nativeWidget;
	if(clip.filterPadding != parent.filterPadding) {
		clip.filterPadding = parent.filterPadding;
		if(clip.updateNativeWidgetGraphicsData != null) {
			clip.updateNativeWidgetGraphicsData();
		}
	}
	if(nativeWidget != null) {
		var svgs = nativeWidget.getElementsByTagName("svg");
		if(svgs.length > 0) {
			var svg = svgs[0];
			var elementId = svg.parentNode.getAttribute("id");
			var clipFilter = nativeWidget.querySelector("#" + elementId + "filter");
			if(clipFilter != null && clipFilter.parentNode != null) {
				clipFilter.parentNode.removeChild(clipFilter);
			}
			var defs = svg.firstElementChild != null && svg.firstElementChild.tagName.toLowerCase() == "defs" ? svg.firstElementChild : window.document.createElementNS("http://www.w3.org/2000/svg","defs");
			clipFilter = defs.firstElementChild != null && defs.firstElementChild.tagName.toLowerCase() == "mask" ? defs.firstElementChild : window.document.createElementNS("http://www.w3.org/2000/svg","filter");
			var _g = 0;
			var _g1 = clipFilter.childNodes;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				if(child.parentNode == clipFilter) {
					clipFilter.removeChild(child);
				}
			}
			var feColorMatrix = window.document.createElementNS("http://www.w3.org/2000/svg","feColorMatrix");
			feColorMatrix.setAttribute("in","SourceAlpha");
			feColorMatrix.setAttribute("result","matrixOut");
			feColorMatrix.setAttribute("type","matrix");
			feColorMatrix.setAttribute("values","" + color[0] + " " + color[0] + " " + color[0] + " " + color[0] + " 0\n\t\t\t\t\t\t\t\t\t\t\t\t\t" + color[1] + " " + color[1] + " " + color[1] + " " + color[1] + " 0\n\t\t\t\t\t\t\t\t\t\t\t\t\t" + color[2] + " " + color[2] + " " + color[2] + " " + color[2] + " 0\n\t\t\t\t\t\t\t\t\t\t\t\t\t0 0 0 " + Std.string(filter.alpha) + " 0");
			var feOffset = window.document.createElementNS("http://www.w3.org/2000/svg","feOffset");
			feOffset.setAttribute("result","offOut");
			feOffset.setAttribute("in","matrixOut");
			feOffset.setAttribute("dx","" + Math.cos(filter.angle) * filter.distance);
			feOffset.setAttribute("dy","" + Math.sin(filter.angle) * filter.distance);
			var feGaussianBlur = window.document.createElementNS("http://www.w3.org/2000/svg","feGaussianBlur");
			if(!Platform.isSafari) {
				feGaussianBlur.setAttribute("result","blurOut");
			}
			feGaussianBlur.setAttribute("in","offOut");
			feGaussianBlur.setAttribute("stdDeviation","" + Std.string(filter.blur));
			clipFilter.setAttribute("id",elementId + "filter");
			clipFilter.setAttribute("x","" + -clip.filterPadding);
			clipFilter.setAttribute("y","" + -clip.filterPadding);
			var widgetBounds = clip.widgetBounds;
			var widgetWidth;
			var widgetWidth1;
			if(widgetBounds != null) {
				var f = widgetBounds.minX;
				widgetWidth1 = isFinite(f);
			} else {
				widgetWidth1 = false;
			}
			if(widgetWidth1) {
				var f = widgetBounds.minX;
				widgetWidth = isFinite(f) ? widgetBounds.maxX - widgetBounds.minX : -1;
			} else {
				widgetWidth = clip.isFlowContainer && clip.mask == null ? clip.localBounds.maxX : clip.getWidth != null ? clip.getWidth() : clip.getLocalBounds().width;
			}
			clipFilter.setAttribute("width","" + (widgetWidth + clip.filterPadding));
			var widgetBounds = clip.widgetBounds;
			var tmp;
			var tmp1;
			if(widgetBounds != null) {
				var f = widgetBounds.minY;
				tmp1 = isFinite(f);
			} else {
				tmp1 = false;
			}
			if(tmp1) {
				var f = widgetBounds.minY;
				tmp = isFinite(f) ? widgetBounds.maxY - widgetBounds.minY : -1;
			} else {
				tmp = clip.isFlowContainer && clip.mask == null ? clip.localBounds.maxY : DisplayObjectHelper.getHeight(clip);
			}
			clipFilter.setAttribute("height","" + (tmp + clip.filterPadding));
			clipFilter.appendChild(feColorMatrix);
			clipFilter.appendChild(feOffset);
			clipFilter.appendChild(feGaussianBlur);
			if(!Platform.isSafari && !(Platform.isIOS && Platform.isChrome)) {
				var feBlend = window.document.createElementNS("http://www.w3.org/2000/svg","feBlend");
				feBlend.setAttribute("in2","blurOut");
				feBlend.setAttribute("in","SourceGraphic");
				feBlend.setAttribute("mode","normal");
				clipFilter.appendChild(feBlend);
			}
			defs.insertBefore(clipFilter,defs.firstChild);
			svg.insertBefore(defs,svg.firstChild);
			var blendGroup = window.document.getElementById(elementId + "blend");
			if(Platform.isSafari) {
				if(blendGroup == null) {
					blendGroup = window.document.createElementNS("http://www.w3.org/2000/svg","g");
					blendGroup.setAttribute("id",elementId + "blend");
					svg.appendChild(blendGroup);
				}
				var _g = 0;
				var _g1 = blendGroup.childNodes;
				while(_g < _g1.length) {
					var child = _g1[_g];
					++_g;
					if(child.parentNode == blendGroup) {
						blendGroup.removeChild(child);
					}
				}
			}
			var _g = 0;
			var _g1 = svg.childNodes;
			while(_g < _g1.length) {
				var child = [_g1[_g]];
				++_g;
				if(child[0].tagName.toLowerCase() != "defs" && child[0].getAttribute("id") != elementId + "blend") {
					if(Platform.isSafari) {
						child[0].removeAttribute("filter");
						blendGroup.appendChild(child[0].cloneNode());
					}
					child[0].setAttribute("filter","url(#" + elementId + "filter)");
					parent.once("clearfilter",(function(child) {
						return function() {
							if(child[0] != null) {
								child[0].removeAttribute("filter");
							}
						};
					})(child));
				}
			}
		} else {
			nativeWidget.style.boxShadow = "\n\t\t\t\t\t" + Math.cos(filter.angle) * filter.distance + "px\n\t\t\t\t\t" + Math.sin(filter.angle) * filter.distance + "px\n\t\t\t\t\t" + Std.string(filter.blur) + "px\n\t\t\t\t\trgba(" + color[0] * 255 + ", " + color[1] * 255 + ", " + color[2] * 255 + ", " + Std.string(filter.alpha) + ")\n\t\t\t\t";
			parent.once("clearfilter",function() {
				if(nativeWidget != null) {
					nativeWidget.style.boxShadow = null;
				}
			});
		}
	}
};
DisplayObjectHelper.removeNativeMask = function(clip) {
	var nativeWidget = clip.nativeWidget;
	if(nativeWidget.style.overflow != null && nativeWidget.style.overflow != "" || nativeWidget.style.clipPath != null && nativeWidget.style.clipPath != "") {
		nativeWidget.style.overflow = null;
		nativeWidget.style.webkitClipPath = null;
		nativeWidget.clipPath = null;
		nativeWidget.onscroll = null;
		nativeWidget.style.width = null;
		nativeWidget.style.height = null;
		nativeWidget.style.borderRadius = null;
	}
};
DisplayObjectHelper.scrollNativeWidget = function(clip,x,y) {
	var nativeWidget = clip.nativeWidget;
	if(nativeWidget.firstChild != null) {
		if(x < 0 || clip.scrollRect == null || x > (clip.maxLocalBounds != null ? clip.maxLocalBounds.maxX - clip.maxLocalBounds.minX : 0.0) - clip.scrollRect.width || RenderSupport.printMode) {
			nativeWidget.firstChild.style.left = "" + -(RenderSupport.RoundPixels ? Math.round(x) : Math.round(x * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio)) + "px";
			x = 0;
		} else {
			nativeWidget.firstChild.style.left = null;
		}
		if(y < 0 || clip.scrollRect == null || y > (clip.maxLocalBounds != null ? clip.maxLocalBounds.maxY - clip.maxLocalBounds.minY : 0.0) - clip.scrollRect.height || RenderSupport.printMode) {
			nativeWidget.firstChild.style.top = "" + -(RenderSupport.RoundPixels ? Math.round(y) : Math.round(y * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio)) + "px";
			y = 0;
		} else {
			nativeWidget.firstChild.style.top = null;
		}
	}
	if(clip.scrollRect != null) {
		var n = nativeWidget.scrollLeft;
		var currentScrollLeft = RenderSupport.RoundPixels ? Math.round(n) : Math.round(n * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio);
		var n = nativeWidget.scrollTop;
		var currentScrollTop = RenderSupport.RoundPixels ? Math.round(n) : Math.round(n * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio);
		var updateScrollRectFn = function() {
			if(clip.scrollRect != null && clip.parent != null) {
				clip.x = clip.x + clip.scrollRect.x - currentScrollLeft;
				clip.y = clip.y + clip.scrollRect.y - currentScrollTop;
				clip.scrollRect.x = currentScrollLeft;
				clip.scrollRect.y = currentScrollTop;
				DisplayObjectHelper.invalidateTransform(clip.scrollRect,"scrollNativeWidget");
				clip.scrollRectListener(currentScrollLeft,currentScrollTop);
			}
		};
		var scrollFn = clip.scrollRectListener != null ? function() {
			if(clip.scrollRect != null && clip.parent != null) {
				if(nativeWidget.scrollLeft != (x != 0 ? clip.scrollRect.x : x)) {
					nativeWidget.scrollLeft = x != 0 ? clip.scrollRect.x : x;
				}
				if(nativeWidget.scrollTop != (y != 0 ? clip.scrollRect.y : y)) {
					nativeWidget.scrollTop = y != 0 ? clip.scrollRect.y : y;
				}
			}
		} : function() {
			if(clip.scrollRect != null && clip.parent != null) {
				if(nativeWidget.scrollLeft != x) {
					nativeWidget.scrollLeft = x;
				}
				if(nativeWidget.scrollTop != y) {
					nativeWidget.scrollTop = y;
				}
			}
		};
		var onScrollFn = clip.scrollRectListener != null ? function() {
			if(clip.scrollRect != null && clip.parent != null) {
				var n = nativeWidget.scrollLeft;
				var nativeWidgetScrollLeft = RenderSupport.RoundPixels ? Math.round(n) : Math.round(n * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio);
				var n = nativeWidget.scrollTop;
				var nativeWidgetScrollTop = RenderSupport.RoundPixels ? Math.round(n) : Math.round(n * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio);
				if(nativeWidgetScrollLeft == currentScrollLeft && nativeWidgetScrollTop == currentScrollTop) {
					return;
				} else {
					currentScrollLeft = nativeWidgetScrollLeft;
					currentScrollTop = nativeWidgetScrollTop;
				}
				RenderSupport.off("drawframe",updateScrollRectFn);
				if(RenderSupport.Animating) {
					RenderSupport.once("drawframe",updateScrollRectFn);
				} else {
					updateScrollRectFn();
				}
			}
		} : scrollFn;
		nativeWidget.onscroll = onScrollFn;
		scrollFn();
		clip.scrollFn = scrollFn;
	}
};
DisplayObjectHelper.updateNativeWidgetMask = function(clip,attachScrollFn) {
	if(attachScrollFn == null) {
		attachScrollFn = false;
	}
	var nativeWidget = clip.nativeWidget;
	var mask = clip.mask;
	var scrollRect = clip.scrollRect;
	var viewBounds = null;
	var alphaMask = clip.alphaMask;
	if(alphaMask != null) {
		nativeWidget.style.webkitClipPath = null;
		nativeWidget.style.clipPath = null;
		nativeWidget.style.clip = null;
		nativeWidget.style.borderRadius = null;
		var svgs = nativeWidget.getElementsByTagName("svg");
		var _g = 0;
		while(_g < svgs.length) {
			var svg = svgs[_g];
			++_g;
			var elementId = svg.parentNode.getAttribute("id");
			var clipMask = svg.getElementById(elementId + "mask");
			if(clipMask != null && clipMask.parentNode != null) {
				clipMask.parentNode.removeChild(clipMask);
			}
			var defs = svg.firstElementChild != null && svg.firstElementChild.tagName.toLowerCase() == "defs" ? svg.firstElementChild : window.document.createElementNS("http://www.w3.org/2000/svg","defs");
			clipMask = defs.firstElementChild != null && defs.firstElementChild.tagName.toLowerCase() == "mask" ? defs.firstElementChild : window.document.createElementNS("http://www.w3.org/2000/svg","mask");
			var _g1 = 0;
			var _g2 = clipMask.childNodes;
			while(_g1 < _g2.length) {
				var child = _g2[_g1];
				++_g1;
				clipMask.removeChild(child);
			}
			var image = window.document.createElementNS("http://www.w3.org/2000/svg","image");
			image.setAttribute("href",alphaMask.url);
			var transform = DisplayObjectHelper.prependInvertedMatrix(clip.alphaMask.worldTransform,clip.worldTransform);
			image.setAttribute("transform","matrix(" + transform.a + " " + transform.b + " " + transform.c + " " + transform.d + " " + transform.tx + " " + transform.ty + ")");
			clipMask.setAttribute("id",elementId + "mask");
			clipMask.setAttribute("mask-type","alpha");
			clipMask.appendChild(image);
			defs.insertBefore(clipMask,defs.firstChild);
			svg.insertBefore(defs,svg.firstChild);
			var _g3 = 0;
			var _g4 = svg.childNodes;
			while(_g3 < _g4.length) {
				var child1 = _g4[_g3];
				++_g3;
				if(child1.tagName != null && child1.tagName.toLowerCase() != "defs") {
					child1.setAttribute("mask","url(#" + elementId + "mask)");
				}
			}
		}
	} else if(viewBounds != null) {
		nativeWidget.style.webkitClipPath = null;
		nativeWidget.style.clipPath = null;
		nativeWidget.style.overflow = null;
		nativeWidget.style.clip = "rect(\n\t\t\t\t" + viewBounds.minY + "px,\n\t\t\t\t" + viewBounds.maxX + "px,\n\t\t\t\t" + viewBounds.maxY + "px,\n\t\t\t\t" + viewBounds.minX + "px\n\t\t\t)";
	} else if(scrollRect != null && clip.children != null && clip.children.length > 0) {
		nativeWidget.style.webkitClipPath = null;
		nativeWidget.style.clipPath = null;
		nativeWidget.style.clip = null;
		nativeWidget.style.borderRadius = null;
		if(clip.scrollRectListener != null) {
			nativeWidget.classList.add("nativeScroll");
			nativeWidget.style.overflow = clip.cropEnabled ? clip.isInput ? "auto" : "scroll" : "visible";
		} else {
			nativeWidget.style.overflow = clip.cropEnabled ? clip.isInput ? "auto" : "hidden" : "visible";
		}
		var n = scrollRect.x;
		var n1 = scrollRect.y;
		DisplayObjectHelper.scrollNativeWidget(clip,RenderSupport.RoundPixels ? Math.round(n) : Math.round(n * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio),RenderSupport.RoundPixels ? Math.round(n1) : Math.round(n1 * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio));
	} else if(mask != null) {
		var graphicsData = mask.graphicsData;
		if(graphicsData != null) {
			var data = graphicsData[0];
			if(data.shape.type == 0) {
				nativeWidget.style.overflow = null;
				nativeWidget.style.borderRadius = null;
				var svgChildren = DisplayObjectHelper.getSVGChildren(clip);
				if(mask.parent.localTransformChanged) {
					mask.parent.transform.updateLocalTransform();
				}
				if(Platform.isIE || svgChildren.length == 1) {
					var _g = 0;
					while(_g < svgChildren.length) {
						var svgClip = svgChildren[_g];
						++_g;
						if(svgClip.nativeWidget == null) {
							continue;
						}
						var svg = svgClip.nativeWidget.firstChild;
						if(svg == null) {
							continue;
						}
						var elementId = svg.parentNode.getAttribute("id");
						var clipMask = svg.getElementById(elementId + "mask");
						if(clipMask != null && clipMask.parentNode != null) {
							clipMask.parentNode.removeChild(clipMask);
						}
						var defs = svg.firstElementChild != null && svg.firstElementChild.tagName.toLowerCase() == "defs" ? svg.firstElementChild : window.document.createElementNS("http://www.w3.org/2000/svg","defs");
						clipMask = defs.firstElementChild != null && defs.firstElementChild.tagName.toLowerCase() == "mask" ? defs.firstElementChild : window.document.createElementNS("http://www.w3.org/2000/svg","mask");
						var _g1 = 0;
						var _g2 = clipMask.childNodes;
						while(_g1 < _g2.length) {
							var child = _g2[_g1];
							++_g1;
							clipMask.removeChild(child);
						}
						var path = window.document.createElementNS("http://www.w3.org/2000/svg","path");
						var d = data.shape.points.map(function(p, i) {
								return i % 2 == 0 ? (i == 0 ? 'M' : 'L') + p + ' ' : '' + p + ' ';
							}).join('');
						path.setAttribute("d",d);
						path.setAttribute("fill","white");
						var transform = DisplayObjectHelper.prependInvertedMatrix(mask.worldTransform,svgClip.worldTransform);
						path.setAttribute("transform","matrix(" + transform.a + " " + transform.b + " " + transform.c + " " + transform.d + " " + transform.tx + " " + transform.ty + ")");
						clipMask.setAttribute("id",elementId + "mask");
						clipMask.appendChild(path);
						defs.insertBefore(clipMask,defs.firstChild);
						svg.insertBefore(defs,svg.firstChild);
						var _g3 = 0;
						var _g4 = svg.childNodes;
						while(_g3 < _g4.length) {
							var child1 = _g4[_g3];
							++_g3;
							if(child1.tagName != null && child1.tagName.toLowerCase() != "defs") {
								child1.setAttribute("mask","url(#" + elementId + "mask)");
							}
						}
					}
				} else {
					var maskTransform = DisplayObjectHelper.prependInvertedMatrix(clip.worldTransform,mask.worldTransform);
					nativeWidget.style.clipPath = 'polygon(' + data.shape.points.map(function (p, i) {
							return i % 2 == 0 ? '' + p * maskTransform.a + 'px ' : '' + p * maskTransform.d + 'px' + (i != data.shape.points.length - 1 ? ',' : '')
						}).join('') + ')';
					nativeWidget.style.webkitClipPath = nativeWidget.style.clipPath;
				}
			} else if(data.shape.type == 1) {
				nativeWidget.style.webkitClipPath = null;
				nativeWidget.style.clipPath = null;
				nativeWidget.style.borderRadius = null;
				nativeWidget.style.overflow = "hidden";
				var transform = DisplayObjectHelper.prependInvertedMatrix(mask.worldTransform,clip.worldTransform);
				var point = DisplayObjectHelper.applyTransformPoint(new PIXI.Point(data.shape.x,data.shape.y),transform);
				var n = point.x;
				var n1 = point.y;
				DisplayObjectHelper.scrollNativeWidget(clip,RenderSupport.RoundPixels ? Math.round(n) : Math.round(n * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio),RenderSupport.RoundPixels ? Math.round(n1) : Math.round(n1 * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio));
			} else if(data.shape.type == 2) {
				nativeWidget.style.webkitClipPath = null;
				nativeWidget.style.clipPath = null;
				var n = data.shape.radius;
				nativeWidget.style.borderRadius = "" + (RenderSupport.RoundPixels ? Math.round(n) : Math.round(n * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio)) + "px";
				nativeWidget.style.overflow = "hidden";
				var transform = DisplayObjectHelper.prependInvertedMatrix(mask.worldTransform,clip.worldTransform);
				var point = DisplayObjectHelper.applyTransformPoint(new PIXI.Point(data.shape.x - data.shape.radius,data.shape.y - data.shape.radius),transform);
				var n = point.x;
				var n1 = point.y;
				DisplayObjectHelper.scrollNativeWidget(clip,RenderSupport.RoundPixels ? Math.round(n) : Math.round(n * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio),RenderSupport.RoundPixels ? Math.round(n1) : Math.round(n1 * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio));
			} else if(data.shape.type == 4) {
				nativeWidget.style.webkitClipPath = null;
				nativeWidget.style.clipPath = null;
				var n = data.shape.radius;
				nativeWidget.style.borderRadius = "" + (RenderSupport.RoundPixels ? Math.round(n) : Math.round(n * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio)) + "px";
				nativeWidget.style.overflow = "hidden";
				var transform = DisplayObjectHelper.prependInvertedMatrix(mask.worldTransform,clip.worldTransform);
				var point = DisplayObjectHelper.applyTransformPoint(new PIXI.Point(data.shape.x,data.shape.y),transform);
				var n = point.x;
				var n1 = point.y;
				DisplayObjectHelper.scrollNativeWidget(clip,RenderSupport.RoundPixels ? Math.round(n) : Math.round(n * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio),RenderSupport.RoundPixels ? Math.round(n1) : Math.round(n1 * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio));
			} else {
				DisplayObjectHelper.removeNativeMask(clip);
				haxe_Log.trace("updateNativeWidgetMask: Unknown shape type",{ fileName : "DisplayObjectHelper.hx", lineNumber : 1794, className : "DisplayObjectHelper", methodName : "updateNativeWidgetMask"});
				haxe_Log.trace(data,{ fileName : "DisplayObjectHelper.hx", lineNumber : 1795, className : "DisplayObjectHelper", methodName : "updateNativeWidgetMask"});
			}
		} else {
			DisplayObjectHelper.removeNativeMask(clip);
		}
	}
};
DisplayObjectHelper.getSVGChildren = function(clip) {
	if(clip.isSvg && clip.transform != null && clip.parent != null && clip.parent.transform != null) {
		clip.transform.updateTransform(clip.parent.transform);
	}
	var result = clip.isSvg ? [clip] : [];
	var _g = 0;
	var _g1 = clip.children || [];
	while(_g < _g1.length) {
		var child = _g1[_g];
		++_g;
		result = result.concat(DisplayObjectHelper.getSVGChildren(child));
	}
	return result;
};
DisplayObjectHelper.updateNativeWidgetInteractive = function(clip) {
	var nativeWidget = clip.nativeWidget;
	if(clip.cursor != null) {
		nativeWidget.style.cursor = clip.cursor;
	} else {
		nativeWidget.style.cursor = null;
	}
	if(clip.interactive) {
		if(Platform.isSafari || Platform.isMobile) {
			if(nativeWidget.style.onmouseover == null) {
				nativeWidget.onmouseover = function() {
					clip.emit("pointerover");
				};
				nativeWidget.onmouseout = function() {
					clip.emit("pointerout");
				};
			}
		} else if(nativeWidget.style.onpointerover == null) {
			nativeWidget.onpointerover = function() {
				clip.emit("pointerover");
			};
			nativeWidget.onpointerout = function() {
				clip.emit("pointerout");
			};
		}
		nativeWidget.style.pointerEvents = "auto";
		if(clip.isFileDrop) {
			nativeWidget.ondragover = function(e) {
				e.dataTransfer.dropEffect = "copy";
				return false;
			};
			nativeWidget.ondrop = function(e) {
				e.preventDefault();
				var files = e.dataTransfer.files;
				var fileArray = [];
				if(clip.maxFilesCount < 0) {
					clip.maxFilesCount = files.length;
				}
				var _g = 0;
				var _g1 = Math.floor(Math.min(files.length,clip.maxFilesCount));
				while(_g < _g1) {
					var idx = _g++;
					var file = files.item(idx);
					if(!clip.regExp.match(file.type)) {
						clip.maxFilesCount++;
						continue;
					}
					fileArray.push(file);
				}
				clip.onDone(fileArray);
			};
			nativeWidget.oncontextmenu = function(e) {
				if(RenderSupport.PixiView.oncontextmenu != null) {
					return RenderSupport.PixiView.oncontextmenu(e);
				} else {
					return true;
				}
			};
		} else {
			nativeWidget.oncontextmenu = function(e) {
				var preventContextMenu = clip.isInput != true;
				if(preventContextMenu) {
					e.preventDefault();
				}
				e.stopPropagation();
				return !preventContextMenu;
			};
		}
	} else {
		nativeWidget.onmouseover = null;
		nativeWidget.onmouseout = null;
		nativeWidget.onpointerover = null;
		nativeWidget.onpointerout = null;
		nativeWidget.style.pointerEvents = null;
		nativeWidget.ondragover = null;
		nativeWidget.ondrop = null;
	}
};
DisplayObjectHelper.getParentNode = function(clip) {
	if(clip.isNativeWidget) {
		if(clip.forceParentNode) {
			return clip.forceParentNode;
		} else if(clip.parentClip != null && clip.parentClip.mask != null && clip.nativeWidget.parentNode != null) {
			return clip.nativeWidget.parentNode.parentNode;
		} else {
			return clip.nativeWidget.parentNode;
		}
	}
	return null;
};
DisplayObjectHelper.updateNativeWidgetDisplay = function(clip) {
	if(clip.updateNativeWidgetDisplay != null) {
		clip.updateNativeWidgetDisplay();
	} else {
		if(clip.visibilityChanged) {
			clip.visibilityChanged = false;
			clip.nativeWidget.style.visibility = clip.loaded ? Platform.isIE ? "visible" : null : "hidden";
		} else {
			clip.nativeWidget.style.visibility = clip.renderable || clip.keepNativeWidget || clip.keepNativeWidgetFS ? Platform.isIE || clip.keepNativeWidget || clip.keepNativeWidgetFS ? "visible" : null : "hidden";
		}
		if(clip.visible) {
			if(clip.child == null && (!clip.onStage || DisplayObjectHelper.getParentNode(clip) != clip.parentClip.nativeWidget)) {
				clip.onStage = true;
				if(!Platform.isIE) {
					clip.nativeWidget.style.display = null;
				}
				DisplayObjectHelper.addNativeWidget(clip);
			}
		} else if(clip.onStage) {
			clip.onStage = false;
			if(!Platform.isIE) {
				clip.nativeWidget.style.display = "none";
			}
			var removeFn = function() {
				if(clip.isNativeWidget && !clip.onStage && (!clip.visible || clip.parent == null)) {
					DisplayObjectHelper.removeNativeWidget(clip);
				}
			};
			RenderSupport.once("drawframe",removeFn);
		}
	}
};
DisplayObjectHelper.isNativeWidget = function(clip) {
	return clip.isNativeWidget;
};
DisplayObjectHelper.isClipOnStage = function(clip) {
	if(clip.onStage) {
		return clip.transform != null;
	} else {
		return false;
	}
};
DisplayObjectHelper.addNativeWidget = function(clip) {
	if(clip.addNativeWidget != null) {
		clip.addNativeWidget();
	} else if((RenderSupport.RendererType == "html" || clip.isHTML) && !clip.isCanvas) {
		if(clip.isNativeWidget && (clip.parent != null && clip.visible && (clip.renderable || clip.keepNativeWidgetChildren || clip.keepNativeWidgetFSChildren))) {
			if(clip.forceParentNode != null) {
				clip.forceParentNode.append(clip.nativeWidget);
			} else {
				DisplayObjectHelper.appendNativeWidget(clip.parentClip || DisplayObjectHelper.findParentClip(clip),clip);
			}
			if(!DisplayObjectHelper.UseOptimization || (clip.skipOrderCheck == null || !clip.skipOrderCheck)) {
				RenderSupport.once("drawframe",function() {
					DisplayObjectHelper.broadcastEvent(clip,"pointerout");
				});
			}
		}
	} else {
		clip.once("removed",function() {
			DisplayObjectHelper.deleteNativeWidget(clip);
		});
	}
};
DisplayObjectHelper.removeNativeWidget = function(clip) {
	if(clip.removeNativeWidget != null) {
		clip.removeNativeWidget();
	} else if(clip.isNativeWidget) {
		var nativeWidget = clip.nativeWidget;
		if(nativeWidget.parentNode != null) {
			nativeWidget.parentNode.removeChild(nativeWidget);
			if(clip.parentClip != null) {
				DisplayObjectHelper.applyScrollFn(clip.parentClip);
				clip.parentClip = null;
			}
		}
	}
};
DisplayObjectHelper.findParentClip = function(clip) {
	if(clip.parent == null) {
		return null;
	} else if(clip.parent.isNativeWidget) {
		return clip.parent;
	} else {
		return DisplayObjectHelper.findParentClip(clip.parent);
	}
};
DisplayObjectHelper.findNextNativeWidget = function(clip,parent) {
	if(clip.parent != null) {
		var children = clip.parent.children;
		if(children.indexOf(clip) >= 0) {
			var _g = 0;
			var _g1 = children.slice(children.indexOf(clip) + 1);
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				if(child.visible && (!child.isNativeWidget || child.onStage && child.parentClip == parent)) {
					var nativeWidget = DisplayObjectHelper.findNativeWidgetChild(child,parent);
					if(nativeWidget != null) {
						return nativeWidget;
					}
				}
			}
		}
		if(RenderSupport.RenderContainers || clip.parent.isNativeWidget) {
			return null;
		} else {
			return DisplayObjectHelper.findNextNativeWidget(clip.parent,parent);
		}
	}
	return null;
};
DisplayObjectHelper.findNativeWidgetChild = function(clip,parent) {
	if(clip.isNativeWidget && clip.parentClip == parent && DisplayObjectHelper.getParentNode(clip) == parent.nativeWidget) {
		return clip.nativeWidget;
	} else if(!RenderSupport.RenderContainers && ((RenderSupport.RendererType == "html" || clip.isHTML) && !clip.isCanvas)) {
		var _g = 0;
		var _g1 = clip.children || [];
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			if(child.visible && (!child.isNativeWidget || child.parentClip == parent)) {
				var nativeWidget = DisplayObjectHelper.findNativeWidgetChild(child,parent);
				if(nativeWidget != null) {
					return nativeWidget;
				}
			}
		}
	}
	return null;
};
DisplayObjectHelper.appendNativeWidget = function(clip,child) {
	if(clip.isNativeWidget) {
		var childWidget = child.nativeWidget;
		if(clip.nativeWidget == window.document.body && (childWidget.style.zIndex == null || childWidget.style.zIndex == "")) {
			var localStage = child.stage;
			if(localStage != null) {
				var zIndex = 1000 * localStage.parent.children.indexOf(localStage) + (childWidget.classList.contains("droparea") ? AccessWidget.zIndexValues.droparea : AccessWidget.zIndexValues.nativeWidget);
				childWidget.style.zIndex = zIndex == null ? "null" : "" + zIndex;
			}
		}
		var skipOrderCheck = DisplayObjectHelper.SkipOrderCheckEnabled && HaxeRuntime.instanceof(child,TextClip) && (child.skipOrderCheck && clip.mask == null);
		var nextWidget = null;
		if(!skipOrderCheck) {
			var nextWidgetId = child.nextWidgetId;
			if(nextWidgetId != null && nextWidgetId != "") {
				nextWidget = clip.nativeWidget.querySelector("#" + nextWidgetId);
			}
			if(nextWidget == null) {
				nextWidget = DisplayObjectHelper.findNextNativeWidget(child,clip);
			}
		}
		if(clip.mask != null) {
			if(clip.nativeWidget.firstChild == null) {
				var cont = window.document.createElement("div");
				cont.className = "nativeWidget";
				clip.nativeWidget.appendChild(cont);
			}
			try {
				clip.nativeWidget.firstChild.insertBefore(childWidget,nextWidget);
			} catch( _g ) {
				haxe_NativeStackTrace.lastError = _g;
				console.warn("Error while appending",childWidget,"before",nextWidget);
				nextWidget = DisplayObjectHelper.findNextNativeWidget(child,clip);
				clip.nativeWidget.firstChild.insertBefore(childWidget,nextWidget);
			}
		} else {
			try {
				clip.nativeWidget.insertBefore(childWidget,nextWidget);
			} catch( _g ) {
				haxe_NativeStackTrace.lastError = _g;
				console.warn("Error while appending",childWidget,"before",nextWidget);
				nextWidget = DisplayObjectHelper.findNextNativeWidget(child,clip);
				clip.nativeWidget.insertBefore(childWidget,nextWidget);
			}
		}
		if(DisplayObjectHelper.ScreenreaderDialog && childWidget.tagName == "DIALOG") {
			if(childWidget.getAttribute("flow-force-focus") == "true") {
				RenderSupport.once("stagechanged",function() {
					DisplayObjectHelper.updateDialogElementsAriaHidden(childWidget,true);
					var unhideDialogContent = function() {
						Native.timer(500,function() {
							DisplayObjectHelper.updateDialogElementsAriaHidden(childWidget,false);
						});
					};
					var dialogTitleArr = window.document.getElementsByClassName("dialog_title");
					var dialogTitleArr1 = Array.from(dialogTitleArr);
					if(dialogTitleArr1 != null && dialogTitleArr1[0] != null) {
						RenderSupport.once("stagechanged",function() {
							var dialogTitle = dialogTitleArr1[0];
							if(dialogTitle != null) {
								dialogTitle.setAttribute("tabindex","-1");
								dialogTitle.setAttribute("aria-hidden","false");
								Native.timer(200,function() {
									dialogTitle.focus();
								});
							}
							unhideDialogContent();
						});
					} else {
						if(child.nativeWidget.showModal != null) {
							child.nativeWidget.showModal();
							RenderSupport.once("stagechanged",function() {
								if(child.nativeWidget != null) {
									child.nativeWidget.close();
								}
							});
						}
						unhideDialogContent();
					}
				});
			}
		}
		DisplayObjectHelper.applyScrollFnChildren(child);
	} else {
		DisplayObjectHelper.appendNativeWidget(clip.parent,child);
	}
};
DisplayObjectHelper.updateDialogElementsAriaHidden = function(parent,isAriaHidden) {
	var childrenArray = Array.from(parent.children);
	if(parent.tagName == "P" || parent.tagName == "SPAN" || parent.tagName == "BUTTON") {
		if(isAriaHidden) {
			parent.setAttribute("aria-hidden","true");
		} else {
			parent.removeAttribute("aria-hidden");
		}
	}
	var _g = 0;
	var _g1 = parent.children;
	while(_g < _g1.length) {
		var child = _g1[_g];
		++_g;
		DisplayObjectHelper.updateDialogElementsAriaHidden(child,isAriaHidden);
	}
};
DisplayObjectHelper.applyScrollFn = function(clip) {
	if(clip.visible && clip.scrollFn != null) {
		clip.scrollFn();
	} else if(clip.parent != null && clip.mask == null) {
		DisplayObjectHelper.applyScrollFn(clip.parent);
	}
};
DisplayObjectHelper.applyScrollFnChildren = function(clip) {
	if(clip.visible) {
		if(clip.scrollFn != null) {
			clip.scrollFn();
		}
		if(clip.isFocused) {
			if(Platform.isIE) {
				clip.nativeWidget.blur();
				RenderSupport.once("drawframe",function() {
					if(clip.nativeWidget != null) {
						clip.nativeWidget.focus();
					}
				});
			} else if(clip.nativeWidget != null) {
				clip.nativeWidget.focus();
			}
		}
	}
	var _g = 0;
	var _g1 = clip.children || [];
	while(_g < _g1.length) {
		var child = _g1[_g];
		++_g;
		DisplayObjectHelper.applyScrollFnChildren(child);
	}
};
DisplayObjectHelper.deleteNativeWidget = function(clip) {
	if(clip.nativeWidget != null) {
		DisplayObjectHelper.removeNativeWidget(clip);
		delete clip.nativeWidget;
		clip.nativeWidget = null;
		clip.isNativeWidget = false;
	}
	if(clip.accessWidget != null) {
		AccessWidget.removeAccessWidget(clip.accessWidget);
		delete clip.accessWidget;
		clip.accessWidget = null;
	}
};
DisplayObjectHelper.getWidth = function(clip) {
	if(clip.getWidth != null) {
		return clip.getWidth();
	} else {
		return clip.getLocalBounds().width;
	}
};
DisplayObjectHelper.getContentWidth = function(clip) {
	if(clip.maxLocalBounds != null) {
		return clip.maxLocalBounds.maxX - clip.maxLocalBounds.minX;
	} else {
		return 0.0;
	}
};
DisplayObjectHelper.getBoundsWidth = function(bounds) {
	var f = bounds.minX;
	if(isFinite(f)) {
		return bounds.maxX - bounds.minX;
	} else {
		return -1;
	}
};
DisplayObjectHelper.getWidgetWidth = function(clip) {
	var widgetBounds = clip.widgetBounds;
	var widgetWidth;
	var widgetWidth1;
	if(widgetBounds != null) {
		var f = widgetBounds.minX;
		widgetWidth1 = isFinite(f);
	} else {
		widgetWidth1 = false;
	}
	if(widgetWidth1) {
		var f = widgetBounds.minX;
		widgetWidth = isFinite(f) ? widgetBounds.maxX - widgetBounds.minX : -1;
	} else {
		widgetWidth = clip.isFlowContainer && clip.mask == null ? clip.localBounds.maxX : clip.getWidth != null ? clip.getWidth() : clip.getLocalBounds().width;
	}
	return widgetWidth;
};
DisplayObjectHelper.getHeight = function(clip) {
	if(clip.getHeight != null) {
		return clip.getHeight();
	} else {
		return clip.getLocalBounds().height;
	}
};
DisplayObjectHelper.getContentHeight = function(clip) {
	if(clip.maxLocalBounds != null) {
		return clip.maxLocalBounds.maxY - clip.maxLocalBounds.minY;
	} else {
		return 0.0;
	}
};
DisplayObjectHelper.getBoundsHeight = function(bounds) {
	var f = bounds.minY;
	if(isFinite(f)) {
		return bounds.maxY - bounds.minY;
	} else {
		return -1;
	}
};
DisplayObjectHelper.getWidgetHeight = function(clip) {
	var widgetBounds = clip.widgetBounds;
	var tmp;
	if(widgetBounds != null) {
		var f = widgetBounds.minY;
		tmp = isFinite(f);
	} else {
		tmp = false;
	}
	if(tmp) {
		var f = widgetBounds.minY;
		if(isFinite(f)) {
			return widgetBounds.maxY - widgetBounds.minY;
		} else {
			return -1;
		}
	} else if(clip.isFlowContainer && clip.mask == null) {
		return clip.localBounds.maxY;
	} else {
		return DisplayObjectHelper.getHeight(clip);
	}
};
DisplayObjectHelper.invalidateLocalBounds = function(clip,invalidateMask) {
	if(invalidateMask == null) {
		invalidateMask = false;
	}
	if(clip.transformChanged || clip.localBoundsChanged) {
		clip.localBoundsChanged = false;
		if(clip.graphicsBounds != null) {
			clip.calculateGraphicsBounds();
			DisplayObjectHelper.applyNewBounds(clip,clip.graphicsBounds);
		} else if(clip.widgetBounds != null) {
			clip.calculateWidgetBounds();
			DisplayObjectHelper.applyNewBounds(clip,clip.widgetBounds);
			if((clip.isHTMLStage || clip.isHTML) && clip.children && clip.children.length > 0) {
				var _g = 0;
				var _g1 = clip.children || [];
				while(_g < _g1.length) {
					var child = _g1[_g];
					++_g;
					if((!child.isMask || invalidateMask) && child.clipVisible && child.localBounds != null) {
						DisplayObjectHelper.invalidateLocalBounds(child,invalidateMask);
					}
				}
			}
		} else {
			clip.maxLocalBounds = new PIXI.Bounds();
			var _g = 0;
			var _g1 = clip.children || [];
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				if((!child.isMask || invalidateMask) && child.clipVisible && child.localBounds != null) {
					DisplayObjectHelper.invalidateLocalBounds(child,invalidateMask);
					DisplayObjectHelper.applyMaxBounds(clip,child.currentBounds);
				}
			}
			if(clip.mask == null) {
				DisplayObjectHelper.applyNewBounds(clip,clip.maxLocalBounds);
			}
		}
		if(clip.scrollRect != null) {
			DisplayObjectHelper.invalidateLocalBounds(clip.scrollRect,true);
			DisplayObjectHelper.applyNewBounds(clip,clip.scrollRect.currentBounds);
		} else if(clip.maskContainer != null) {
			DisplayObjectHelper.invalidateLocalBounds(clip.maskContainer,true);
			if(clip.localTransformChanged) {
				clip.transform.updateLocalTransform();
			}
			DisplayObjectHelper.applyNewBounds(clip,DisplayObjectHelper.applyInvertedTransform(clip.maskContainer.currentBounds,clip.localTransform));
		}
		if(clip.nativeWidgetBoundsChanged || clip.localTransformChanged) {
			if(!((RenderSupport.RendererType == "html" || clip.isHTML) && !clip.isCanvas)) {
				clip.nativeWidgetBoundsChanged = false;
			}
			if(clip.origin != null) {
				if((RenderSupport.RendererType == "html" || clip.isHTML) && !clip.isCanvas) {
					DisplayObjectHelper.initNativeWidget(clip);
					if(clip.nativeWidget != null) {
						clip.nativeWidget.style.transformOrigin = clip.origin.x * 100 + "% " + (clip.origin.y * 100 + "%");
						clip.transform.pivot.x = 0.0;
						clip.transform.pivot.y = 0.0;
					} else {
						var tmp = clip.getWidth != null ? clip.getWidth() : clip.getLocalBounds().width;
						clip.transform.pivot.x = tmp * clip.origin.x;
						var tmp = DisplayObjectHelper.getHeight(clip);
						clip.transform.pivot.y = tmp * clip.origin.y;
					}
				} else {
					var tmp = clip.getWidth != null ? clip.getWidth() : clip.getLocalBounds().width;
					clip.transform.pivot.x = tmp * clip.origin.x;
					var tmp = DisplayObjectHelper.getHeight(clip);
					clip.transform.pivot.y = tmp * clip.origin.y;
				}
			}
			if(clip.updateGraphics != null) {
				clip.updateGraphics.drawRect(clip.localBounds.minX,clip.localBounds.minY,clip.localBounds.maxX,clip.localBounds.maxY);
			}
			clip.currentBounds = DisplayObjectHelper.applyLocalBoundsTransform(clip);
		}
	}
};
DisplayObjectHelper.applyMaxBounds = function(clip,newBounds) {
	var tmp;
	var tmp1;
	if(!(clip.maxLocalBounds == null || newBounds == null)) {
		var f = newBounds.minX;
		tmp1 = !isFinite(f);
	} else {
		tmp1 = true;
	}
	if(!tmp1) {
		var f = newBounds.minY;
		tmp = !isFinite(f);
	} else {
		tmp = true;
	}
	if(tmp) {
		return;
	}
	clip.maxLocalBounds.minX = Math.min(clip.maxLocalBounds.minX,newBounds.minX);
	clip.maxLocalBounds.minY = Math.min(clip.maxLocalBounds.minY,newBounds.minY);
	clip.maxLocalBounds.maxX = Math.max(clip.maxLocalBounds.maxX,newBounds.maxX);
	clip.maxLocalBounds.maxY = Math.max(clip.maxLocalBounds.maxY,newBounds.maxY);
};
DisplayObjectHelper.applyNewBounds = function(clip,newBounds) {
	var tmp;
	var tmp1;
	if(newBounds != null) {
		var f = newBounds.minX;
		tmp1 = !isFinite(f);
	} else {
		tmp1 = true;
	}
	if(!tmp1) {
		var f = newBounds.minY;
		tmp = !isFinite(f);
	} else {
		tmp = true;
	}
	if(tmp) {
		return;
	}
	if(!DisplayObjectHelper.isEqualBounds(clip.localBounds,newBounds)) {
		if(clip.isNativeWidget) {
			if((RenderSupport.RendererType == "html" || clip.isHTML) && !clip.isCanvas) {
				DisplayObjectHelper.invalidateTransform(clip);
			} else {
				DisplayObjectHelper.invalidateParentTransform(clip);
			}
		}
		clip.nativeWidgetBoundsChanged = true;
		if(!((RenderSupport.RendererType == "html" || clip.isHTML) && !clip.isCanvas)) {
			clip.rvlast = null;
		}
		clip.localBounds.minX = newBounds.minX;
		clip.localBounds.minY = newBounds.minY;
		clip.localBounds.maxX = newBounds.maxX;
		clip.localBounds.maxY = newBounds.maxY;
	}
};
DisplayObjectHelper.prependInvertedMatrix = function(a,b,c) {
	if(c == null) {
		c = new PIXI.Matrix();
	}
	if(b.a != 1.0 || b.b != 0.0 || b.c != 0.0 || b.d != 1.0) {
		var id = 1.0 / (b.a * b.d - b.c * b.b);
		c.a = (a.a * b.d - a.b * b.c) * id;
		c.b = (a.b * b.a - a.a * b.b) * id;
		c.c = (a.c * b.d - a.d * b.c) * id;
		c.d = (a.d * b.a - a.c * b.b) * id;
		c.tx = (a.tx * b.d - a.ty * b.c + b.ty * b.c - b.tx * b.d) * id;
		c.ty = (a.ty * b.a - a.tx * b.b + b.tx * b.b - b.ty * b.a) * id;
	} else {
		c.a = a.a;
		c.b = a.b;
		c.c = a.c;
		c.d = a.d;
		c.tx = a.tx - b.tx;
		c.ty = a.ty - b.ty;
	}
	return c;
};
DisplayObjectHelper.applyLocalBoundsTransform = function(clip,container) {
	if(container == null) {
		container = new PIXI.Bounds();
	}
	if(clip.localTransformChanged) {
		clip.transform.updateLocalTransform();
	}
	var transform = clip.localTransform;
	if(clip.children != null && clip.children.length == 1 && clip.children[0].graphicsData != null && clip.children[0].graphicsData.length > 0 && clip.children[0].graphicsData[0].shape.points != null) {
		var tempPoints = clip.children[0].graphicsData[0].shape.points;
		clip.children[0].graphicsData[0].shape.points = clip.children[0].graphicsData[0].shape.points.map(function(point, i) {
				if (i % 2 == 0) {
					return point * transform.a + clip.children[0].graphicsData[0].shape.points[i + 1] * transform.c + transform.tx;
				} else {
					return clip.children[0].graphicsData[0].shape.points[i - 1] * transform.b + point * transform.d + transform.ty;
				}
			});
		clip.children[0].calculateGraphicsBounds();
		var bounds = clip.children[0].graphicsBounds;
		container.minX = bounds.minX;
		container.minY = bounds.minY;
		container.maxX = bounds.maxX;
		container.maxY = bounds.maxY;
		clip.children[0].graphicsData[0].shape.points = tempPoints;
		clip.children[0].calculateGraphicsBounds();
	} else {
		var bounds = clip.localBounds;
		DisplayObjectHelper.applyBoundsTransform(bounds,transform,container);
	}
	return container;
};
DisplayObjectHelper.applyBoundsTransform = function(bounds,transform,container) {
	if(container == null) {
		container = new PIXI.Bounds();
	}
	if(transform.a != 1 || transform.b != 0 || transform.c != 0 || transform.d != 1) {
		var x_0 = bounds.minX * transform.a + bounds.minY * transform.c + transform.tx;
		var x_1 = bounds.minX * transform.a + bounds.maxY * transform.c + transform.tx;
		var x_2 = bounds.maxX * transform.a + bounds.maxY * transform.c + transform.tx;
		var x_3 = bounds.maxX * transform.a + bounds.minY * transform.c + transform.tx;
		var y_0 = bounds.minX * transform.b + bounds.minY * transform.d + transform.ty;
		var y_1 = bounds.minX * transform.b + bounds.maxY * transform.d + transform.ty;
		var y_2 = bounds.maxX * transform.b + bounds.maxY * transform.d + transform.ty;
		var y_3 = bounds.maxX * transform.b + bounds.minY * transform.d + transform.ty;
		var n = Math.min(Math.min(x_0,x_1),Math.min(x_2,x_3));
		container.minX = RenderSupport.RoundPixels ? Math.ceil(n) : Math.ceil(n * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio);
		var n = Math.min(Math.min(y_0,y_1),Math.min(y_2,y_3));
		container.minY = RenderSupport.RoundPixels ? Math.ceil(n) : Math.ceil(n * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio);
		var n = Math.max(Math.max(x_0,x_1),Math.max(x_2,x_3));
		container.maxX = RenderSupport.RoundPixels ? Math.ceil(n) : Math.ceil(n * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio);
		var n = Math.max(Math.max(y_0,y_1),Math.max(y_2,y_3));
		container.maxY = RenderSupport.RoundPixels ? Math.ceil(n) : Math.ceil(n * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio);
	} else {
		var x_0 = bounds.minX + transform.tx;
		var x_1 = bounds.maxX + transform.tx;
		var y_0 = bounds.minY + transform.ty;
		var y_1 = bounds.maxY + transform.ty;
		var n = Math.min(x_0,x_1);
		container.minX = RenderSupport.RoundPixels ? Math.ceil(n) : Math.ceil(n * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio);
		var n = Math.min(y_0,y_1);
		container.minY = RenderSupport.RoundPixels ? Math.ceil(n) : Math.ceil(n * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio);
		var n = Math.max(x_0,x_1);
		container.maxX = RenderSupport.RoundPixels ? Math.ceil(n) : Math.ceil(n * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio);
		var n = Math.max(y_0,y_1);
		container.maxY = RenderSupport.RoundPixels ? Math.ceil(n) : Math.ceil(n * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio);
	}
	return container;
};
DisplayObjectHelper.applyInvertedTransform = function(bounds,transform,container) {
	if(container == null) {
		container = new PIXI.Bounds();
	}
	if(transform.a != 1 || transform.b != 0 || transform.c != 0 || transform.d != 1) {
		var id = 1.0 / (transform.a * transform.d - transform.c * transform.b);
		var x_0 = transform.d * id * bounds.minX + -transform.c * id * bounds.minY + (transform.ty * transform.c - transform.tx * transform.d) * id;
		var x_1 = transform.d * id * bounds.minX + -transform.c * id * bounds.maxY + (transform.ty * transform.c - transform.tx * transform.d) * id;
		var x_2 = transform.d * id * bounds.maxX + -transform.c * id * bounds.maxY + (transform.ty * transform.c - transform.tx * transform.d) * id;
		var x_3 = transform.d * id * bounds.maxX + -transform.c * id * bounds.minY + (transform.ty * transform.c - transform.tx * transform.d) * id;
		var y_0 = transform.a * id * bounds.minY + -transform.b * id * bounds.minX + (-transform.ty * transform.a + transform.tx * transform.b) * id;
		var y_1 = transform.a * id * bounds.minY + -transform.b * id * bounds.maxX + (-transform.ty * transform.a + transform.tx * transform.b) * id;
		var y_2 = transform.a * id * bounds.maxY + -transform.b * id * bounds.maxX + (-transform.ty * transform.a + transform.tx * transform.b) * id;
		var y_3 = transform.a * id * bounds.maxY + -transform.b * id * bounds.minX + (-transform.ty * transform.a + transform.tx * transform.b) * id;
		container.minX = Math.min(Math.min(x_0,x_1),Math.min(x_2,x_3));
		container.minY = Math.min(Math.min(y_0,y_1),Math.min(y_2,y_3));
		container.maxX = Math.max(Math.max(x_0,x_1),Math.max(x_2,x_3));
		container.maxY = Math.max(Math.max(y_0,y_1),Math.max(y_2,y_3));
	} else {
		var x_0 = bounds.minX - transform.tx;
		var x_1 = bounds.maxX - transform.tx;
		var y_0 = bounds.minY - transform.ty;
		var y_1 = bounds.maxY - transform.ty;
		container.minX = Math.min(x_0,x_1);
		container.minY = Math.min(y_0,y_1);
		container.maxX = Math.max(x_0,x_1);
		container.maxY = Math.max(y_0,y_1);
	}
	return container;
};
DisplayObjectHelper.applyTransformPoint = function(point,transform,container) {
	if(container == null) {
		container = new PIXI.Point();
	}
	if(transform.a != 1 || transform.b != 0 || transform.c != 0 || transform.d != 1) {
		container.x = point.x * transform.a + point.y * transform.c + transform.tx;
		container.y = point.x * transform.b + point.y * transform.d + transform.ty;
	} else {
		container.x = point.x + transform.tx;
		container.y = point.y + transform.ty;
	}
	return container;
};
DisplayObjectHelper.applyInvertedTransformPoint = function(point,transform,container) {
	if(container == null) {
		container = new PIXI.Point();
	}
	if(transform.a != 1 || transform.b != 0 || transform.c != 0 || transform.d != 1) {
		container.x = (transform.a != 0 ? point.x / transform.a : 0) + (transform.c != 0 ? point.y / transform.c : 0) - transform.tx;
		container.y = (transform.b != 0 ? point.x / transform.b : 0) + (transform.d != 0 ? point.y / transform.d : 0) - transform.ty;
	} else {
		container.x = point.x - transform.tx;
		container.y = point.y - transform.ty;
	}
	return container;
};
DisplayObjectHelper.isEqualBounds = function(bounds1,bounds2) {
	if(bounds1 != null && bounds2 != null && bounds1.minX == bounds2.minX && bounds1.minY == bounds2.minY && bounds1.maxX == bounds2.maxX) {
		return bounds1.maxY == bounds2.maxY;
	} else {
		return false;
	}
};
DisplayObjectHelper.initNativeWidget = function(clip,tagName) {
	if(clip.isCanvas) {
		return;
	}
	if(!clip.isNativeWidget || tagName != null && clip.nativeWidget.tagName.toLowerCase() != tagName) {
		clip.isNativeWidget = true;
		clip.createNativeWidget(tagName);
		DisplayObjectHelper.invalidateTransform(clip,"initNativeWidget",clip.parent != null);
	}
};
DisplayObjectHelper.invalidateRenderable = function(clip,viewBounds,hasAnimation) {
	if(hasAnimation == null) {
		hasAnimation = false;
	}
	if(!DisplayObjectHelper.InvalidateRenderable) {
		return;
	}
	var localBounds = clip.localBounds;
	if(localBounds == null || clip.isMask) {
		return;
	}
	var tmp;
	var f = localBounds.minX;
	if(isFinite(f)) {
		var f = localBounds.minY;
		tmp = !isFinite(f);
	} else {
		tmp = true;
	}
	if(tmp || localBounds.isEmpty()) {
		return;
	}
	if(clip.localTransformChanged) {
		clip.transform.updateLocalTransform();
	}
	viewBounds = DisplayObjectHelper.applyInvertedTransform(viewBounds,clip.localTransform);
	if(clip.scrollRect != null && !clip.keepNativeWidgetFSChildren) {
		viewBounds.minX = Math.max(viewBounds.minX,localBounds.minX);
		viewBounds.minY = Math.max(viewBounds.minY,localBounds.minY);
		viewBounds.maxX = Math.min(viewBounds.maxX,localBounds.maxX);
		viewBounds.maxY = Math.min(viewBounds.maxY,localBounds.maxY);
	}
	clip.viewBounds = viewBounds;
	if(!((RenderSupport.RendererType == "html" || clip.isHTML) && !clip.isCanvas) && clip.styleChanged != null || HaxeRuntime.instanceof(clip,DropAreaClip)) {
		clip.invalidateStyle();
		DisplayObjectHelper.invalidateTransform(clip,"invalidateRenderable");
	}
	var tmp;
	var f = viewBounds.minX;
	if(isFinite(f)) {
		var f = viewBounds.minY;
		tmp = !isFinite(f);
	} else {
		tmp = true;
	}
	if(tmp || viewBounds.isEmpty()) {
		if(clip.renderable != false) {
			clip.renderable = false;
			DisplayObjectHelper.invalidateVisible(clip);
			if(!clip.keepNativeWidget) {
				DisplayObjectHelper.invalidateTransform(clip,"setClipRenderable");
			}
		}
	} else {
		var renderable = viewBounds.maxX >= localBounds.minX && viewBounds.minX <= localBounds.maxX && viewBounds.maxY >= localBounds.minY && viewBounds.minY <= localBounds.maxY;
		if(clip.renderable != renderable) {
			clip.renderable = renderable;
			DisplayObjectHelper.invalidateVisible(clip);
			if(!clip.keepNativeWidget) {
				DisplayObjectHelper.invalidateTransform(clip,"setClipRenderable");
			}
		}
	}
	if(!clip.transformChanged || !clip.visible && !clip.parent.visible) {
		return;
	}
	var _g = 0;
	var _g1 = clip.children || [];
	while(_g < _g1.length) {
		var child = _g1[_g];
		++_g;
		if(!child.isMask) {
			DisplayObjectHelper.invalidateRenderable(child,viewBounds,hasAnimation || clip.hasAnimation);
		}
	}
};
DisplayObjectHelper.getClipChildren = function(clip) {
	if(!clip.children) {
		return [];
	} else {
		return true;
	}
};
DisplayObjectHelper.addElementNS = function(parent,tagName) {
	var el = parent.getElementsByTagName(tagName);
	if(el.length > 0) {
		return el[0];
	} else {
		var element = window.document.createElementNS("http://www.w3.org/2000/svg",tagName);
		parent.appendChild(element);
		return element;
	}
};
DisplayObjectHelper.renderToCanvas = function(clip,canvas,context,transform,alpha) {
	if(!clip.visible || clip.worldAlpha <= 0 || !clip.renderable) {
		return;
	}
	var tempView = null;
	var tempRootContext = null;
	var tempContext = null;
	var tempRendererType = null;
	var tempTransparent = null;
	var tempRoundPixels = null;
	var tempMaskWorldTransform = null;
	var tempWorldTransform = null;
	var tempWorldAlpha = null;
	var children = clip.children || [];
	if(RenderSupport.PixiRenderer.view != canvas) {
		tempView = RenderSupport.PixiRenderer.view;
		tempRootContext = RenderSupport.PixiRenderer.rootContext;
		tempContext = RenderSupport.PixiRenderer.context;
		tempRendererType = RenderSupport.RendererType;
		tempTransparent = RenderSupport.PixiRenderer.transparent;
		tempRoundPixels = RenderSupport.PixiRenderer.roundPixels;
		RenderSupport.PixiRenderer.view = canvas;
		var tmp = context != null ? context : canvas.getContext("2d",{ alpha : true});
		RenderSupport.PixiRenderer.rootContext = tmp;
		var tmp = context != null ? context : canvas.getContext("2d",{ alpha : true});
		RenderSupport.PixiRenderer.context = tmp;
		RenderSupport.PixiRenderer.transparent = true;
		RenderSupport.PixiRenderer.context.setTransform(1,0,0,1,0,0);
		RenderSupport.PixiRenderer.context.globalAlpha = 1;
		RenderSupport.PixiRenderer.context.clearRect(0,0,(clip.localBounds.maxX + Math.max(-clip.localBounds.minX,0.0)) * RenderSupport.PixiRenderer.resolution,(clip.localBounds.maxY + Math.max(-clip.localBounds.minY,0.0)) * RenderSupport.PixiRenderer.resolution);
		RenderSupport.RendererType = "canvas";
	}
	if(clip.mask != null) {
		if(transform != null) {
			tempMaskWorldTransform = clip.mask.transform.worldTransform;
			clip.mask.transform.worldTransform = clip.mask.transform.worldTransform.clone().prepend(transform);
		}
		RenderSupport.PixiRenderer.maskManager.pushMask(clip.mask);
	}
	if(children.length > 0) {
		var _g = 0;
		while(_g < children.length) {
			var child = children[_g];
			++_g;
			DisplayObjectHelper.renderToCanvas(child,canvas,context,transform,alpha);
		}
	} else {
		if(transform != null) {
			tempWorldTransform = clip.transform.worldTransform;
			clip.transform.worldTransform = clip.transform.worldTransform.clone().prepend(transform);
		}
		if(alpha != null && alpha > 0) {
			tempWorldAlpha = clip.worldAlpha;
			clip.worldAlpha /= alpha;
		}
		clip.renderCanvas(RenderSupport.PixiRenderer);
		if(transform != null) {
			clip.transform.worldTransform = tempWorldTransform;
		}
		if(alpha != null && alpha > 0) {
			clip.worldAlpha = tempWorldAlpha;
		}
	}
	if(clip.mask != null) {
		RenderSupport.PixiRenderer.maskManager.popMask(RenderSupport.PixiRenderer);
		if(transform != null) {
			clip.mask.transform.worldTransform = tempMaskWorldTransform;
		}
	}
	if(tempView != null) {
		RenderSupport.PixiRenderer.view = tempView;
		RenderSupport.PixiRenderer.rootContext = tempRootContext;
		RenderSupport.PixiRenderer.context = tempContext;
		RenderSupport.PixiRenderer.transparent = tempTransparent;
		RenderSupport.PixiRenderer.roundPixels = tempRoundPixels;
		RenderSupport.RendererType = tempRendererType;
	}
};
DisplayObjectHelper.addFileDropListener = function(clip,maxFilesCount,mimeTypeRegExpFilter,onDone) {
	clip.isFileDrop = true;
	clip.isInteractive = true;
	clip.maxFilesCount = maxFilesCount;
	clip.regExp = new EReg(mimeTypeRegExpFilter,"g");
	clip.onDone = onDone;
	DisplayObjectHelper.invalidateInteractive(clip);
	DisplayObjectHelper.invalidateTransform(clip,"addFileDropListener");
	return function() {
		if(!clip.destroyed) {
			clip.isFileDrop = false;
			clip.isInteractive = false;
			clip.maxFilesCount = null;
			clip.regExp = null;
			clip.onDone = null;
			DisplayObjectHelper.invalidateInteractive(clip);
			DisplayObjectHelper.invalidateTransform(clip,"addFileDropListener");
		}
	};
};
DisplayObjectHelper.isParentOf = function(parent,child) {
	if(child.parent == parent) {
		return true;
	} else if(child.parent != null) {
		return DisplayObjectHelper.isParentOf(parent,child.parent);
	} else {
		return false;
	}
};
DisplayObjectHelper.countClips = function(parent) {
	var count = 1;
	var _g = 0;
	var _g1 = parent.children || [];
	while(_g < _g1.length) {
		var child = _g1[_g];
		++_g;
		count += DisplayObjectHelper.countClips(child);
	}
	return count;
};
var FlowContainer = function(worldVisible) {
	if(worldVisible == null) {
		worldVisible = false;
	}
	this.keepNativeWidgetChildren = false;
	this.keepNativeWidget = false;
	this.isNativeWidget = false;
	this.isFlowContainer = true;
	this.isSvg = false;
	this.isCanvas = false;
	this.filterPadding = 0.0;
	this._bounds = new PIXI.Bounds();
	this.localBounds = new PIXI.Bounds();
	this.cropEnabled = true;
	this.localTransformChanged = true;
	this.worldTransformChanged = false;
	this.stageChanged = false;
	this.transformChanged = false;
	this.clipVisible = false;
	this._visible = true;
	PIXI.Container.call(this);
	this.visible = worldVisible;
	this.clipVisible = worldVisible;
	this.interactiveChildren = false;
	this.isNativeWidget = (RenderSupport.RendererType == "html" || this.isHTML) && !this.isCanvas && RenderSupport.RenderContainers || worldVisible;
	if(worldVisible) {
		this.nativeWidget = RenderSupport.RenderRoot != null ? Platform.isIE ? RenderSupport.RenderRoot : RenderSupport.RenderRoot.shadowRoot : window.document.body;
		this.id = FlowContainer.lastId++ + 1;
	} else if((RenderSupport.RendererType == "html" || this.isHTML) && !this.isCanvas) {
		this.createNativeWidget();
	}
};
FlowContainer.__name__ = true;
FlowContainer.__super__ = PIXI.Container;
FlowContainer.prototype = $extend(PIXI.Container.prototype,{
	createView: function(zorder) {
		if(zorder == null) {
			zorder = this.parent.children.indexOf(this) + 1;
		}
		if(zorder == 1) {
			this.view = RenderSupport.PixiView;
			this.context = this.view.getContext("2d",{ alpha : false});
			return;
		}
		this.view = js_Boot.__cast(window.document.createElement("canvas") , HTMLCanvasElement);
		this.view.style.zIndex = 1000 * (zorder - 1) + AccessWidget.zIndexValues.canvas + "";
		this.view.style.pointerEvents = "none";
		this.context = this.view.getContext("2d",{ alpha : true});
		this.updateView(zorder);
		this.onResize();
		RenderSupport.on("resize",$bind(this,this.onResize));
		this.on("removed",$bind(this,this.destroyView));
	}
	,updateView: function(zorder) {
		if(zorder == null) {
			zorder = this.parent.children.indexOf(this) + 1;
		}
		if(zorder > 0) {
			if(window.document.body.children.length > zorder) {
				if(window.document.body.children[zorder - 1] != this.view) {
					if(window.document.body.children.length > zorder) {
						window.document.body.insertBefore(this.view,window.document.body.children[zorder]);
					} else {
						window.document.body.appendChild(this.view);
					}
				}
			} else {
				window.document.body.appendChild(this.view);
			}
		}
	}
	,destroyView: function() {
		RenderSupport.off("resize",$bind(this,this.onResize));
		if(this.view.parentNode == window.document.body) {
			window.document.body.removeChild(this.view);
		}
		this.view = null;
		this.context = null;
	}
	,onResize: function() {
		if(this.view == RenderSupport.PixiRenderer.view) {
			return;
		}
		this.view.width = RenderSupport.PixiView.width;
		this.view.height = RenderSupport.PixiView.height;
		this.view.style.width = this.view.width / RenderSupport.backingStoreRatio + "px";
		this.view.style.height = this.view.height / RenderSupport.backingStoreRatio + "px";
	}
	,addChild: function(child) {
		if(child.parent != null) {
			child.parent.removeChild(child);
		}
		var newChild = null;
		if(child != null && child.transform != null) {
			newChild = PIXI.Container.prototype.addChild.call(this,child);
		}
		if(newChild != null) {
			DisplayObjectHelper.invalidate(newChild);
			DisplayObjectHelper.emitEvent(this,"childrenchanged");
		}
		if((RenderSupport.RendererType == "html" || this.isHTML) && !this.isCanvas && (this.scale.x != 1.0 || this.scale.y != 1.0) && (this.children || []).length > 16) {
			DisplayObjectHelper.initNativeWidget(this);
		}
		return newChild;
	}
	,addChildAt: function(child,index) {
		if(child.parent != null) {
			child.parent.removeChild(child);
		}
		var newChild = PIXI.Container.prototype.addChildAt.call(this,child,index > this.children.length ? this.children.length : index);
		if(newChild != null) {
			DisplayObjectHelper.invalidate(newChild);
			DisplayObjectHelper.emitEvent(this,"childrenchanged");
		}
		if((RenderSupport.RendererType == "html" || this.isHTML) && !this.isCanvas && (this.scale.x != 1.0 || this.scale.y != 1.0) && (this.children || []).length > 16) {
			DisplayObjectHelper.initNativeWidget(this);
		}
		return newChild;
	}
	,removeChild: function(child) {
		var oldChild = PIXI.Container.prototype.removeChild.call(this,child);
		if(oldChild != null) {
			if(this.keepNativeWidgetChildren) {
				DisplayObjectHelper.updateKeepNativeWidgetChildren(this);
			}
			if(!((RenderSupport.RendererType == "html" || this.isHTML) && !this.isCanvas)) {
				DisplayObjectHelper.invalidateTransform(this,"removeChild");
			}
			DisplayObjectHelper.emitEvent(this,"childrenchanged");
		}
		return oldChild;
	}
	,invalidateStage: function() {
		if(this.stage != null) {
			if(this.stage != this) {
				this.stage.invalidateStage();
			} else {
				this.stageChanged = true;
				RenderSupport.PixiStageChanged = true;
			}
		}
	}
	,render: function(renderer) {
		if((RenderSupport.RendererType == "html" || this.isHTML) && !this.isCanvas) {
			if(this.stageChanged) {
				this.stageChanged = false;
				var scale = RenderSupport.getAccessibilityZoom();
				if(!this.destroyed && this.scale.x != scale) {
					var from = DisplayObjectHelper.DebugUpdate ? "setClipScaleX " + this.scale.x + " : " + scale : null;
					this.scale.x = scale;
					if((RenderSupport.RendererType == "html" || this.isHTML) && !this.isCanvas && scale != 0.0) {
						DisplayObjectHelper.initNativeWidget(this);
					}
					DisplayObjectHelper.invalidateTransform(this,from);
				}
				var scale = RenderSupport.getAccessibilityZoom();
				if(!this.destroyed && this.scale.y != scale) {
					var from = DisplayObjectHelper.DebugUpdate ? "setClipScaleY " + this.scale.y + " : " + scale : null;
					this.scale.y = scale;
					if((RenderSupport.RendererType == "html" || this.isHTML) && !this.isCanvas && scale != 0.0) {
						DisplayObjectHelper.initNativeWidget(this);
					}
					DisplayObjectHelper.invalidateTransform(this,from);
				}
				if(this.transformChanged) {
					var bounds = new PIXI.Bounds();
					RenderSupport.PixiStage.localBounds = bounds;
					bounds.minX = 0;
					bounds.minY = 0;
					bounds.maxX = renderer.width;
					bounds.maxY = renderer.height;
					DisplayObjectHelper.invalidateLocalBounds(this);
					DisplayObjectHelper.invalidateRenderable(this,bounds);
					DisplayObjectHelper.InvalidateStage = false;
					this.updateTransform();
					DisplayObjectHelper.InvalidateStage = true;
				}
			}
		} else if(this.stageChanged) {
			this.stageChanged = false;
			if(this.view != null) {
				renderer.view = this.view;
				renderer.context = this.context;
				renderer.rootContext = this.context;
				renderer.transparent = this.parent.children.indexOf(this) != 0;
			}
			if(this.transformChanged) {
				var bounds = new PIXI.Bounds();
				RenderSupport.PixiStage.localBounds = bounds;
				bounds.minX = 0;
				bounds.minY = 0;
				bounds.maxX = renderer.width;
				bounds.maxY = renderer.height;
				DisplayObjectHelper.invalidateLocalBounds(this);
				DisplayObjectHelper.invalidateRenderable(this,bounds);
			}
			DisplayObjectHelper.InvalidateStage = false;
			renderer.render(this,null,true,null,false);
			DisplayObjectHelper.InvalidateStage = true;
		}
	}
	,getLocalBounds: function(rect) {
		rect = this.localBounds.getRectangle(rect);
		if(this.filterPadding != 0.0) {
			rect.x -= this.filterPadding;
			rect.y -= this.filterPadding;
			rect.width += this.filterPadding * 2.0;
			rect.height += this.filterPadding * 2.0;
		}
		return rect;
	}
	,getBounds: function(skipUpdate,rect) {
		if(!skipUpdate) {
			this.updateTransform();
		}
		this.getLocalBounds();
		this.calculateBounds();
		return this._bounds.getRectangle(rect);
	}
	,calculateBounds: function() {
		this._bounds.minX = this.localBounds.minX * this.worldTransform.a + this.localBounds.minY * this.worldTransform.c + this.worldTransform.tx;
		this._bounds.minY = this.localBounds.minX * this.worldTransform.b + this.localBounds.minY * this.worldTransform.d + this.worldTransform.ty;
		this._bounds.maxX = this.localBounds.maxX * this.worldTransform.a + this.localBounds.maxY * this.worldTransform.c + this.worldTransform.tx;
		this._bounds.maxY = this.localBounds.maxX * this.worldTransform.b + this.localBounds.maxY * this.worldTransform.d + this.worldTransform.ty;
	}
	,createNativeWidget: function(tagName) {
		if(tagName == null) {
			tagName = "div";
		}
		if(!this.isNativeWidget) {
			return;
		}
		DisplayObjectHelper.deleteNativeWidget(this);
		var tmp = this.tagName != null && this.tagName != "" ? this.tagName : tagName;
		this.nativeWidget = window.document.createElement(tmp);
		DisplayObjectHelper.updateClipID(this);
		this.nativeWidget.className = "nativeWidget";
		if(this.className != null && this.className != "") {
			this.nativeWidget.classList.add(this.className);
		}
		this.isNativeWidget = true;
		DisplayObjectHelper.invalidateParentClip(this);
	}
	,__class__: FlowContainer
});
var NativeWidgetClip = function(worldVisible) {
	if(worldVisible == null) {
		worldVisible = false;
	}
	this.focusRetries = 0;
	this.widgetHeight = -1;
	this.widgetWidth = -1;
	this.styleChanged = true;
	this.widgetBounds = new PIXI.Bounds();
	this.isFlowContainer = false;
	FlowContainer.call(this,worldVisible);
};
NativeWidgetClip.__name__ = true;
NativeWidgetClip.__super__ = FlowContainer;
NativeWidgetClip.prototype = $extend(FlowContainer.prototype,{
	createNativeWidget: function(tagName) {
		if(tagName == null) {
			tagName = "div";
		}
		if(!this.isNativeWidget) {
			return;
		}
		DisplayObjectHelper.deleteNativeWidget(this);
		this.nativeWidget = window.document.createElement(tagName);
		DisplayObjectHelper.updateClipID(this);
		this.nativeWidget.className = "nativeWidget";
		if(!((RenderSupport.RendererType == "html" || this.isHTML) && !this.isCanvas)) {
			if(this.accessWidget == null) {
				this.accessWidget = new AccessWidget(this,this.nativeWidget);
			} else {
				this.accessWidget.set_element(this.nativeWidget);
			}
			if(this.parent != null) {
				DisplayObjectHelper.addNativeWidget(this);
			} else {
				var _e = this;
				this.once("added",function() {
					DisplayObjectHelper.addNativeWidget(_e);
				});
			}
			this.invalidateStyle();
			if(!this.visible && this.parent != null) {
				DisplayObjectHelper.updateNativeWidget(this);
			}
		}
		this.isNativeWidget = true;
	}
	,updateNativeWidgetStyle: function() {
		var widgetBounds = this.widgetBounds;
		var widgetWidth;
		var widgetWidth1;
		if(widgetBounds != null) {
			var f = widgetBounds.minX;
			widgetWidth1 = isFinite(f);
		} else {
			widgetWidth1 = false;
		}
		if(widgetWidth1) {
			var f = widgetBounds.minX;
			widgetWidth = isFinite(f) ? widgetBounds.maxX - widgetBounds.minX : -1;
		} else {
			widgetWidth = this.isFlowContainer && this.mask == null ? this.localBounds.maxX : this.getWidth != null ? this.getWidth() : this.getLocalBounds().width;
		}
		this.nativeWidget.style.width = "" + widgetWidth + "px";
		var widgetBounds = this.widgetBounds;
		var tmp;
		var tmp1;
		if(widgetBounds != null) {
			var f = widgetBounds.minY;
			tmp1 = isFinite(f);
		} else {
			tmp1 = false;
		}
		if(tmp1) {
			var f = widgetBounds.minY;
			tmp = isFinite(f) ? widgetBounds.maxY - widgetBounds.minY : -1;
		} else {
			tmp = this.isFlowContainer && this.mask == null ? this.localBounds.maxY : DisplayObjectHelper.getHeight(this);
		}
		this.nativeWidget.style.height = "" + tmp + "px";
		if(!((RenderSupport.RendererType == "html" || this.isHTML) && !this.isCanvas)) {
			var viewBounds = DisplayObjectHelper.getViewBounds(this);
			if(viewBounds != null) {
				this.nativeWidget.style.clip = "rect(\n\t\t\t\t\t" + viewBounds.minY + "px,\n\t\t\t\t\t" + viewBounds.maxX + "px,\n\t\t\t\t\t" + viewBounds.maxY + "px,\n\t\t\t\t\t" + viewBounds.minX + "px\n\t\t\t\t)";
			}
		}
		this.styleChanged = false;
	}
	,setFocus: function(focus) {
		var _gthis = this;
		if(this.nativeWidget != null) {
			if(this.nativeWidget.parentNode == null && !this.destroyed && this.focusRetries < 3 && focus) {
				this.focusRetries++;
				RenderSupport.once("drawframe",function() {
					_gthis.setFocus(focus);
				});
				return true;
			}
			this.focusRetries = 0;
			if(focus && this.nativeWidget.focus != null && !this.getFocus()) {
				this.nativeWidget.focus();
				if(RenderSupport.EnableFocusFrame) {
					this.nativeWidget.classList.add("focused");
				}
				return true;
			} else if(!focus && this.nativeWidget.blur != null && this.getFocus()) {
				this.nativeWidget.blur();
				this.nativeWidget.classList.remove("focused");
				return true;
			}
			return false;
		} else {
			return false;
		}
	}
	,getFocus: function() {
		var _gthis = this;
		if(this.nativeWidget != null) {
			if(window.document.activeElement != this.nativeWidget) {
				return RenderSupport.FlowInstances.some(function(instance) {
					var shadowRoot = instance.stage.nativeWidget;
					if(shadowRoot.host == window.document.activeElement) {
						return shadowRoot.activeElement == _gthis.nativeWidget;
					} else {
						return false;
					}
				});
			} else {
				return true;
			}
		} else {
			return false;
		}
	}
	,requestFullScreen: function() {
		if(this.nativeWidget != null) {
			RenderSupport.requestFullScreen(this.nativeWidget);
		}
	}
	,exitFullScreen: function() {
		if(this.nativeWidget != null) {
			RenderSupport.exitFullScreen(this.nativeWidget);
		}
	}
	,invalidateStyle: function() {
		this.styleChanged = true;
		DisplayObjectHelper.invalidateTransform(this,"invalidateStyle");
	}
	,setWidth: function(widgetWidth) {
		if(this.widgetWidth != widgetWidth) {
			this.widgetWidth = widgetWidth;
			this.invalidateStyle();
		}
	}
	,setHeight: function(widgetHeight) {
		if(this.widgetHeight != widgetHeight) {
			this.widgetHeight = widgetHeight;
			this.invalidateStyle();
		}
	}
	,setViewBounds: function(viewBounds) {
		if(this.viewBounds != viewBounds) {
			this.viewBounds = viewBounds;
			this.invalidateStyle();
		}
	}
	,calculateWidgetBounds: function() {
		this.widgetBounds.minX = 0.0;
		this.widgetBounds.minY = 0.0;
		var n = this.getWidth();
		this.widgetBounds.maxX = RenderSupport.RoundPixels ? Math.ceil(n) : Math.ceil(n * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio);
		var n = this.getHeight();
		this.widgetBounds.maxY = RenderSupport.RoundPixels ? Math.ceil(n) : Math.ceil(n * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio);
	}
	,getWidth: function() {
		return this.widgetWidth;
	}
	,getHeight: function() {
		return this.widgetHeight;
	}
	,__class__: NativeWidgetClip
});
var DropAreaClip = function(maxFilesCount,mimeTypeRegExpFilter,onDone) {
	this.isInteractive = true;
	NativeWidgetClip.call(this);
	this.keepNativeWidget = true;
	this.maxFilesCount = maxFilesCount;
	this.regExp = new EReg(mimeTypeRegExpFilter,"g");
	this.onDone = onDone;
	this.widgetBounds.minX = 0;
	this.widgetBounds.minY = 0;
	this.widgetBounds.maxX = 0;
	this.widgetBounds.maxY = 0;
	if((RenderSupport.RendererType == "html" || this.isHTML) && !this.isCanvas) {
		this.styleChanged = false;
	}
	DisplayObjectHelper.initNativeWidget(this);
};
DropAreaClip.__name__ = true;
DropAreaClip.onContextMenu = function(event) {
	if(RenderSupport.PixiView.oncontextmenu != null) {
		return RenderSupport.PixiView.oncontextmenu(event);
	} else {
		return true;
	}
};
DropAreaClip.onDragOver = function(event) {
	event.dataTransfer.dropEffect = "copy";
	return false;
};
DropAreaClip.__super__ = NativeWidgetClip;
DropAreaClip.prototype = $extend(NativeWidgetClip.prototype,{
	updateNativeWidgetStyle: function() {
		this.calculateWidgetBounds();
		NativeWidgetClip.prototype.updateNativeWidgetStyle.call(this);
		this.styleChanged = true;
	}
	,createNativeWidget: function(tagName) {
		if(tagName == null) {
			tagName = "div";
		}
		if(!this.isNativeWidget) {
			return;
		}
		NativeWidgetClip.prototype.createNativeWidget.call(this,tagName);
		if(this.accessWidget != null) {
			this.accessWidget.set_nodeindex([-AccessWidget.tree.childrenSize]);
		}
		this.nativeWidget.classList.add("nativeWidget");
		this.nativeWidget.classList.add("droparea");
		this.nativeWidget.oncontextmenu = DropAreaClip.onContextMenu;
		this.nativeWidget.ondragover = DropAreaClip.onDragOver;
		this.nativeWidget.ondrop = $bind(this,this.onDrop);
		this.nativeWidget.onmousedown = $bind(this,this.onMouseDown);
		if(!((RenderSupport.RendererType == "html" || this.isHTML) && !this.isCanvas)) {
			this.nativeWidget.onmousemove = $bind(this,this.onMouseMove);
			this.nativeWidget.onpointerover = function(e) {
				RenderSupport.PixiRenderer.plugins.interaction.onPointerOver(e);
			};
			this.nativeWidget.onpointerout = function(e) {
				RenderSupport.PixiRenderer.plugins.interaction.onPointerOut(e);
			};
		}
		this.nativeWidget.style.pointerEvents = "auto";
		if((RenderSupport.RendererType == "html" || this.isHTML) && !this.isCanvas) {
			this.nativeWidget.style.height = "inherit";
			this.nativeWidget.style.width = "inherit";
		}
	}
	,onDrop: function(event) {
		event.preventDefault();
		var files = event.dataTransfer.files;
		var fileArray = [];
		if(this.maxFilesCount < 0) {
			this.maxFilesCount = files.length;
		}
		var _g = 0;
		var _g1 = Math.floor(Math.min(files.length,this.maxFilesCount));
		while(_g < _g1) {
			var idx = _g++;
			var file = files.item(idx);
			if(!this.regExp.match(file.type)) {
				this.maxFilesCount++;
				continue;
			}
			fileArray.push(file);
		}
		this.onDone(fileArray);
	}
	,onMouseDown: function(e) {
		e.preventDefault();
	}
	,onMouseMove: function(e) {
		this.nativeWidget.style.cursor = RenderSupport.PixiView.style.cursor;
	}
	,calculateWidgetBounds: function() {
		if(this.parent != null && this.parent.localBounds != null) {
			this.widgetBounds = this.parent.localBounds;
		}
	}
	,__class__: DropAreaClip
});
var Errors = function() {
	this.callBack = null;
	this.doTrace = true;
	this.count = 0;
};
Errors.__name__ = true;
Errors.get = function() {
	if(Errors.instance == null) {
		Errors.instance = new Errors();
	}
	return Errors.instance;
};
Errors.report = function(text) {
	Errors.get().add(text);
	var fh = Errors.get();
	fh.count++;
	console.error("Error: " + text);
	Errors.addToLog(text);
};
Errors.warning = function(text) {
	Errors.get().add(text);
	console.warn("Warning: " + text);
};
Errors.print = function(text) {
	if(!Errors.get().doTrace) {
		return;
	}
	console.log(text);
};
Errors.getCount = function() {
	return Errors.get().count;
};
Errors.resetCount = function() {
	Errors.get().count = 0;
};
Errors.addToLog = function(m) {
	if(Errors.dontlog) {
		return;
	}
};
Errors.closeErrorLog = function() {
};
Errors.prototype = {
	add: function(text) {
		if(this.callBack != null) {
			this.callBack(text);
		}
	}
	,__class__: Errors
};
var FlowArrayUtil = function() { };
FlowArrayUtil.__name__ = true;
FlowArrayUtil.fromArray = function(a) {
	return a;
};
FlowArrayUtil.toArray = function(a) {
	var v = [];
	var _g = 0;
	while(_g < a.length) {
		var e = a[_g];
		++_g;
		v.push(e);
	}
	return v;
};
FlowArrayUtil.one = function(e) {
	return [e];
};
FlowArrayUtil.two = function(e1,e2) {
	return [e1,e2];
};
FlowArrayUtil.three = function(e1,e2,e3) {
	return [e1,e2,e3];
};
var FlowCanvas = function(worldVisible) {
	if(worldVisible == null) {
		worldVisible = false;
	}
	this.isCanvasStage = true;
	this.isFlowContainer = false;
	FlowContainer.call(this,worldVisible);
	if((RenderSupport.RendererType == "html" || this.isHTML) && !this.isCanvas) {
		DisplayObjectHelper.initNativeWidget(this,"canvas");
	}
};
FlowCanvas.__name__ = true;
FlowCanvas.__super__ = FlowContainer;
FlowCanvas.prototype = $extend(FlowContainer.prototype,{
	updateNativeWidget: function() {
		if(this.visible && this.worldAlpha > 0 && this.renderable) {
			var tempResolution = RenderSupport.PixiRenderer.resolution;
			RenderSupport.PixiRenderer.resolution = Math.max(this.worldTransform.a,this.worldTransform.d) >= 1.0 ? Math.ceil(Math.max(this.worldTransform.a,this.worldTransform.d) * tempResolution) : Math.max(this.worldTransform.a,this.worldTransform.d) * tempResolution;
			if(DisplayObjectHelper.DebugUpdate) {
				this.nativeWidget.setAttribute("update",(this.nativeWidget.getAttribute("update") | 0) + 1);
				if(this.from) {
					this.nativeWidget.setAttribute("from",this.from);
					this.from = null;
				}
				if(this.info) {
					this.nativeWidget.setAttribute("info",this.info);
				}
			}
			DisplayObjectHelper.updateNativeWidgetTransformMatrix(this);
			DisplayObjectHelper.updateNativeWidgetOpacity(this);
			var transform = this.worldTransform.clone().invert();
			transform.tx += Math.max(-this.localBounds.minX,0.0);
			transform.ty += Math.max(-this.localBounds.minY,0.0);
			var canvas = this.nativeWidget;
			var context = this.context;
			var alpha = this.worldAlpha;
			if(!(!this.visible || this.worldAlpha <= 0 || !this.renderable)) {
				var tempView = null;
				var tempRootContext = null;
				var tempContext = null;
				var tempRendererType = null;
				var tempTransparent = null;
				var tempRoundPixels = null;
				var tempMaskWorldTransform = null;
				var tempWorldTransform = null;
				var tempWorldAlpha = null;
				var children = this.children || [];
				if(RenderSupport.PixiRenderer.view != canvas) {
					tempView = RenderSupport.PixiRenderer.view;
					tempRootContext = RenderSupport.PixiRenderer.rootContext;
					tempContext = RenderSupport.PixiRenderer.context;
					tempRendererType = RenderSupport.RendererType;
					tempTransparent = RenderSupport.PixiRenderer.transparent;
					tempRoundPixels = RenderSupport.PixiRenderer.roundPixels;
					RenderSupport.PixiRenderer.view = canvas;
					var tmp = context != null ? context : canvas.getContext("2d",{ alpha : true});
					RenderSupport.PixiRenderer.rootContext = tmp;
					var tmp = context != null ? context : canvas.getContext("2d",{ alpha : true});
					RenderSupport.PixiRenderer.context = tmp;
					RenderSupport.PixiRenderer.transparent = true;
					RenderSupport.PixiRenderer.context.setTransform(1,0,0,1,0,0);
					RenderSupport.PixiRenderer.context.globalAlpha = 1;
					RenderSupport.PixiRenderer.context.clearRect(0,0,(this.localBounds.maxX + Math.max(-this.localBounds.minX,0.0)) * RenderSupport.PixiRenderer.resolution,(this.localBounds.maxY + Math.max(-this.localBounds.minY,0.0)) * RenderSupport.PixiRenderer.resolution);
					RenderSupport.RendererType = "canvas";
				}
				if(this.mask != null) {
					if(transform != null) {
						tempMaskWorldTransform = this.mask.transform.worldTransform;
						this.mask.transform.worldTransform = this.mask.transform.worldTransform.clone().prepend(transform);
					}
					RenderSupport.PixiRenderer.maskManager.pushMask(this.mask);
				}
				if(children.length > 0) {
					var _g = 0;
					while(_g < children.length) {
						var child = children[_g];
						++_g;
						if(!(!child.visible || child.worldAlpha <= 0 || !child.renderable)) {
							var tempView1 = null;
							var tempRootContext1 = null;
							var tempContext1 = null;
							var tempRendererType1 = null;
							var tempTransparent1 = null;
							var tempRoundPixels1 = null;
							var tempMaskWorldTransform1 = null;
							var tempWorldTransform1 = null;
							var tempWorldAlpha1 = null;
							var children1 = child.children || [];
							if(RenderSupport.PixiRenderer.view != canvas) {
								tempView1 = RenderSupport.PixiRenderer.view;
								tempRootContext1 = RenderSupport.PixiRenderer.rootContext;
								tempContext1 = RenderSupport.PixiRenderer.context;
								tempRendererType1 = RenderSupport.RendererType;
								tempTransparent1 = RenderSupport.PixiRenderer.transparent;
								tempRoundPixels1 = RenderSupport.PixiRenderer.roundPixels;
								RenderSupport.PixiRenderer.view = canvas;
								var tmp = context != null ? context : canvas.getContext("2d",{ alpha : true});
								RenderSupport.PixiRenderer.rootContext = tmp;
								var tmp1 = context != null ? context : canvas.getContext("2d",{ alpha : true});
								RenderSupport.PixiRenderer.context = tmp1;
								RenderSupport.PixiRenderer.transparent = true;
								RenderSupport.PixiRenderer.context.setTransform(1,0,0,1,0,0);
								RenderSupport.PixiRenderer.context.globalAlpha = 1;
								RenderSupport.PixiRenderer.context.clearRect(0,0,(child.localBounds.maxX + Math.max(-child.localBounds.minX,0.0)) * RenderSupport.PixiRenderer.resolution,(child.localBounds.maxY + Math.max(-child.localBounds.minY,0.0)) * RenderSupport.PixiRenderer.resolution);
								RenderSupport.RendererType = "canvas";
							}
							if(child.mask != null) {
								if(transform != null) {
									tempMaskWorldTransform1 = child.mask.transform.worldTransform;
									child.mask.transform.worldTransform = child.mask.transform.worldTransform.clone().prepend(transform);
								}
								RenderSupport.PixiRenderer.maskManager.pushMask(child.mask);
							}
							if(children1.length > 0) {
								var _g1 = 0;
								while(_g1 < children1.length) {
									var child1 = children1[_g1];
									++_g1;
									DisplayObjectHelper.renderToCanvas(child1,canvas,context,transform,alpha);
								}
							} else {
								if(transform != null) {
									tempWorldTransform1 = child.transform.worldTransform;
									child.transform.worldTransform = child.transform.worldTransform.clone().prepend(transform);
								}
								if(alpha != null && alpha > 0) {
									tempWorldAlpha1 = child.worldAlpha;
									child.worldAlpha /= alpha;
								}
								child.renderCanvas(RenderSupport.PixiRenderer);
								if(transform != null) {
									child.transform.worldTransform = tempWorldTransform1;
								}
								if(alpha != null && alpha > 0) {
									child.worldAlpha = tempWorldAlpha1;
								}
							}
							if(child.mask != null) {
								RenderSupport.PixiRenderer.maskManager.popMask(RenderSupport.PixiRenderer);
								if(transform != null) {
									child.mask.transform.worldTransform = tempMaskWorldTransform1;
								}
							}
							if(tempView1 != null) {
								RenderSupport.PixiRenderer.view = tempView1;
								RenderSupport.PixiRenderer.rootContext = tempRootContext1;
								RenderSupport.PixiRenderer.context = tempContext1;
								RenderSupport.PixiRenderer.transparent = tempTransparent1;
								RenderSupport.PixiRenderer.roundPixels = tempRoundPixels1;
								RenderSupport.RendererType = tempRendererType1;
							}
						}
					}
				} else {
					if(transform != null) {
						tempWorldTransform = this.transform.worldTransform;
						this.transform.worldTransform = this.transform.worldTransform.clone().prepend(transform);
					}
					if(alpha != null && alpha > 0) {
						tempWorldAlpha = this.worldAlpha;
						this.worldAlpha /= alpha;
					}
					this.renderCanvas(RenderSupport.PixiRenderer);
					if(transform != null) {
						this.transform.worldTransform = tempWorldTransform;
					}
					if(alpha != null && alpha > 0) {
						this.worldAlpha = tempWorldAlpha;
					}
				}
				if(this.mask != null) {
					RenderSupport.PixiRenderer.maskManager.popMask(RenderSupport.PixiRenderer);
					if(transform != null) {
						this.mask.transform.worldTransform = tempMaskWorldTransform;
					}
				}
				if(tempView != null) {
					RenderSupport.PixiRenderer.view = tempView;
					RenderSupport.PixiRenderer.rootContext = tempRootContext;
					RenderSupport.PixiRenderer.context = tempContext;
					RenderSupport.PixiRenderer.transparent = tempTransparent;
					RenderSupport.PixiRenderer.roundPixels = tempRoundPixels;
					RenderSupport.RendererType = tempRendererType;
				}
			}
			RenderSupport.PixiRenderer.resolution = tempResolution;
			if(this.worldTransform.tx < 0 || this.worldTransform.ty < 0) {
				this.localTransformChanged = true;
			}
		} else {
			this.localTransformChanged = true;
		}
		DisplayObjectHelper.updateNativeWidgetDisplay(this);
	}
	,createNativeWidget: function(tagName) {
		if(tagName == null) {
			tagName = "canvas";
		}
		var _gthis = this;
		FlowContainer.prototype.createNativeWidget.call(this,tagName);
		RenderSupport.RendererType = "canvas";
		PixiWorkarounds.workaroundGetContext();
		this.context = this.nativeWidget != null ? this.nativeWidget.getContext("2d",{ alpha : true}) : null;
		if(this.nativeWidget != null) {
			this.nativeWidget.onpointermove = function(e) {
				RenderSupport.PixiRenderer.plugins.interaction.onPointerMove(e);
				_gthis.nativeWidget.style.cursor = RenderSupport.PixiView.style.cursor;
			};
			this.nativeWidget.onpointerover = function(e) {
				RenderSupport.PixiRenderer.plugins.interaction.onPointerOver(e);
			};
			this.nativeWidget.onpointerout = function(e) {
				RenderSupport.PixiRenderer.plugins.interaction.onPointerOut(e);
			};
			this.nativeWidget.style.pointerEvents = "auto";
		}
		RenderSupport.RendererType = "html";
		PixiWorkarounds.workaroundGetContext();
	}
	,destroy: function(options) {
		FlowContainer.prototype.destroy.call(this,options);
		if(this.context != null) {
			delete this.context;
		}
	}
	,__class__: FlowCanvas
});
var FlowFileSystem = function() { };
FlowFileSystem.__name__ = true;
FlowFileSystem.createTempFile = function(name,content0) {
	var content = content0;
	if(Platform.isSafari && content0.indexOf("å") != -1) {
		content = StringTools.replace(content0,"å","å​");
	} else if(Platform.isIE || Platform.isEdge) {
		var blob = new Blob([content],{ });
		return FlowFileSystem.blob2file(name,blob);
	}
	return new File([content],name);
};
FlowFileSystem.makeFileByBlobUrl = function(url,name,onFile,onError) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET",url,true);
	xhr.responseType = "blob";
	xhr.addEventListener("load",function(e) {
		if(xhr.status == 200) {
			onFile(new File([xhr.response],name));
		}
	},false);
	xhr.addEventListener("error",function(e) {
		onError(xhr.responseText);
	},false);
	xhr.send("");
};
FlowFileSystem.blob2file = function(name,jsBlob) {
	var file2 = 
				Object.assign(jsBlob, {
					lastModified: Date.now(),
					lastModifiedDate: Date.now(),
					name: name,
					webkitRelativePath: '',
					prototype: Object.getPrototypeOf(File),
					__proto__: File,
				})
			;
	return file2;
};
FlowFileSystem.createDirectory = function(dir) {
	try {
		return "";
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		var e = haxe_Exception.caught(_g).unwrap();
		return Std.string(e);
	}
};
FlowFileSystem.deleteDirectory = function(dir) {
	try {
		return "";
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		var e = haxe_Exception.caught(_g).unwrap();
		return Std.string(e);
	}
};
FlowFileSystem.deleteFile = function(file) {
	try {
		return "";
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		var e = haxe_Exception.caught(_g).unwrap();
		return Std.string(e);
	}
};
FlowFileSystem.renameFile = function(old,newName) {
	try {
		return "";
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		var e = haxe_Exception.caught(_g).unwrap();
		return Std.string(e);
	}
};
FlowFileSystem.fileExists = function(file) {
	try {
		return false;
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		return false;
	}
};
FlowFileSystem.isDirectory = function(dir) {
	try {
		return false;
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		return false;
	}
};
FlowFileSystem.readDirectory = function(dir) {
	var d = [];
	try {
		return d;
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		return d;
	}
};
FlowFileSystem.fileSize = function(file) {
	try {
		return 0.0;
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		return 0.0;
	}
};
FlowFileSystem.fileModified = function(file) {
	try {
		return 0.0;
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		return 0.0;
	}
};
FlowFileSystem.resolveRelativePath = function(dir) {
	try {
		return dir;
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		return dir;
	}
};
FlowFileSystem.getFileByPath = function(path) {
	var d = 1;
	return d;
};
FlowFileSystem.openFileDialog = function(maxFiles,fileTypes,callback) {
	var jsFileInput = window.document.body.appendChild(window.document.createElement("INPUT"));
	jsFileInput.type = "file";
	jsFileInput.style.visibility = "hidden";
	if(maxFiles != 1) {
		jsFileInput.multiple = true;
	}
	var fTypes = "";
	var _g = 0;
	while(_g < fileTypes.length) {
		var fType = fileTypes[_g];
		++_g;
		fType = StringTools.replace(fType,"*.*","*");
		fType = StringTools.replace(fType,"*.",".");
		fTypes += fType + ",";
	}
	jsFileInput.accept = fTypes;
	jsFileInput.value = "";
	jsFileInput.onchange = function(e) {
		jsFileInput.onchange = null;
		var files = jsFileInput.files;
		var fls = [];
		var _g = 0;
		var _g1 = Math.floor(Math.min(files.length,maxFiles));
		while(_g < _g1) {
			var idx = _g++;
			fls.push(files[idx]);
		}
		callback(fls);
		window.document.body.removeChild(jsFileInput);
	};
	var onFocus = null;
	onFocus = function(e) {
		window.removeEventListener("focus",onFocus);
		if(Platform.isMobile) {
			window.removeEventListener("mousemove",onFocus);
			window.removeEventListener("pointermove",onFocus);
		}
		haxe_Timer.delay(function() {
			jsFileInput.dispatchEvent(new Event("change"));
		},500);
	};
	window.addEventListener("focus",onFocus);
	if(Platform.isMobile) {
		window.addEventListener("mousemove",onFocus);
		window.addEventListener("pointermove",onFocus);
	}
	jsFileInput.click();
};
FlowFileSystem.fileName = function(file) {
	if(file.name == undefined) {
		return "blob";
	}
	return file.name;
};
FlowFileSystem.fileType = function(file) {
	if(file.type == "") {
		return "application/octet-stream";
	}
	return file.type;
};
FlowFileSystem.fileSizeNative = function(file) {
	return file.size;
};
FlowFileSystem.fileModifiedNative = function(file) {
	return file.lastModified;
};
FlowFileSystem.fileSlice = function(file,offset,end) {
	return file.slice(offset,end);
};
FlowFileSystem.readFile = function(file,readAs,onData,onError) {
	FlowFileSystem.readFileEnc(file,readAs,"UTF8",onData,onError);
};
FlowFileSystem.readFileEnc = function(file,readAs,encoding,onData,onError) {
	if(readAs == "text" && encoding == "auto") {
		var ENCODINGS = ["UTF8","CP1252"];
		var INVALID_CHARACTER = "�";
		var aggD = [];
		var aggE = [];
		var _g = 0;
		while(_g < ENCODINGS.length) {
			var enc = [ENCODINGS[_g]];
			++_g;
			var checkFinish = [(function() {
				return function() {
					if(aggD.length + aggE.length == ENCODINGS.length) {
						var _g = 0;
						while(_g < aggD.length) {
							var d = aggD[_g];
							++_g;
							if(d[1].indexOf(INVALID_CHARACTER) == -1) {
								onData(d[1]);
								return;
							}
						}
						if(aggE.length > 0) {
							onError(aggE[0][1]);
							return;
						}
						if(aggD.length > 0) {
							onData(aggD[0][1]);
							return;
						}
						onError("Something strange happened: no data nor error callbacks triggered.");
					}
				};
			})()];
			var onD = (function(checkFinish,enc) {
				return function(d) {
					aggD.push([enc[0],d]);
					checkFinish[0]();
				};
			})(checkFinish,enc);
			var onE = (function(checkFinish,enc) {
				return function(e) {
					aggE.push([enc[0],e]);
					checkFinish[0]();
				};
			})(checkFinish,enc);
			FlowFileSystem.readFileEnc(file,readAs,enc[0],onD,onE);
		}
	} else {
		var reader = new FileReader();
		reader.onerror = function(e) {
			if(e.type == "error") {
				onError("Cannot read given file: " + reader.error.name);
			}
		};
		reader.onloadend = function() {
			if(reader.result != null) {
				onData(reader.result);
			}
		};
		switch(readAs) {
		case "data":
			reader.readAsBinaryString(file);
			break;
		case "uri":
			reader.readAsDataURL(file);
			break;
		default:
			reader.readAsText(file,encoding);
		}
	}
};
FlowFileSystem.saveFileClient = function(filename,data,type) {
	
				var file = new Blob(Array.isArray(data) ? data : [data], {type: type});

				if (window.navigator.msSaveOrOpenBlob) {
					// IE10+
					window.navigator.msSaveOrOpenBlob(file, filename);
				} else { // Others
					var a = document.createElement('a'),
							url = URL.createObjectURL(file);
					a.href = url;
					a.download = filename;
					document.body.appendChild(a);
					a.click();
					setTimeout(function() {
						document.body.removeChild(a);
						window.URL.revokeObjectURL(url);
					}, 0);
				}
			;
};
var FlowFontStyle = function() { };
FlowFontStyle.__name__ = true;
FlowFontStyle.fromFlowFonts = function(names) {
	var styles = null;
	var _g = 0;
	var _g1 = names.split(",");
	while(_g < _g1.length) {
		var name = _g1[_g];
		++_g;
		var style = FlowFontStyle.fromFlowFont(StringTools.trim(name));
		if(style != null) {
			if(styles == null) {
				styles = Reflect.copy(style);
			} else {
				styles.family = Std.string(styles.family) + ("," + style.family);
				if(styles.weight == "") {
					styles.weight = style.weight;
				}
				if(styles.size == 0.0) {
					styles.style = style.style;
				}
				if(styles.style == "") {
					styles.style = style.style;
				}
			}
		}
	}
	return styles;
};
FlowFontStyle.fromFlowFont = function(name) {
	if(FlowFontStyle.flowFontStyles == null) {
		FlowFontStyle.flowFontStyles = new haxe_ds_StringMap();
		var styles = JSON.parse(haxe_Resource.getString("fontstyles"));
		var _g = 0;
		var _g1 = Reflect.fields(styles);
		while(_g < _g1.length) {
			var fontname = _g1[_g];
			++_g;
			FlowFontStyle.flowFontStyles.h[fontname.toLowerCase()] = Reflect.field(styles,fontname);
		}
	}
	var style = FlowFontStyle.flowFontStyles.h[name.toLowerCase()];
	if(style != null) {
		return style;
	} else {
		return { family : name, weight : "", size : 0.0, style : "normal", doNotRemap : false};
	}
};
var FlowGraphics = function() {
	this.top = null;
	this.left = null;
	this.hasMask = false;
	this.keepNativeWidgetChildren = false;
	this.keepNativeWidget = false;
	this.isNativeWidget = false;
	this.isSvg = false;
	this.isCanvas = false;
	this.isEmpty = true;
	this.graphicsChanged = false;
	this.worldTransformChanged = false;
	this.transformChanged = false;
	this.graphicsBounds = new PIXI.Bounds();
	this.filterPadding = 0.0;
	this._bounds = new PIXI.Bounds();
	this.widgetBounds = new PIXI.Bounds();
	this.localBounds = new PIXI.Bounds();
	this.pen = new PIXI.Point(0.0,0.0);
	this.clipVisible = false;
	this._visible = true;
	PIXI.Graphics.call(this);
	this.visible = false;
	this.interactiveChildren = false;
	this.isNativeWidget = false;
};
FlowGraphics.__name__ = true;
FlowGraphics.trimFloat = function(f,min,max) {
	if(f < min) {
		return min;
	} else if(f > max) {
		return max;
	} else {
		return f;
	}
};
FlowGraphics.__super__ = PIXI.Graphics;
FlowGraphics.prototype = $extend(PIXI.Graphics.prototype,{
	useSvg: function() {
		this.isSvg = true;
	}
	,beginGradientFill: function(colors,alphas,offsets,matrix,type) {
		this.fillGradient = { colors : colors, alphas : alphas, offsets : offsets, matrix : matrix, type : type};
		this.beginFill(0,1.0);
	}
	,lineGradientStroke: function(colors,alphas,offsets,matrix) {
		this.strokeGradient = { colors : colors, alphas : alphas, offsets : offsets, matrix : matrix};
		this.isSvg = true;
		this.lineStyle(this.lineWidth,colors[0] & 16777215,alphas[0]);
	}
	,moveTo: function(x,y) {
		var newGraphics = PIXI.Graphics.prototype.moveTo.call(this,x,y);
		this.pen.x = x;
		this.pen.y = y;
		return newGraphics;
	}
	,lineTo: function(x,y) {
		if(!this.currentPath) {
			this.moveTo(0.0,0.0);
		}
		var newGraphics = PIXI.Graphics.prototype.lineTo.call(this,x,y);
		this.pen.x = x;
		this.pen.y = y;
		this.isSvg = true;
		return newGraphics;
	}
	,quadraticCurveTo: function(cx,cy,x,y) {
		var dx = x - this.pen.x;
		var dy = y - this.pen.y;
		var newGraphics = PIXI.Graphics.prototype.quadraticCurveTo.call(this,cx,cy,x,y);
		this.pen.x = x;
		this.pen.y = y;
		this.isSvg = true;
		return newGraphics;
	}
	,endFill: function() {
		if(this.fillColor != null && this.fillAlpha > 0 || this.lineWidth > 0 && this.lineAlpha > 0 || this.fillGradient != null) {
			if(!this.isEmpty) {
				this.isSvg = true;
			}
			this.isEmpty = false;
		}
		var newGraphics = PIXI.Graphics.prototype.endFill.call(this);
		var _g = 0;
		var _g1 = this.graphicsData;
		while(_g < _g1.length) {
			var data = _g1[_g];
			++_g;
			if(data.lineWidth != null && this.lineWidth == 0) {
				data.lineWidth = null;
			}
		}
		this.calculateGraphicsBounds();
		if(this.strokeGradient != null && ((RenderSupport.RendererType == "html" || this.isHTML) && !this.isCanvas)) {
			data.gradient = this.strokeGradient;
			data.strokeGradient = this.strokeGradient.type == "radial" ? "radial-gradient(" : "linear-gradient(" + Std.string(this.strokeGradient.matrix.rotation + 90.0) + "deg, ";
			var _g = 0;
			var _g1 = this.strokeGradient.colors.length;
			while(_g < _g1) {
				var i = _g++;
				var fh = data;
				var fh1 = fh.strokeGradient;
				var tmp = Std.string(RenderSupport.makeCSSColor(this.strokeGradient.colors[i],this.strokeGradient.alphas[i])) + " ";
				var f = this.strokeGradient.offsets[i];
				fh.strokeGradient = fh1 + (tmp + (f < 0.0 ? 0.0 : f > 1.0 ? 1.0 : f) * (this.strokeGradient.type == "radial" ? 70.0 : 100.0) + "%" + (i != this.strokeGradient.colors.length - 1 ? ", " : ""));
			}
			data.strokeGradient += ")";
		}
		if(this.fillGradient != null) {
			if((RenderSupport.RendererType == "html" || this.isHTML) && !this.isCanvas) {
				data.gradient = this.fillGradient;
				data.fillGradient = this.fillGradient.type == "radial" ? "radial-gradient(" : "linear-gradient(" + Std.string(this.fillGradient.matrix.rotation + 90.0) + "deg, ";
				var _g = 0;
				var _g1 = this.fillGradient.colors.length;
				while(_g < _g1) {
					var i = _g++;
					var fh = data;
					var fh1 = fh.fillGradient;
					var tmp = Std.string(RenderSupport.makeCSSColor(this.fillGradient.colors[i],this.fillGradient.alphas[i])) + " ";
					var f = this.fillGradient.offsets[i];
					fh.fillGradient = fh1 + (tmp + (f < 0.0 ? 0.0 : f > 1.0 ? 1.0 : f) * (this.fillGradient.type == "radial" ? 70.0 : 100.0) + "%" + (i != this.fillGradient.colors.length - 1 ? ", " : ""));
				}
				data.fillGradient += ")";
			} else {
				var canvas = window.document.createElement("canvas");
				canvas.width = Math.ceil(this.graphicsBounds.maxX);
				canvas.height = Math.ceil(this.graphicsBounds.maxY);
				var ctx = canvas.getContext("2d",null);
				var matrix = this.fillGradient.matrix;
				var gradient = this.fillGradient.type == "radial" ? ctx.createRadialGradient(matrix.xOffset + matrix.width / 2.0,matrix.yOffset + matrix.height / 2.0,0.0,matrix.xOffset + matrix.width / 2.0,matrix.yOffset + matrix.height / 2.0,Math.max(matrix.width / 2.0,matrix.height / 2.0)) : ctx.createLinearGradient(matrix.xOffset + (matrix.width / 2.0 - Math.sin((matrix.rotation + 90.0) * 0.0174532925) * matrix.width / 2.0),matrix.yOffset + (matrix.height / 2.0 + Math.cos((matrix.rotation + 90.0) * 0.0174532925) * matrix.height / 2.0),matrix.xOffset + (matrix.width / 2.0 - Math.sin((matrix.rotation + 90.0) * 0.0174532925 - Math.PI) * matrix.width / 2.0),matrix.yOffset + (matrix.height / 2.0 + Math.cos((matrix.rotation + 90.0) * 0.0174532925 - Math.PI) * matrix.height / 2.0));
				var _g = 0;
				var _g1 = this.fillGradient.colors.length;
				while(_g < _g1) {
					var i = _g++;
					var f = this.fillGradient.offsets[i];
					gradient.addColorStop(f < 0.0 ? 0.0 : f > 1.0 ? 1.0 : f,RenderSupport.makeCSSColor(this.fillGradient.colors[i],this.fillGradient.alphas[i]));
				}
				ctx.fillStyle = gradient;
				ctx.fillRect(0.0,0.0,canvas.width,canvas.height);
				var sprite = new PIXI.Sprite(PIXI.Texture.fromCanvas(canvas));
				var mask = new FlowGraphics();
				var _this = this.graphicsData;
				var result = new Array(_this.length);
				var _g = 0;
				var _g1 = _this.length;
				while(_g < _g1) {
					var i = _g++;
					result[i] = _this[i].clone();
				}
				mask.graphicsData = result;
				sprite.mask = mask;
				sprite._visible = true;
				sprite.clipVisible = true;
				var _g = 0;
				var _g1 = this.graphicsData;
				while(_g < _g1.length) {
					var gd = _g1[_g];
					++_g;
					gd.fillAlpha = 0.0;
				}
				this.addChild(sprite.mask);
				this.addChild(sprite);
				DisplayObjectHelper.invalidateTransform(sprite,"endFill Gradient");
			}
		}
		this.graphicsChanged = true;
		DisplayObjectHelper.invalidateTransform(this,"endFill");
		if(this.isMask || this.isCanvas) {
			if(this.isNativeWidget) {
				DisplayObjectHelper.deleteNativeWidget(this);
			}
		} else if(!this.isEmpty) {
			DisplayObjectHelper.initNativeWidget(this);
		}
		return newGraphics;
	}
	,drawRect: function(x,y,width,height) {
		if(width < 0) {
			x += width;
			width = Math.abs(width);
		}
		if(height < 0) {
			y += height;
			height = Math.abs(height);
		}
		if(width > 0 && height > 0) {
			var newGraphics = PIXI.Graphics.prototype.drawRect.call(this,x,y,width,height);
			this.endFill();
			return newGraphics;
		} else {
			return this;
		}
	}
	,drawRoundedRect: function(x,y,width,height,radius) {
		if(width < 0) {
			x += width;
			width = Math.abs(width);
		}
		if(height < 0) {
			y += height;
			height = Math.abs(height);
		}
		if(width > 0 && height > 0) {
			radius = Math.abs(Math.min(radius,Math.min(width / 2.0,height / 2.0)));
			if(radius > 0) {
				var newGraphics = PIXI.Graphics.prototype.drawRoundedRect.call(this,x,y,width,height,radius);
				this.endFill();
				return newGraphics;
			} else {
				return this.drawRect(x,y,width,height);
			}
		} else {
			return this;
		}
	}
	,drawEllipse: function(x,y,width,height) {
		width = Math.abs(width);
		height = Math.abs(height);
		if(width > 0 && height > 0) {
			var newGraphics = PIXI.Graphics.prototype.drawEllipse.call(this,x,y,width,height);
			this.endFill();
			return newGraphics;
		} else {
			return this;
		}
	}
	,drawCircle: function(x,y,radius) {
		radius = Math.abs(radius);
		if(radius > 0) {
			var newGraphics = PIXI.Graphics.prototype.drawCircle.call(this,x,y,radius);
			this.endFill();
			return newGraphics;
		} else {
			return this;
		}
	}
	,getLocalBounds: function(rect) {
		rect = this.localBounds.getRectangle(rect);
		if(this.filterPadding != 0.0) {
			rect.x -= this.filterPadding;
			rect.y -= this.filterPadding;
			rect.width += this.filterPadding * 2.0;
			rect.height += this.filterPadding * 2.0;
		}
		return rect;
	}
	,getBounds: function(skipUpdate,rect) {
		if(!skipUpdate) {
			this.updateTransform();
		}
		this.getLocalBounds();
		this.calculateBounds();
		return this._bounds.getRectangle(rect);
	}
	,calculateBounds: function() {
		this._bounds.minX = this.localBounds.minX * this.worldTransform.a + this.localBounds.minY * this.worldTransform.c + this.worldTransform.tx;
		this._bounds.minY = this.localBounds.minX * this.worldTransform.b + this.localBounds.minY * this.worldTransform.d + this.worldTransform.ty;
		this._bounds.maxX = this.localBounds.maxX * this.worldTransform.a + this.localBounds.maxY * this.worldTransform.c + this.worldTransform.tx;
		this._bounds.maxY = this.localBounds.maxX * this.worldTransform.b + this.localBounds.maxY * this.worldTransform.d + this.worldTransform.ty;
	}
	,calculateGraphicsBounds: function() {
		this.updateLocalBounds();
		var tmp;
		var f = this._localBounds.minX;
		if(isFinite(f)) {
			var f = this._localBounds.minY;
			tmp = isFinite(f);
		} else {
			tmp = false;
		}
		if(tmp) {
			var shouldFixBound = this.lineWidth != null && this.graphicsData != null && this.graphicsData.length > 0 && this.graphicsData[0].lineAlpha == 0;
			this.graphicsBounds.minX = this._localBounds.minX - (shouldFixBound ? this.lineWidth / 2.0 : 0.0);
			this.graphicsBounds.minY = this._localBounds.minY - (shouldFixBound ? this.lineWidth / 2.0 : 0.0);
			this.graphicsBounds.maxX = this._localBounds.maxX + (shouldFixBound ? this.lineWidth / 2.0 : 0.0);
			this.graphicsBounds.maxY = this._localBounds.maxY + (shouldFixBound ? this.lineWidth / 2.0 : 0.0);
		} else {
			this.graphicsBounds.minX = this.pen.x - (this.lineWidth != null ? this.lineWidth / 2.0 : 0.0);
			this.graphicsBounds.minY = this.pen.y - (this.lineWidth != null ? this.lineWidth / 2.0 : 0.0);
			this.graphicsBounds.maxX = this.pen.x + (this.lineWidth != null ? this.lineWidth / 2.0 : 0.0);
			this.graphicsBounds.maxY = this.pen.y + (this.lineWidth != null ? this.lineWidth / 2.0 : 0.0);
		}
		if(this.graphicsBounds.minX > this.graphicsBounds.maxX) {
			var temp = this.graphicsBounds.maxX;
			this.graphicsBounds.maxX = this.graphicsBounds.minX;
			this.graphicsBounds.minX = temp;
		}
		if(this.graphicsBounds.minY > this.graphicsBounds.maxY) {
			var temp = this.graphicsBounds.maxY;
			this.graphicsBounds.maxY = this.graphicsBounds.minY;
			this.graphicsBounds.minY = temp;
		}
		this.widgetBounds.minX = this.graphicsBounds.minX + (this.lineWidth != null && this.lineWidth > 0 && !this.isSvg ? this.lineWidth < 2.0 ? this.lineWidth + 0.25 : this.lineWidth : 0.0);
		this.widgetBounds.minY = this.graphicsBounds.minY + (this.lineWidth != null && this.lineWidth > 0 && !this.isSvg ? this.lineWidth < 2.0 ? this.lineWidth + 0.25 : this.lineWidth : 0.0);
		this.widgetBounds.maxX = this.graphicsBounds.maxX - (this.lineWidth != null && this.lineWidth > 0 && !this.isSvg ? this.lineWidth < 2.0 ? this.lineWidth + 0.25 : this.lineWidth : 0.0);
		this.widgetBounds.maxY = this.graphicsBounds.maxY - (this.lineWidth != null && this.lineWidth > 0 && !this.isSvg ? this.lineWidth < 2.0 ? this.lineWidth + 0.25 : this.lineWidth : 0.0);
		if(this.isSvg) {
			this.widgetBounds.maxX = Math.max(this.widgetBounds.minX + 4.0,this.widgetBounds.maxX);
			this.widgetBounds.maxY = Math.max(this.widgetBounds.minY + 4.0,this.widgetBounds.maxY);
		}
	}
	,clear: function() {
		if(this.graphicsData != []) {
			this.pen = new PIXI.Point();
			this.localBounds = new PIXI.Bounds();
			this.graphicsBounds = new PIXI.Bounds();
			this.widgetBounds = new PIXI.Bounds();
			var newGraphics = PIXI.Graphics.prototype.clear.call(this);
			this.fillAlpha = null;
			this.isEmpty = true;
			this.isSvg = false;
			if(this.parent != null) {
				DisplayObjectHelper.invalidateStage(this);
			}
			return newGraphics;
		} else {
			return this;
		}
	}
	,updateNativeWidgetGraphicsData: function() {
		var _gthis = this;
		if(this.isMask || this.isCanvas || this.isEmpty) {
			if(this.isNativeWidget) {
				DisplayObjectHelper.deleteNativeWidget(this);
			}
			return;
		}
		DisplayObjectHelper.initNativeWidget(this);
		if(!this.graphicsChanged) {
			return;
		}
		if(this.nativeWidget != null) {
			if(this.graphicsData.length == 0) {
				while(this.nativeWidget.lastElementChild != null) this.nativeWidget.removeChild(this.nativeWidget.lastElementChild);
				this.nativeWidget.style.background = null;
				this.nativeWidget.style.border = null;
				this.nativeWidget.style.borderRadius = null;
				this.nativeWidget.style.borderImage = null;
			} else if(this.graphicsData.length != 1 || this.isSvg || this.hasMask) {
				this.nativeWidget.style.borderRadius = null;
				if(Platform.isIE) {
					this.nativeWidget.style.background = "";
				} else {
					this.nativeWidget.style.background = null;
				}
				var parent = this.nativeWidget;
				var el = parent.getElementsByTagName("svg");
				var svg;
				if(el.length > 0) {
					svg = el[0];
				} else {
					var element = window.document.createElementNS("http://www.w3.org/2000/svg","svg");
					parent.appendChild(element);
					svg = element;
				}
				svg.style.position = "absolute";
				svg.style.left = "0";
				svg.style.top = "0";
				if(this.graphicsData.length == 1) {
					var _g = 0;
					var _g1 = svg.childNodes;
					while(_g < _g1.length) {
						var child = _g1[_g];
						++_g;
						if(child.tagName != null && child.tagName.toLowerCase() == "g") {
							svg.removeChild(child);
						}
					}
				} else {
					while(svg.lastElementChild != null && svg.lastElementChild.tagName.toLowerCase() != "g" && svg.lastElementChild.tagName.toLowerCase() != "defs") svg.removeChild(svg.lastElementChild);
					var el = svg.getElementsByTagName("g");
					if(el.length > 0) {
						svg = el[0];
					} else {
						var element = window.document.createElementNS("http://www.w3.org/2000/svg","g");
						svg.appendChild(element);
						svg = element;
					}
					while(svg.lastElementChild != null) svg.removeChild(svg.lastElementChild);
				}
				var _g = 0;
				var _g1 = this.graphicsData;
				while(_g < _g1.length) {
					var data = [_g1[_g]];
					++_g;
					var element = [null];
					if(data[0].fillGradient != null || data[0].strokeGradient != null) {
						var gradient = data[0].gradient;
						var el = svg.getElementsByTagName("defs");
						var defs;
						if(el.length > 0) {
							defs = el[0];
						} else {
							var element1 = window.document.createElementNS("http://www.w3.org/2000/svg","defs");
							svg.appendChild(element1);
							defs = element1;
						}
						var tagName = gradient.type == "radial" ? "radialGradient" : "linearGradient";
						var el1 = defs.getElementsByTagName(tagName);
						var linearGradient;
						if(el1.length > 0) {
							linearGradient = el1[0];
						} else {
							var element2 = window.document.createElementNS("http://www.w3.org/2000/svg",tagName);
							defs.appendChild(element2);
							linearGradient = element2;
						}
						if(gradient.type == "radial") {
							var _g2 = 0;
							var _g3 = defs.getElementsByTagName("linearGradient");
							while(_g2 < _g3.length) {
								var child = _g3[_g2];
								++_g2;
								svg.removeChild(child);
							}
						} else {
							var _g4 = 0;
							var _g5 = defs.getElementsByTagName("radialGradient");
							while(_g4 < _g5.length) {
								var child1 = _g5[_g4];
								++_g4;
								svg.removeChild(child1);
							}
						}
						linearGradient.setAttribute("id",this.nativeWidget.getAttribute("id") + "gradient");
						linearGradient.setAttribute("x1","" + (50.0 - Math.sin((gradient.matrix.rotation + 90.0) * 0.0174532925) * 50.0) + "%");
						linearGradient.setAttribute("y1","" + (50.0 + Math.cos((gradient.matrix.rotation + 90.0) * 0.0174532925) * 50.0) + "%");
						linearGradient.setAttribute("x2","" + (50.0 - Math.sin((gradient.matrix.rotation + 90.0) * 0.0174532925 - Math.PI) * 50.0) + "%");
						linearGradient.setAttribute("y2","" + (50.0 + Math.cos((gradient.matrix.rotation + 90.0) * 0.0174532925 - Math.PI) * 50.0) + "%");
						while(linearGradient.lastElementChild != null) linearGradient.removeChild(linearGradient.lastElementChild);
						var _g6 = 0;
						var _g7 = gradient.colors.length;
						while(_g6 < _g7) {
							var i = _g6++;
							var stop = window.document.createElementNS("http://www.w3.org/2000/svg","stop");
							var f = gradient.offsets[i];
							stop.setAttribute("offset","" + (f < 0.0 ? 0.0 : f > 1.0 ? 1.0 : f) * 100.0 + "%");
							stop.setAttribute("style","stop-color:" + Std.string(RenderSupport.makeCSSColor(gradient.colors[i],gradient.alphas[i])));
							linearGradient.appendChild(stop);
						}
					}
					var createSvgElement = (function(element,data) {
						return function(tagName) {
							if(_gthis.graphicsData.length == 1) {
								while(svg.lastElementChild != null && svg.lastElementChild.tagName.toLowerCase() != tagName && svg.lastElementChild.tagName.toLowerCase() != "defs") svg.removeChild(svg.lastElementChild);
								var element1 = element;
								var el = svg.getElementsByTagName(tagName);
								var createSvgElement;
								if(el.length > 0) {
									createSvgElement = el[0];
								} else {
									var element2 = window.document.createElementNS("http://www.w3.org/2000/svg",tagName);
									svg.appendChild(element2);
									createSvgElement = element2;
								}
								element1[0] = createSvgElement;
							} else {
								element[0] = window.document.createElementNS("http://www.w3.org/2000/svg",tagName);
								svg.appendChild(element[0]);
							}
							if(data[0].fillGradient != null) {
								element[0].setAttribute("fill","url(#" + _gthis.nativeWidget.getAttribute("id") + "gradient)");
							} else if(data[0].fill != null && data[0].fillAlpha > 0) {
								element[0].setAttribute("fill",RenderSupport.makeCSSColor(data[0].fillColor,data[0].fillAlpha));
							} else {
								element[0].setAttribute("fill","none");
							}
							if(data[0].strokeGradient != null) {
								element[0].setAttribute("stroke","url(#" + _gthis.nativeWidget.getAttribute("id") + "gradient)");
								element[0].setAttribute("stroke-width",data[0].lineWidth == null ? "null" : "" + data[0].lineWidth);
							} else if(data[0].lineWidth != null && data[0].lineWidth > 0 && data[0].lineAlpha > 0) {
								element[0].setAttribute("stroke",RenderSupport.makeCSSColor(data[0].lineColor,data[0].lineAlpha));
								element[0].setAttribute("stroke-width",data[0].lineWidth == null ? "null" : "" + data[0].lineWidth);
							} else {
								element[0].setAttribute("stroke","none");
								element[0].removeAttribute("stroke-width");
							}
						};
					})(element,data);
					if(data[0].shape.type == 0) {
						createSvgElement("path");
						var d = data[0].shape.points.map(function(p, i) {
							return i % 2 == 0 ? (i == 0 ? 'M' : 'L') + p + ' ' : '' + p + ' ';
						}).join('');
						if(data[0].shape.points.length > 2 && data[0].shape.points[0] == data[0].shape.points[data[0].shape.points.length - 2] && data[0].shape.points[1] == data[0].shape.points[data[0].shape.points.length - 1]) {
							d += " Z";
						}
						element[0].setAttribute("d",d);
					} else if(data[0].shape.type == 1) {
						createSvgElement("rect");
						element[0].setAttribute("x",Std.string(data[0].shape.x));
						element[0].setAttribute("y",Std.string(data[0].shape.y));
						element[0].setAttribute("width",Std.string(data[0].shape.width));
						element[0].setAttribute("height",Std.string(data[0].shape.height));
						element[0].removeAttribute("rx");
						element[0].removeAttribute("ry");
					} else if(data[0].shape.type == 2) {
						createSvgElement("circle");
						element[0].setAttribute("cx",Std.string(data[0].shape.x));
						element[0].setAttribute("cy",Std.string(data[0].shape.y));
						element[0].setAttribute("r",Std.string(data[0].shape.radius));
					} else if(data[0].shape.type == 4) {
						createSvgElement("rect");
						element[0].setAttribute("x",Std.string(data[0].shape.x));
						element[0].setAttribute("y",Std.string(data[0].shape.y));
						element[0].setAttribute("width",Std.string(data[0].shape.width));
						element[0].setAttribute("height",Std.string(data[0].shape.height));
						element[0].setAttribute("rx",Std.string(data[0].shape.radius));
						element[0].setAttribute("ry",Std.string(data[0].shape.radius));
					} else {
						haxe_Log.trace("updateNativeWidgetGraphicsData: Unknown shape type",{ fileName : "FlowGraphics.hx", lineNumber : 566, className : "FlowGraphics", methodName : "updateNativeWidgetGraphicsData"});
						haxe_Log.trace(data[0],{ fileName : "FlowGraphics.hx", lineNumber : 567, className : "FlowGraphics", methodName : "updateNativeWidgetGraphicsData"});
					}
				}
			} else {
				while(this.nativeWidget.lastElementChild != null) this.nativeWidget.removeChild(this.nativeWidget.lastElementChild);
				var data1 = this.graphicsData[0];
				if(data1.fillAlpha > 0 || data1.lineAlpha > 0) {
					if(data1.lineWidth != null && data1.lineWidth > 0 && data1.lineAlpha > 0) {
						var tmp = "" + data1.lineWidth + "px solid ";
						var tmp1 = data1.strokeGradient != null ? "" : RenderSupport.makeCSSColor(data1.lineColor,data1.lineAlpha);
						this.nativeWidget.style.border = tmp + tmp1;
					} else {
						this.nativeWidget.style.border = null;
					}
					if(data1.fill != null && data1.fillAlpha > 0) {
						var bounds = this.widgetBounds;
						var f = bounds.minX;
						if((isFinite(f) ? bounds.maxX - bounds.minX : -1) <= 2.0) {
							this.nativeWidget.style.border = null;
							var bounds = this.widgetBounds;
							var f = bounds.minX;
							var tmp = isFinite(f) ? bounds.maxX - bounds.minX : -1;
							var tmp1 = Std.string(RenderSupport.makeCSSColor(data1.fillColor,data1.fillAlpha));
							this.nativeWidget.style.borderLeft = "" + tmp + "px solid " + tmp1;
							this.nativeWidget.style.background = null;
						} else {
							var bounds = this.widgetBounds;
							var f = bounds.minY;
							if((isFinite(f) ? bounds.maxY - bounds.minY : -1) <= 2.0) {
								this.nativeWidget.style.border = null;
								var bounds = this.widgetBounds;
								var f = bounds.minY;
								var tmp = isFinite(f) ? bounds.maxY - bounds.minY : -1;
								var tmp1 = Std.string(RenderSupport.makeCSSColor(data1.fillColor,data1.fillAlpha));
								this.nativeWidget.style.borderTop = "" + tmp + "px solid " + tmp1;
								this.nativeWidget.style.background = null;
							} else {
								this.nativeWidget.style.background = RenderSupport.makeCSSColor(data1.fillColor,data1.fillAlpha);
							}
						}
					} else {
						this.nativeWidget.style.background = null;
					}
					if(data1.fillGradient != null) {
						this.nativeWidget.style.background = data1.fillGradient;
					} else if(data1.strokeGradient != null) {
						haxe_Log.trace(data1.strokeGradient,{ fileName : "FlowGraphics.hx", lineNumber : 603, className : "FlowGraphics", methodName : "updateNativeWidgetGraphicsData"});
						this.nativeWidget.style.borderImage = data1.strokeGradient;
					}
					var lineWidth = data1.lineWidth != null && data1.lineAlpha > 0 ? data1.lineWidth : 0.0;
					if(data1.shape.type == 1) {
						this.left = data1.shape.x - lineWidth / 2.0;
						this.top = data1.shape.y - lineWidth / 2.0;
						this.nativeWidget.style.borderRadius = null;
					} else if(data1.shape.type == 2) {
						var n = data1.shape.radius;
						this.left = data1.shape.x - (RenderSupport.RoundPixels ? Math.round(n) : Math.round(n * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio)) - lineWidth / 2.0;
						var n = data1.shape.radius;
						this.top = data1.shape.y - (RenderSupport.RoundPixels ? Math.round(n) : Math.round(n * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio)) - lineWidth / 2.0;
						var n = data1.shape.radius + lineWidth;
						this.nativeWidget.style.borderRadius = "" + (RenderSupport.RoundPixels ? Math.round(n) : Math.round(n * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio)) + "px";
					} else if(data1.shape.type == 3) {
						var n = data1.shape.width - lineWidth;
						this.left = data1.shape.x - (RenderSupport.RoundPixels ? Math.round(n) : Math.round(n * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio)) - lineWidth / 2.0;
						var n = data1.shape.height - lineWidth;
						this.top = data1.shape.y - (RenderSupport.RoundPixels ? Math.round(n) : Math.round(n * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio)) - lineWidth / 2.0;
						var n = data1.shape.width + lineWidth;
						var n1 = data1.shape.height + lineWidth;
						this.nativeWidget.style.borderRadius = "" + (RenderSupport.RoundPixels ? Math.round(n) : Math.round(n * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio)) + "px /\n\t\t\t\t\t\t\t" + (RenderSupport.RoundPixels ? Math.round(n1) : Math.round(n1 * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio)) + "px";
					} else if(data1.shape.type == 4) {
						this.left = data1.shape.x - lineWidth / 2.0;
						this.top = data1.shape.y - lineWidth / 2.0;
						var n = data1.shape.radius;
						this.nativeWidget.style.borderRadius = "" + (RenderSupport.RoundPixels ? Math.round(n) : Math.round(n * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio)) + "px";
					} else {
						haxe_Log.trace("updateNativeWidgetGraphicsData: Unknown shape type",{ fileName : "FlowGraphics.hx", lineNumber : 630, className : "FlowGraphics", methodName : "updateNativeWidgetGraphicsData"});
						haxe_Log.trace(data1,{ fileName : "FlowGraphics.hx", lineNumber : 631, className : "FlowGraphics", methodName : "updateNativeWidgetGraphicsData"});
					}
				}
			}
			this.graphicsChanged = false;
		}
	}
	,createNativeWidget: function(tagName) {
		if(tagName == null) {
			tagName = "div";
		}
		if(!this.isNativeWidget) {
			return;
		}
		DisplayObjectHelper.deleteNativeWidget(this);
		var tmp = this.tagName != null && this.tagName != "" ? this.tagName : tagName;
		this.nativeWidget = window.document.createElement(tmp);
		DisplayObjectHelper.updateClipID(this);
		this.nativeWidget.className = "nativeWidget";
		if(this.className != null && this.className != "") {
			this.nativeWidget.classList.add(this.className);
		}
		this.nativeWidget.setAttribute("role","presentation");
		this.isNativeWidget = true;
	}
	,__class__: FlowGraphics
});
var haxe_IMap = function() { };
haxe_IMap.__name__ = true;
haxe_IMap.__isInterface__ = true;
var haxe_ds_IntMap = function() {
	this.h = { };
};
haxe_ds_IntMap.__name__ = true;
haxe_ds_IntMap.__interfaces__ = [haxe_IMap];
haxe_ds_IntMap.prototype = {
	remove: function(key) {
		if(!this.h.hasOwnProperty(key)) {
			return false;
		}
		delete(this.h[key]);
		return true;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) if(this.h.hasOwnProperty(key)) a.push(+key);
		return new haxe_iterators_ArrayIterator(a);
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref[i];
		}};
	}
	,__class__: haxe_ds_IntMap
};
var haxe_ds_StringMap = function() {
	this.h = Object.create(null);
};
haxe_ds_StringMap.__name__ = true;
haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
haxe_ds_StringMap.prototype = {
	iterator: function() {
		return new haxe_ds__$StringMap_StringMapValueIterator(this.h);
	}
	,__class__: haxe_ds_StringMap
};
var js_BinaryParser = function(bigEndian,allowExceptions) {
	this.bigEndian = bigEndian;
	this.allowExceptions = allowExceptions;
};
js_BinaryParser.__name__ = true;
js_BinaryParser.prototype = {
	encodeFloat: function(number,precisionBits,exponentBits) {
		
			var bias = Math.pow(2, exponentBits - 1) - 1, minExp = -bias + 1, maxExp = bias, minUnnormExp = minExp - precisionBits,
			status = isNaN(n = parseFloat(number)) || n == -Infinity || n == +Infinity ? n : 0,
			exp = 0, len = 2 * bias + 1 + precisionBits + 3, bin = new Array(len),
			signal = (n = status !== 0 ? 0 : n) < 0, n = Math.abs(n), intPart = Math.floor(n), floatPart = n - intPart,
			i, lastBit, rounded, j, result;
			for(i = len; i; bin[--i] = 0);
			for(i = bias + 2; intPart && i; bin[--i] = intPart % 2, intPart = Math.floor(intPart / 2));
			for(i = bias + 1; floatPart > 0 && i; (bin[++i] = ((floatPart *= 2) >= 1) - 0) && --floatPart);
			for(i = -1; ++i < len && !bin[i];);
			if(bin[(lastBit = precisionBits - 1 + (i = (exp = bias + 1 - i) >= minExp && exp <= maxExp ? i + 1 : bias + 1 - (exp = minExp - 1))) + 1]){
			    if(!(rounded = bin[lastBit]))
				for(j = lastBit + 2; !rounded && j < len; rounded = bin[j++]);
			    for(j = lastBit + 1; rounded && --j >= 0; (bin[j] = !bin[j] - 0) && (rounded = 0));
			}
			for(i = i - 2 < 0 ? -1 : i - 3; ++i < len && !bin[i];);

			(exp = bias + 1 - i) >= minExp && exp <= maxExp ? ++i : exp < minExp &&
			    (exp != bias + 1 - len && exp < minUnnormExp && this.warn("encodeFloat::float underflow"), i = bias + 1 - (exp = minExp - 1));
			(intPart || status !== 0) && (this.warn(intPart ? "encodeFloat::float overflow" : "encodeFloat::" + status),
			    exp = maxExp + 1, i = bias + 2, status == -Infinity ? signal = 1 : isNaN(status) && (bin[i] = 1));
			for(n = Math.abs(exp + bias), j = exponentBits + 1, result = ""; --j; result = (n % 2) + result, n = n >>= 1);
			for(var n = 0, j = 0, i = (result = (signal ? "1" : "0") + result + bin.slice(i, i + precisionBits).join("")).length, r = [];
			    i; n += (1 << j) * result.charAt(--i), j == 7 && (r[r.length] = String.fromCharCode(n), n = 0), j = (j + 1) % 8);
			r[r.length] = n ? String.fromCharCode(n) : "";
			return (this.bigEndian ? r.reverse() : r).join("");
		;
		return "";
	}
	,decodeFloat: function(data,precisionBits,exponentBits) {
		
			var b = (((typeof js !== 'undefined' && js) ?
                                (b = new js.BinaryBuffer(this.bigEndian, data)) :
                                (b = new js_BinaryBuffer(this.bigEndian, data))).checkBuffer(precisionBits + exponentBits + 1), b),
			    bias = Math.pow(2, exponentBits - 1) - 1, signal = b.readBits(precisionBits + exponentBits, 1),
			    exponent = b.readBits(precisionBits, exponentBits), significand = 0,
			    divisor = 2, curByte = b.buffer.length + (-precisionBits >> 3) - 1,
			    byteValue, startBit, mask;
			do
			    for(byteValue = b.buffer[ ++curByte ], startBit = precisionBits % 8 || 8, mask = 1 << startBit;
				mask >>= 1; (byteValue & mask) && (significand += 1 / divisor), divisor *= 2);
			while(precisionBits -= startBit);
			return exponent == (bias << 1) + 1 ? significand ? NaN : signal ? -Infinity : +Infinity
			    : (1 + signal * -2) * (exponent || significand ? !exponent ? Math.pow(2, -bias + 1) * significand
			    : Math.pow(2, exponent - bias) * (1 + significand) : 0);
		;
		return 0.0;
	}
	,warn: function(msg) {
		if(this.allowExceptions) {
			throw new Error(msg);
		}
		return 1;
	}
	,toDouble: function(data) {
		return this.decodeFloat(data,52,11);
	}
	,fromDouble: function(number) {
		return this.encodeFloat(number,52,11);
	}
	,__class__: js_BinaryParser
};
var StringBuf = function() {
	this.b = "";
};
StringBuf.__name__ = true;
StringBuf.prototype = {
	__class__: StringBuf
};
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10 ? "0" + m : "" + m) + "-" + (d < 10 ? "0" + d : "" + d) + " " + (h < 10 ? "0" + h : "" + h) + ":" + (mi < 10 ? "0" + mi : "" + mi) + ":" + (s < 10 ? "0" + s : "" + s);
};
HxOverrides.strDate = function(s) {
	switch(s.length) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d["setTime"](0);
		d["setUTCHours"](k[0]);
		d["setUTCMinutes"](k[1]);
		d["setUTCSeconds"](k[2]);
		return d;
	case 10:
		var k = s.split("-");
		return new Date(k[0],k[1] - 1,k[2],0,0,0);
	case 19:
		var k = s.split(" ");
		var y = k[0].split("-");
		var t = k[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw haxe_Exception.thrown("Invalid date format : " + s);
	}
};
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) {
		return undefined;
	}
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(len == null) {
		len = s.length;
	} else if(len < 0) {
		if(pos == 0) {
			len = s.length + len;
		} else {
			return "";
		}
	}
	return s.substr(pos,len);
};
HxOverrides.remove = function(a,obj) {
	var i = a.indexOf(obj);
	if(i == -1) {
		return false;
	}
	a.splice(i,1);
	return true;
};
HxOverrides.now = function() {
	return Date.now();
};
var Native = function() { };
Native.__name__ = true;
Native.println = function(arg) {
	var keepStringEscapes = true;
	if(keepStringEscapes == null) {
		keepStringEscapes = false;
	}
	var s = HaxeRuntime.toString(arg,keepStringEscapes);
	console.log(s);
	return null;
};
Native.debugStopExecution = function() {
	debugger;
};
Native.genericCompare = function(a,b) {
	return HaxeRuntime.compareByValue(a,b);
};
Native.hostCall = function(name,args) {
	var result = null;
	try {
		var name_parts = name.split(".");
		var fun = window;
		var fun_nested_object = fun;
		var _g = 0;
		var _g1 = name_parts.length;
		while(_g < _g1) {
			var i = _g++;
			fun_nested_object = fun;
			fun = fun[name_parts[i]];
		}
		result = fun.call(fun_nested_object,args[0],args[1],args[2],args[3],args[4]);
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		var e = haxe_Exception.caught(_g).unwrap();
		Errors.report(e);
	}
	return result;
};
Native.importJSModule = function(arg,cb) {
	try {
		var module = arg + encodeURI('\nconst importJSModuleVersion =' + Math.random());
		eval("import(module).then((v) => { return v && v.default ? v.default : v; }).then((v) => { cb(v); }).catch((e) => { Errors.report(e); cb(null); })");
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		var e = haxe_Exception.caught(_g).unwrap();
		Errors.report(e);
		cb(null);
	}
};
Native.hostAddCallback = function(name,cb) {
	window[name] = cb;
	return null;
};
Native.createInvisibleTextArea = function() {
	var textArea = window.document.createElement("textarea");
	textArea.style.cssText = "position:fixed;top:0px;left:0px;width:2em;height:2em;padding:0px;border:none;outline:none;boxShadow:none;background:transparent;";
	window.document.body.appendChild(textArea);
	return textArea;
};
Native.evaluateObjectSize = function(object) {
	var bytes = 0;
	
			var objectList = [];
			var stack = [object];

			while (stack.length) {
				var value = stack.pop();

				if (typeof value === 'boolean') {
					bytes += 4;
				}
				else if ( typeof value === 'string' ) {
					bytes += value.length * 2;
				}
				else if ( typeof value === 'number' ) {
					bytes += 8;
				}
				else if
				(
					typeof value === 'object'
					&& objectList.indexOf( value ) === -1
				)
				{
					objectList.push( value );

					if (Object.prototype.toString.call(value) != '[object Array]'){
					   for(var key in value) bytes += 2 * key.length;
					}

					for( var i in value ) {
						stack.push( value[ i ] );
					}
				}
			}
		;
	return bytes;
};
Native.usedJSHeapSize = function() {
	try {
		return window.performance.memory.usedJSHeapSize;
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		console.log("Warning! performance.memory.usedJSHeapSize is not implemented in this target");
		return 0;
	}
};
Native.totalJSHeapSize = function() {
	try {
		return window.performance.memory.totalJSHeapSize;
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		console.log("Warning! performance.memory.totalJSHeapSize is not implemented in this target");
		return 0;
	}
};
Native.copyAction = function(textArea) {
	try {
		textArea.select();
		var successful = window.document.execCommand("copy");
		if(!successful) {
			Errors.warning("Browser \"copy\" command execution was unsuccessful");
		}
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		Errors.report("Oops, unable to copy");
	}
};
Native.setClipboard = function(text) {
	var focusedElement = window.document.activeElement;
	if(window.clipboardData && window.clipboardData.setData) {
		window.clipboardData.setData("Text",text);
	} else if($global.navigator.clipboard && ($_=$global.navigator.clipboard,$bind($_,$_.writeText))) {
		$global.navigator.clipboard.writeText(text);
	} else {
		var textArea = Native.createInvisibleTextArea();
		textArea.value = text;
		if(text.length < 10000) {
			Native.copyAction(textArea);
			window.document.body.removeChild(textArea);
		} else {
			setTimeout(function() {
				Native.copyAction(textArea);
				window.document.body.removeChild(textArea);
			},0);
		}
	}
	focusedElement.focus();
	Native.clipboardData = text;
};
Native.getClipboard = function() {
	if(window.clipboardData && window.clipboardData.getData) {
		return window.clipboardData.getData("Text");
	}
	if(Native.isNew) {
		return Native.clipboardData;
	}
	var focusedElement = window.document.activeElement;
	var result = Native.clipboardData;
	var textArea = Native.createInvisibleTextArea();
	textArea.value = "";
	textArea.select();
	try {
		
					if (typeof RenderSupport !== 'undefined') {
						RenderSupport.disablePasteEventListener();
					}
				;
		var successful = window.document.execCommand("paste");
		if(successful) {
			result = textArea.value;
		} else {
			Errors.warning("Browser \"paste\" command execution was unsuccessful");
		}
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		Errors.report("Oops, unable to paste");
	}
	
				if (typeof RenderSupport !== 'undefined') {
					RenderSupport.enablePasteEventListener();
				}
			;
	window.document.body.removeChild(textArea);
	
				if (typeof RenderSupport !== 'undefined') {
					RenderSupport.deferUntilRender(function() {
						focusedElement.focus();
					});
				} else {
					focusedElement.focus();
				}
			;
	return result;
};
Native.getClipboardToCB = function(callback) {
	if(window.clipboardData && window.clipboardData.getData) {
		callback(window.clipboardData.getData("Text"));
	} else if(navigator.clipboard && navigator.clipboard.readText) {
		navigator.clipboard.readText().then(callback,function(e) {
			Errors.print(e);
		});
	} else {
		callback(Native.clipboardData);
	}
};
Native.setCurrentDirectory = function(path) {
};
Native.getCurrentDirectory = function() {
	return "";
};
Native.getClipboardFormat = function(mimetype) {
	if(mimetype == "html" || mimetype == "text/html") {
		return Native.clipboardDataHtml;
	} else {
		return "";
	}
};
Native.getApplicationPath = function() {
	return "";
};
Native.toString = function(value,keepStringEscapes) {
	if(keepStringEscapes == null) {
		keepStringEscapes = false;
	}
	return HaxeRuntime.toString(value,keepStringEscapes);
};
Native.toStringForJson = function(value) {
	return HaxeRuntime.toStringForJson(value);
};
Native.gc = function() {
};
Native.addHttpHeader = function(data) {
};
Native.getCgiParameter = function(name) {
	return "";
};
Native.subrange = function(arr,start,len) {
	if(start < 0 || len < 1) {
		return [];
	} else {
		return arr.slice(start,start + len);
	}
};
Native.removeIndex = function(src,index) {
	if(index >= 0 && index < src.length) {
		var this1 = new Array(src.length - 1);
		var dst = this1;
		var i = 0;
		while(i < index) {
			dst[i] = src[i];
			++i;
		}
		while(i < dst.length) {
			dst[i] = src[i + 1];
			++i;
		}
		return dst;
	} else {
		return src;
	}
};
Native.isArray = function(a) {
	return Array.isArray(a);
};
Native.isSameStructType = function(a,b) {
	if(!Array.isArray(a) && !Array.isArray(b) && Object.prototype.hasOwnProperty.call(a,"_id") && Object.prototype.hasOwnProperty.call(b,"_id")) {
		return a._id == b._id;
	} else {
		return false;
	}
};
Native.isSameObj = function(a,b) {
	if(a == b) {
		return true;
	}
	if(a != null && b != null && Object.prototype.hasOwnProperty.call(a,"_id") && a._id == b._id && HaxeRuntime._structargs_.h[a._id].length == 0) {
		return true;
	}
	return false;
};
Native.length__ = function(arr) {
	return arr.length;
};
Native.strlen = function(s) {
	return s.length;
};
Native.strIndexOf = function(str,substr) {
	return str.indexOf(substr,0);
};
Native.strRangeIndexOf = function(str,substr,start,end) {
	if(str == "" || start < 0) {
		return -1;
	}
	var s = start;
	var e = end > str.length || end < 0 ? str.length : end;
	if(substr.length == 0) {
		return 0;
	} else if(substr.length > e - s) {
		return -1;
	}
	if(2 * (e - s) < str.length - s) {
		if(end >= str.length) {
			return str.indexOf(substr,start);
		}
		var rv = HxOverrides.substr(str,start,end - start).indexOf(substr,0);
		if(rv < 0) {
			return rv;
		} else {
			return start + rv;
		}
	} else {
		var pos = str.indexOf(substr,s);
		var finish = pos + substr.length - 1;
		if(pos < 0) {
			return -1;
		} else if(finish < e) {
			return pos;
		} else {
			return -1;
		}
	}
};
Native.substring = function(str,start,end) {
	var s = HxOverrides.substr(str,start,end);
	if(2 * s.length < str.length) {
		return (" " + s).slice(1);
	} else {
		return s;
	}
};
Native.cloneString = function(str) {
	return (" " + str).slice(1);
};
Native.toLowerCase = function(str) {
	return str.toLowerCase();
};
Native.toUpperCase = function(str) {
	return str.toUpperCase();
};
Native.strReplace = function(str,find,replace) {
	return StringTools.replace(str,find,replace);
};
Native.string2utf8 = function(str) {
	var bytes = haxe_io_Bytes.ofString(str);
	var _g = [];
	var _g1 = 0;
	var _g2 = bytes.length;
	while(_g1 < _g2) {
		var i = _g1++;
		_g.push(bytes.b[i]);
	}
	var a = _g;
	return a;
};
Native.s2a = function(str) {
	var arr = [];
	var _g = 0;
	var _g1 = str.length;
	while(_g < _g1) {
		var i = _g++;
		arr.push(HxOverrides.cca(str,i));
	}
	return arr;
};
Native.list2string = function(h) {
	var res = "";
	while(Object.prototype.hasOwnProperty.call(h,"head")) {
		var s = Std.string(h.head);
		res = s + res;
		h = h.tail;
	}
	return res;
};
Native.list2array = function(h) {
	var cnt = 0;
	var p = h;
	while(Object.prototype.hasOwnProperty.call(p,"head")) {
		++cnt;
		p = p.tail;
	}
	if(cnt == 0) {
		return Array(0);
	}
	var result = Array(cnt);
	p = h;
	--cnt;
	while(Object.prototype.hasOwnProperty.call(p,"head")) {
		result[cnt] = p.head;
		--cnt;
		p = p.tail;
	}
	return result;
};
Native.bitXor = function(a,b) {
	return a ^ b;
};
Native.bitAnd = function(a,b) {
	return a & b;
};
Native.bitOr = function(a,b) {
	return a | b;
};
Native.bitUshr = function(a,b) {
	return a >>> b;
};
Native.bitShl = function(a,b) {
	return a << b;
};
Native.bitNot = function(a) {
	return ~a;
};
Native.concat = function(arr1,arr2) {
	return arr1.concat(arr2);
};
Native.replace = function(arr,i,v) {
	if(arr == null) {
		return [];
	} else if(i < 0 || i > arr.length) {
		Native.println("replace: array index is out of bounds: " + HaxeRuntime.toString(i,false) + " of " + HaxeRuntime.toString(arr.length,false));
		Native.println(haxe_CallStack.toString(haxe_CallStack.callStack()));
		return arr;
	} else if(i == arr.length && Native.useConcatForPush) {
		return arr.concat([v]);
	} else {
		var new_arr = arr.slice(0,arr.length);
		new_arr[i] = v;
		return new_arr;
	}
};
Native.map = function(values,clos) {
	var n = values.length;
	var result = Array(n);
	var _g = 0;
	var _g1 = n;
	while(_g < _g1) {
		var i = _g++;
		result[i] = clos(values[i]);
	}
	return result;
};
Native.iter = function(values,clos) {
	var _g = 0;
	while(_g < values.length) {
		var v = values[_g];
		++_g;
		clos(v);
	}
};
Native.mapi = function(values,clos) {
	var n = values.length;
	var result = Array(n);
	var _g = 0;
	var _g1 = n;
	while(_g < _g1) {
		var i = _g++;
		result[i] = clos(i,values[i]);
	}
	return result;
};
Native.iteri = function(values,clos) {
	var i = 0;
	var _g = 0;
	while(_g < values.length) {
		var v = values[_g];
		++_g;
		clos(i,v);
		++i;
	}
};
Native.iteriUntil = function(values,clos) {
	var i = 0;
	var _g = 0;
	while(_g < values.length) {
		var v = values[_g];
		++_g;
		if(clos(i,v)) {
			return i;
		}
		++i;
	}
	return i;
};
Native.fold = function(values,init,fn) {
	var _g = 0;
	while(_g < values.length) {
		var v = values[_g];
		++_g;
		init = fn(init,v);
	}
	return init;
};
Native.foldi = function(values,init,fn) {
	var i = 0;
	var _g = 0;
	while(_g < values.length) {
		var v = values[_g];
		++_g;
		init = fn(i,init,v);
		++i;
	}
	return init;
};
Native.filter = function(values,clos) {
	var result = [];
	var _g = 0;
	while(_g < values.length) {
		var v = values[_g];
		++_g;
		if(clos(v)) {
			result.push(v);
		}
	}
	return result;
};
Native.filtermapi = function(values,clos) {
	var result = [];
	var n = values.length;
	var _g = 0;
	var _g1 = n;
	while(_g < _g1) {
		var i = _g++;
		var v = values[i];
		var maybe = clos(i,v);
		var fields = Reflect.fields(maybe);
		if(fields.length == 2) {
			var _g2 = 0;
			while(_g2 < fields.length) {
				var f = fields[_g2];
				++_g2;
				if(f != "_id") {
					var val = Reflect.field(maybe,f);
					result.push(val);
				}
			}
		}
	}
	return result;
};
Native.mapiM = function(values,clos) {
	var result = [];
	var n = values.length;
	var _g = 0;
	var _g1 = n;
	while(_g < _g1) {
		var i = _g++;
		var v = values[i];
		var maybe = clos(i,v);
		var fields = Reflect.fields(maybe);
		if(fields.length == 2) {
			var _g2 = 0;
			while(_g2 < fields.length) {
				var f = fields[_g2];
				++_g2;
				if(f != "_id") {
					var val = Reflect.field(maybe,f);
					result.push(val);
				}
			}
		} else {
			return maybe;
		}
	}
	return HaxeRuntime.makeStructValue("Some",[result],HaxeRuntime.makeStructValue("IllegalStruct",[],null));
};
Native.random = function() {
	return Math.random();
};
Native.deleteNative = function(clip) {
	if(clip != null && !clip.destroyed) {
		if(clip.destroy != null) {
			clip.destroy({ children : true, texture : true, baseTexture : true});
		}
		if(clip.parent != null && clip.parent.removeChild != null) {
			clip.parent.removeChild(clip);
		}
		if(!Platform.isIE && clip.nativeWidget != null) {
			clip.nativeWidget.style.display = "none";
		}
		
				if (typeof RenderSupport !== 'undefined' && (clip.nativeWidget != null || clip.accessWidget != null)) {
					RenderSupport.once('drawframe', function() {
						DisplayObjectHelper.deleteNativeWidget(clip);
					});
				}
			;
		clip.destroyed = true;
	}
};
Native.timestamp = function() {
	return NativeTime.timestamp();
};
Native.getLocalTimezoneId = function() {
	return new Intl.DateTimeFormat().resolvedOptions().timeZone;
};
Native.getTimezoneTimeString = function(utcStamp,timezoneId,language) {
	var date = new Date(utcStamp);
	var tzName = "short";
	if(timezoneId == "") {
		timezoneId = "UTC";
	}
	var tz = timezoneId;
	return date.toLocaleString(language,{ timeZone : tz, timeZoneName : tzName});
};
Native.getTimezoneOffset = function(utcStamp,timezoneId) {
	if(timezoneId == "") {
		return 0;
	}
	var tz = timezoneId;
	var stamp;
	try {
		var timeString = new Date(utcStamp).toLocaleString("en-us",{ timeZone : tz});
		stamp = new Date(timeString).getTime();
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		return 0;
	}
	var localOffset = new Date().getTimezoneOffset();
	return Math.round(Math.round((stamp - utcStamp) / 600) / 100 - localOffset) * 60 * 1000;
};
Native.getCurrentDate = function() {
	var date = new Date();
	return HaxeRuntime.makeStructValue("Date",[date.getFullYear(),date.getMonth() + 1,date.getDate()],HaxeRuntime.makeStructValue("IllegalStruct",[],null));
};
Native.defer = function(cb) {
	var fn = function() {
		var t0 = NativeTime.timestamp();
		while(NativeTime.timestamp() - t0 < Native.deferTolerance && Native.DeferQueue.length > 0) {
			var f = Native.DeferQueue.shift();
			f();
		}
		if(Native.DeferQueue.length > 0) {
			setTimeout(fn, 42);
		} else {
			Native.deferActive = false;
		}
	};
	if(Native.deferActive) {
		Native.DeferQueue.push(cb);
	} else {
		Native.deferActive = true;
		Native.DeferQueue.push(cb);
		setTimeout(fn, 0);
	}
};
Native.setInterval = function(ms,cb) {
	var fn = function() {
		try {
			cb();
		} catch( _g ) {
			haxe_NativeStackTrace.lastError = _g;
			var e = haxe_Exception.caught(_g).unwrap();
			var stackAsString = "n/a";
			var actualStack = Assert.callStackToString(haxe_CallStack.callStack());
			var crashInfo = Std.string(e) + "\nStack at timer creation:\n" + stackAsString + "\nStack:\n" + actualStack;
			Native.println("FATAL ERROR: timer callback: " + crashInfo);
			Assert.printStack(e);
			Native.callFlowCrashHandlers("[Timer Handler]: " + crashInfo);
		}
	};
	var t = setInterval(fn, ms);
	return function() {
		clearInterval(t);
	};
};
Native.interruptibleTimer = function(ms,cb) {
	var fn = function() {
		try {
			cb();
		} catch( _g ) {
			haxe_NativeStackTrace.lastError = _g;
			var e = haxe_Exception.caught(_g).unwrap();
			var stackAsString = "n/a";
			var actualStack = Assert.callStackToString(haxe_CallStack.callStack());
			var crashInfo = Std.string(e) + "\nStack at timer creation:\n" + stackAsString + "\nStack:\n" + actualStack;
			Native.println("FATAL ERROR: timer callback: " + crashInfo);
			Assert.printStack(e);
			Native.callFlowCrashHandlers("[Timer Handler]: " + crashInfo);
		}
	};
	if(ms == 0) {
		var alive = true;
		Native.defer(function() {
			if(alive) {
				fn();
			}
		});
		return function() {
			alive = false;
		};
	}
	var t = setTimeout(fn, ms);
	return function() {
		clearTimeout(t);
	};
};
Native.timer = function(ms,cb) {
	Native.interruptibleTimer(ms,cb);
};
Native.sin = function(a) {
	return Math.sin(a);
};
Native.asin = function(a) {
	return Math.asin(a);
};
Native.acos = function(a) {
	return Math.acos(a);
};
Native.atan = function(a) {
	return Math.atan(a);
};
Native.atan2 = function(a,b) {
	return Math.atan2(a,b);
};
Native.exp = function(a) {
	return Math.exp(a);
};
Native.log = function(a) {
	return Math.log(a);
};
Native.generate = function(from,to,fn) {
	var n = to - from;
	if(n <= 0) {
		return Array(0);
	}
	var result = Array(n);
	var _g = 0;
	var _g1 = n;
	while(_g < _g1) {
		var i = _g++;
		result[i] = fn(i + from);
	}
	return result;
};
Native.enumFromTo = function(from,to) {
	var n = to - from + 1;
	if(n <= 0) {
		return Array(0);
	}
	var result = Array(n);
	var _g = 0;
	var _g1 = n;
	while(_g < _g1) {
		var i = _g++;
		result[i] = i + from;
	}
	return result;
};
Native.getAllUrlParameters = function() {
	var parameters_h = Object.create(null);
	var paramString = window.location.search.substring(1);
	var params = paramString.split("&");
	var _g = 0;
	while(_g < params.length) {
		var keyvalue = params[_g];
		++_g;
		var pair = keyvalue.split("=");
		var value = pair.length > 1 ? decodeURIComponent(pair[1].split("+").join(" ")) : "";
		parameters_h[pair[0]] = value;
	}
	var i = 0;
	var result = [];
	var h = parameters_h;
	var key_h = h;
	var key_keys = Object.keys(h);
	var key_length = key_keys.length;
	var key_current = 0;
	while(key_current < key_length) {
		var key = key_keys[key_current++];
		var keyvalue = [];
		keyvalue[0] = key;
		keyvalue[1] = parameters_h[key];
		result[i] = keyvalue;
		++i;
	}
	if (typeof predefinedBundleParams != 'undefined') {result = mergePredefinedParams(result, predefinedBundleParams);}
	return result;
};
Native.getUrlParameter = function(name) {
	var value = "";
	value = Util.getParameter(name);
	if(value != null) {
		return value;
	} else {
		return "";
	}
};
Native.isTouchScreen = function() {
	if(!Platform.isMobile) {
		return (('ontouchstart' in window) || (window.DocumentTouch && document instanceof DocumentTouch) || window.matchMedia('(pointer: coarse)').matches);
	} else {
		return true;
	}
};
Native.getTargetName = function() {
	var testdiv = window.document.createElement("div");
	testdiv.style.height = "1in";
	testdiv.style.width = "1in";
	testdiv.style.left = "-100%";
	testdiv.style.top = "-100%";
	testdiv.style.position = "absolute";
	window.document.body.appendChild(testdiv);
	var dpi = testdiv.offsetHeight * window.devicePixelRatio;
	window.document.body.removeChild(testdiv);
	if(!Platform.isMobile) {
		return "js,pixi,dpi=" + dpi;
	} else {
		return "js,pixi,mobile,dpi=" + dpi;
	}
};
Native.isIE = function() {
	return window.navigator.userAgent.indexOf("MSIE") >= 0;
};
Native.setKeyValue = function(k,v) {
	return Native.setKeyValueJS(k,v,false);
};
Native.getKeyValue = function(key,def) {
	return Native.getKeyValueJS(key,def,false);
};
Native.removeKeyValue = function(key) {
	var useMask = StringTools.endsWith(key,"*");
	var mask = "";
	if(useMask) {
		mask = HxOverrides.substr(key,0,key.length - 1);
	}
	Native.removeKeyValueJS(key,false);
};
Native.removeAllKeyValues = function() {
	Native.removeAllKeyValuesJS(false);
};
Native.getKeysList = function() {
	return Native.getKeysListJS(false);
};
Native.setSessionKeyValue = function(k,v) {
	return Native.setKeyValueJS(k,v,true);
};
Native.getSessionKeyValue = function(key,def) {
	return Native.getKeyValueJS(key,def,true);
};
Native.removeSessionKeyValue = function(key) {
	Native.removeKeyValueJS(key,true);
};
Native.setKeyValueJS = function(k,v,session) {
	try {
		var storage = session ? sessionStorage : localStorage;
		if(Native.isIE()) {
			var tmp = encodeURIComponent(v);
			storage.setItem(k,tmp);
		} else {
			storage.setItem(k,v);
		}
		return true;
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		var e = haxe_Exception.caught(_g).unwrap();
		Errors.report("Cannot set value for key \"" + k + "\": " + Std.string(e));
		return false;
	}
};
Native.getKeyValueJS = function(key,def,session) {
	try {
		var storage = session ? sessionStorage : localStorage;
		var value = storage.getItem(key);
		if(null == value) {
			return def;
		}
		if(Native.isIE()) {
			return decodeURIComponent(value.split("+").join(" "));
		} else {
			return value;
		}
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		var e = haxe_Exception.caught(_g).unwrap();
		Errors.report("Cannot get value for key \"" + key + "\": " + Std.string(e));
		return def;
	}
};
Native.removeKeyValueJS = function(key,session) {
	var useMask = StringTools.endsWith(key,"*");
	var mask = "";
	if(useMask) {
		mask = HxOverrides.substr(key,0,key.length - 1);
	}
	try {
		var storage = session ? sessionStorage : localStorage;
		if(storage.length == 0) {
			return;
		}
		if(useMask) {
			var nextKey;
			var _g = 0;
			var _g1 = storage.length;
			while(_g < _g1) {
				var i = _g++;
				nextKey = storage.key(i);
				if(StringTools.startsWith(nextKey,mask)) {
					storage.removeItem(nextKey);
				}
			}
		} else {
			storage.removeItem(key);
		}
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		var e = haxe_Exception.caught(_g).unwrap();
		Errors.report("Cannot remove key \"" + key + "\": " + Std.string(e));
	}
};
Native.removeAllKeyValuesJS = function(session) {
	try {
		var storage = session ? sessionStorage : localStorage;
		storage.clear();
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		var e = haxe_Exception.caught(_g).unwrap();
		Errors.report("Cannot clear storage: " + Std.string(e));
	}
};
Native.getKeysListJS = function(session) {
	try {
		var storage = session ? sessionStorage : localStorage;
		return Object.keys(storage);
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		var e = haxe_Exception.caught(_g).unwrap();
		Errors.report("Cannot get keys list: " + Std.string(e));
		return [];
	}
};
Native.clearTrace = function() {
};
Native.printCallstack = function() {
	console.trace();
};
Native.captureCallstack = function() {
	return null;
};
Native.callstack2string = function(c) {
	return "";
};
Native.captureStringCallstack = function() {
	return StringTools.replace(StringTools.replace(new Error().stack,"    at ",""),"Error\n","");
};
Native.captureCallstackItem = function(index) {
	return null;
};
Native.impersonateCallstackItem = function(item,index) {
};
Native.impersonateCallstackFn = function(fn,index) {
};
Native.impersonateCallstackNone = function(index) {
};
Native.failWithError = function(e) {
	throw haxe_Exception.thrown("Runtime failure: " + e);
};
Native.makeStructValue = function(name,args,default_value) {
	return HaxeRuntime.makeStructValue(name,args,default_value);
};
Native.extractStructArguments = function(value) {
	return HaxeRuntime.extractStructArguments(value);
};
Native.quit = function(c) {
	window.open("","_top").close();
};
Native.getFileContent = function(file) {
	return "";
};
Native.getFileContentBinary = function(file) {
	throw haxe_Exception.thrown("Not implemented for this target: getFileContentBinary");
};
Native.setFileContent = function(file,content) {
	Errors.print("setFileContent '" + file + "' does not work in this target. Use the C++ runner");
	return false;
};
Native.setFileContentUTF16 = function(file,content) {
	return false;
};
Native.setFileContentBinaryConvertToUTF8 = function(file,content) {
	return Native.setFileContentBinaryCommon(file,content,true);
};
Native.setFileContentBinary = function(file,content) {
	return Native.setFileContentBinaryCommon(file,content,false);
};
Native.setFileContentBinaryCommon = function(file,content,convertToUTF8) {
	try {
		var a = window.document.createElement("a");
		a.download = file;
		window.document.body.appendChild(a);
		if(convertToUTF8 || Util.getParameter("save_file_utf8") == "1") {
			var fileBlob = new Blob([content],{ type : "application/octet-stream"});
			var url = URL.createObjectURL(fileBlob);
			a.href = url;
			a.click();
			Native.defer(function() {
				URL.revokeObjectURL(url);
			});
		} else {
			if(content.startsWith(String.fromCodePoint(65279))) {
				content = content.substr(1);
			}
			var base64data = window.btoa(content);
			a.href = "data:application/octet-stream;base64," + base64data;
			a.click();
		}
		Native.defer(function() {
			window.document.body.removeChild(a);
		});
		return true;
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		if(convertToUTF8) {
			return false;
		} else {
			return Native.setFileContentBinaryCommon(file,content,true);
		}
	}
};
Native.setFileContentBytes = function(file,content) {
	return Native.setFileContentBinary(file,content);
};
Native.startProcess = function(command,args,cwd,stdIn,onExit) {
	return false;
};
Native.runProcess = function(command,args,cwd,onstdout,onstderr,onExit) {
	return false;
};
Native.startDetachedProcess = function(command,args,cwd) {
	return false;
};
Native.writeProcessStdin = function(process,arg) {
	return false;
};
Native.killProcess = function(process) {
	return false;
};
Native.fromCharCode = function(c) {
	return String.fromCodePoint(c);
};
Native.utc2local = function(stamp) {
	return NativeTime.utc2local(stamp);
};
Native.local2utc = function(stamp) {
	return NativeTime.local2utc(stamp);
};
Native.string2time = function(date) {
	return NativeTime.string2time(date);
};
Native.dayOfWeek = function(year,month,day) {
	return NativeTime.dayOfWeek(year,month,day);
};
Native.time2string = function(date) {
	return NativeTime.time2string(date);
};
Native.getUrl = function(u,t) {
	Native.getUrlBasic(u,t);
};
Native.getUrlAutoclose = function(u,t,delay) {
	Native.getUrlBasic(u,t,delay);
};
Native.getUrlBasic = function(u,t,autoCloseDelay) {
	if(autoCloseDelay == null) {
		autoCloseDelay = -1;
	}
	try {
		var openedWindow = window.open(u,t);
		if(autoCloseDelay >= 0) {
			openedWindow.addEventListener("pageshow",function() {
				Native.timer(autoCloseDelay,function() {
					openedWindow.close();
				});
			});
		}
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		var e = haxe_Exception.caught(_g).unwrap();
		if(e != null && e.number != -2147467259) {
			throw haxe_Exception.thrown(e);
		}
	}
};
Native.getUrl2 = function(u,t) {
	try {
		return window.open(u,t) != null;
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		var e = haxe_Exception.caught(_g).unwrap();
		if(e != null && e.number != -2147467259) {
			throw haxe_Exception.thrown(e);
		} else {
			Errors.report(e);
		}
		return false;
	}
};
Native.getCharCodeAt = function(s,i) {
	return HxOverrides.cca(s,i);
};
Native.loaderUrl = function() {
	return window.location.href;
};
Native.number2double = function(n) {
	return n;
};
Native.stringbytes2double = function(s) {
	return Native.stringToDouble(s);
};
Native.stringbytes2int = function(s) {
	return HxOverrides.cca(s,0) | HxOverrides.cca(s,1) << 16;
};
Native.initBinarySerialization = function() {
	if(typeof(ArrayBuffer) == "undefined" || typeof(Float64Array) == "undefined") {
		var binaryParser = new js_BinaryParser(false,false);
		Native.doubleToString = function(value) {
			return Native.packDoubleBytes(binaryParser.fromDouble(value));
		};
		Native.stringToDouble = function(str) {
			return binaryParser.toDouble(Native.unpackDoubleBytes(str));
		};
	} else {
		var arrayBuffer = new ArrayBuffer(16);
		var uint16Array = new Uint16Array(arrayBuffer);
		var float64Array = new Float64Array(arrayBuffer);
		Native.doubleToString = function(value) {
			float64Array[0] = value;
			var ret_b = "";
			ret_b += String.fromCodePoint(uint16Array[0]);
			ret_b += String.fromCodePoint(uint16Array[1]);
			ret_b += String.fromCodePoint(uint16Array[2]);
			ret_b += String.fromCodePoint(uint16Array[3]);
			return ret_b;
		};
		Native.stringToDouble = function(str) {
			uint16Array[0] = HxOverrides.cca(str,0);
			uint16Array[1] = HxOverrides.cca(str,1);
			uint16Array[2] = HxOverrides.cca(str,2);
			uint16Array[3] = HxOverrides.cca(str,3);
			return float64Array[0];
		};
	}
};
Native.packDoubleBytes = function(s) {
	var ret_b = "";
	var _g = 0;
	var _g1 = s.length / 2;
	while(_g < _g1) {
		var i = _g++;
		var c = HxOverrides.cca(s,i * 2) | HxOverrides.cca(s,i * 2 + 1) << 8;
		ret_b += String.fromCodePoint(c);
	}
	return ret_b;
};
Native.unpackDoubleBytes = function(s) {
	var ret_b = "";
	var _g = 0;
	var _g1 = s.length;
	while(_g < _g1) {
		var i = _g++;
		var c = HxOverrides.cca(s,i) & 255;
		ret_b += String.fromCodePoint(c);
		var c1 = HxOverrides.cca(s,i) >> 8;
		ret_b += String.fromCodePoint(c1);
	}
	return ret_b;
};
Native.writeBinaryInt32 = function(value,buf) {
	buf.b += String.fromCodePoint((value & 65535));
	buf.b += String.fromCodePoint((value >> 16));
};
Native.writeInt = function(value,buf) {
	if((value & -32768) != 0) {
		buf.b += String.fromCodePoint(65525);
		buf.b += String.fromCodePoint((value & 65535));
		buf.b += String.fromCodePoint((value >> 16));
	} else {
		buf.b += String.fromCodePoint(value);
	}
};
Native.writeStructDefs = function(buf) {
	Native.writeArrayLength(Native.structDefs.length,buf);
	var _g = 0;
	var _g1 = Native.structDefs;
	while(_g < _g1.length) {
		var struct_def = _g1[_g];
		++_g;
		buf.b += String.fromCodePoint(65528);
		buf.b += String.fromCodePoint(2);
		buf.b += String.fromCodePoint(struct_def[0]);
		buf.b += String.fromCodePoint(65530);
		var c = struct_def[1].length;
		buf.b += String.fromCodePoint(c);
		var s = struct_def[1];
		var len = null;
		buf.b += len == null ? HxOverrides.substr(s,0,null) : HxOverrides.substr(s,0,len);
	}
};
Native.writeArrayLength = function(arr_len,buf) {
	if(arr_len == 0) {
		buf.b += String.fromCodePoint(65527);
	} else if(arr_len > 65535) {
		buf.b += String.fromCodePoint(65529);
		buf.b += String.fromCodePoint((arr_len & 65535));
		buf.b += String.fromCodePoint((arr_len >> 16));
	} else {
		buf.b += String.fromCodePoint(65528);
		buf.b += String.fromCodePoint(arr_len);
	}
};
Native.writeBinaryValue = function(value,buf) {
	var _g = HaxeRuntime.typeOf(value);
	switch(_g._hx_index) {
	case 0:
		buf.b += String.fromCodePoint(65535);
		break;
	case 1:
		buf.b += String.fromCodePoint((value ? 65534 : 65533));
		break;
	case 3:
		buf.b += String.fromCodePoint(65532);
		var s = Native.doubleToString(value);
		var len = null;
		buf.b += len == null ? HxOverrides.substr(s,0,null) : HxOverrides.substr(s,0,len);
		break;
	case 4:
		var str_len = value.length;
		if(value.length > 65535) {
			buf.b += String.fromCodePoint(65531);
			buf.b += String.fromCodePoint((str_len & 65535));
			buf.b += String.fromCodePoint((str_len >> 16));
		} else {
			buf.b += String.fromCodePoint(65530);
			buf.b += String.fromCodePoint(str_len);
		}
		var s = value;
		var len = null;
		buf.b += len == null ? HxOverrides.substr(s,0,null) : HxOverrides.substr(s,0,len);
		break;
	case 5:
		var t = _g.type;
		var arr_len = value.length;
		Native.writeArrayLength(arr_len,buf);
		var _g1 = 0;
		var _g2 = arr_len;
		while(_g1 < _g2) {
			var i = _g1++;
			Native.writeBinaryValue(value[i],buf);
		}
		break;
	case 6:
		var n = _g.name;
		var struct_id = value._id;
		var struct_fields = HaxeRuntime._structargs_.h[struct_id];
		var field_types = HaxeRuntime._structargtypes_.h[struct_id];
		var fields_count = struct_fields.length;
		var struct_idx = 0;
		if(Native.structIdxs.h.hasOwnProperty(struct_id)) {
			struct_idx = Native.structIdxs.h[struct_id];
		} else {
			struct_idx = Native.structDefs.length;
			Native.structIdxs.h[struct_id] = struct_idx;
			Native.structDefs.push([fields_count,HaxeRuntime._structnames_.h[struct_id]]);
		}
		buf.b += String.fromCodePoint(65524);
		buf.b += String.fromCodePoint(struct_idx);
		var _g1 = 0;
		var _g2 = fields_count;
		while(_g1 < _g2) {
			var i = _g1++;
			var field = Reflect.field(value,struct_fields[i]);
			if(field_types[i] == RuntimeType.RTInt) {
				var value1 = field;
				if((value1 & -32768) != 0) {
					buf.b += String.fromCodePoint(65525);
					buf.b += String.fromCodePoint((value1 & 65535));
					buf.b += String.fromCodePoint((value1 >> 16));
				} else {
					buf.b += String.fromCodePoint(value1);
				}
			} else {
				Native.writeBinaryValue(field,buf);
			}
		}
		break;
	case 7:
		var t = _g.type;
		buf.b += String.fromCodePoint(65526);
		Native.writeBinaryValue(value.__v,buf);
		break;
	default:
		throw haxe_Exception.thrown("Cannot serialize " + Std.string(value));
	}
};
Native.toBinary = function(value) {
	var buf = new StringBuf();
	Native.structIdxs = new haxe_ds_IntMap();
	Native.structDefs = [];
	Native.writeBinaryValue(value,buf);
	var str = buf.b;
	var struct_defs_buf = new StringBuf();
	Native.writeStructDefs(struct_defs_buf);
	var code = str.length + 2 & 65535;
	var ret = String.fromCodePoint(code);
	var code = str.length + 2 >> 16;
	var ret1 = ret + String.fromCodePoint(code) + str + struct_defs_buf.b;
	return ret1;
};
Native.fromBinary = function(string,defvalue,fixups) {
	if(js_Boot.getClass(string) == JSBinflowBuffer) {
		return string.deserialise(defvalue,fixups);
	} else {
		return string;
	}
};
Native.getTotalMemoryUsed = function() {
	return 0.0;
};
Native.detectDedicatedGPU = function() {
	try {
		var canvas = window.document.createElement("canvas");
		var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
		if(gl == null) {
			return false;
		}
		var debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
		var vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
		var renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
		if(!(renderer.toLowerCase().indexOf("nvidia") >= 0 || renderer.toLowerCase().indexOf("ati") >= 0)) {
			return renderer.toLowerCase().indexOf("radeon") >= 0;
		} else {
			return true;
		}
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		return false;
	}
};
Native.domCompleteTiming = function() {
	try {
		return window.performance.timing.domComplete - window.performance.timing.domLoading;
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		return -1;
	}
};
Native.estimateCPUSpeed = function() {
	
			var _speedconstant = 1.15600e-8;
			var d = new Date();
			var amount = 150000000;
			var estprocessor = 1.7;
			for (var i = amount; i > 0; i--) {}
			var newd = new Date();
			di = (newd.getTime() - d.getTime()) / 1000;
			spd = ((_speedconstant * amount) / di);
			return Math.round(spd * 1000) / 1000;
		;
	return -1;
};
Native.getDeviceMemory = function() {
	try {
		return window.navigator.deviceMemory || -1;
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		return -1;
	}
};
Native.getDevicePlatform = function() {
	try {
		return window.navigator.platform || '';
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		return -1;
	}
};
Native.addCrashHandler = function(cb) {
	Native.FlowCrashHandlers.push(cb);
	return function() {
		HxOverrides.remove(Native.FlowCrashHandlers,cb);
	};
};
Native.callFlowCrashHandlers = function(msg) {
	msg += "Call stack: " + Assert.callStackToString(haxe_CallStack.exceptionStack());
	var _g = 0;
	var _g1 = Native.FlowCrashHandlers.slice(0,Native.FlowCrashHandlers.length);
	while(_g < _g1.length) {
		var hdlr = _g1[_g];
		++_g;
		hdlr(msg);
	}
};
Native.addPlatformEventListener = function(event,cb) {
	if(event == "online" || event == "offline") {
		var w = window;
		if(w.addEventListener != null) {
			w.addEventListener(event,cb,false);
			return function() {
				var w = window;
				if(w.removeEventListener != null) {
					w.removeEventListener(event,cb);
				}
			};
		}
	} else if(event == "suspend") {
		window.addEventListener("blur",cb);
		window.addEventListener("pagehide",cb);
		return function() {
			window.removeEventListener("blur",cb);
			window.removeEventListener("pagehide",cb);
		};
	} else if(event == "resume") {
		window.addEventListener("focus",cb);
		window.addEventListener("pageshow",cb);
		return function() {
			window.removeEventListener("focus",cb);
			window.removeEventListener("pageshow",cb);
		};
	} else if(event == "active") {
		var timeoutActiveId = -1;
		var setTimeoutActiveFn = function() {
		};
		var activeCalled = false;
		setTimeoutActiveFn = function() {
			var timePassedActive = new Date().getTime() - Native.LastUserAction;
			if(timePassedActive >= Native.IdleLimit) {
				timeoutActiveId = -1;
				activeCalled = false;
			} else {
				timeoutActiveId = setTimeout(setTimeoutActiveFn, Native.IdleLimit - timePassedActive);
				if(!activeCalled) {
					activeCalled = true;
					cb();
				}
			}
		};
		var mouseMoveActiveFn = function() {
			Native.LastUserAction = new Date().getTime();
			if(timeoutActiveId == -1) {
				setTimeoutActiveFn();
			}
		};
		window.addEventListener("pointermove",mouseMoveActiveFn);
		window.addEventListener("videoplaying",mouseMoveActiveFn);
		window.addEventListener("focus",mouseMoveActiveFn);
		window.addEventListener("blur",mouseMoveActiveFn);
		mouseMoveActiveFn();
		return function() {
			clearTimeout(timeoutActiveId);
			window.removeEventListener("pointermove",mouseMoveActiveFn);
			window.removeEventListener("videoplaying",mouseMoveActiveFn);
			window.removeEventListener("focus",mouseMoveActiveFn);
			window.removeEventListener("blur",mouseMoveActiveFn);
		};
	} else if(event == "idle") {
		var timeoutIdleId = -1;
		var setTimeoutIdleFn = function() {
		};
		var idleCalled = false;
		setTimeoutIdleFn = function() {
			var timePassedIdle = new Date().getTime() - Native.LastUserAction;
			if(timePassedIdle >= Native.IdleLimit) {
				timeoutIdleId = -1;
				if(!idleCalled) {
					idleCalled = true;
					cb();
				}
			} else {
				timeoutIdleId = setTimeout(setTimeoutIdleFn, Native.IdleLimit - timePassedIdle);
				idleCalled = false;
			}
		};
		var mouseMoveIdleFn = function() {
			Native.LastUserAction = new Date().getTime();
			if(timeoutIdleId == -1) {
				setTimeoutIdleFn();
			}
		};
		window.addEventListener("pointermove",mouseMoveIdleFn);
		window.addEventListener("videoplaying",mouseMoveIdleFn);
		window.addEventListener("focus",mouseMoveIdleFn);
		window.addEventListener("blur",mouseMoveIdleFn);
		return function() {
			clearTimeout(timeoutIdleId);
			window.removeEventListener("pointermove",mouseMoveIdleFn);
			window.removeEventListener("videoplaying",mouseMoveIdleFn);
			window.removeEventListener("focus",mouseMoveIdleFn);
			window.removeEventListener("blur",mouseMoveIdleFn);
		};
	}
	if(!Object.prototype.hasOwnProperty.call(Native.PlatformEventListeners.h,event)) {
		var this1 = Native.PlatformEventListeners;
		var value = [];
		this1.h[event] = value;
	}
	Native.PlatformEventListeners.h[event].push(cb);
	return function() {
		HxOverrides.remove(Native.PlatformEventListeners.h[event],cb);
	};
};
Native.setUserIdleLimit = function(ms) {
	Native.IdleLimit = ms;
};
Native.notifyPlatformEvent = function(event) {
	var cancelled = false;
	if(Object.prototype.hasOwnProperty.call(Native.PlatformEventListeners.h,event)) {
		var _g = 0;
		var _g1 = Native.PlatformEventListeners.h[event];
		while(_g < _g1.length) {
			var cb = _g1[_g];
			++_g;
			if(cb()) {
				cancelled = true;
			}
		}
	}
	return cancelled;
};
Native.addCameraPhotoEventListener = function(cb) {
	return function() {
	};
};
Native.addCameraVideoEventListener = function(cb) {
	return function() {
	};
};
Native.md5 = function(content) {
	return JsMd5.encode(content);
};
Native.getCharAt = function(s,i) {
	return s.charAt(i);
};
Native.object2JsonStructsCompacting = function(o,sDict,jsDict,nDict) {
	
		if (Array.isArray(o)) {
			var n = o.length;
			var a1 = Array(n);
			for (var i=0; i<n; i++) {
				a1[i] = Native.object2JsonStructs(o[i], sDict, jsDict, nDict);
			}
			var obj = { _id : Native.sidJsonArray };
			obj[Native.sidJsonArrayVal] = a1;
			return obj;
		} else {
			var t = typeof o;
			switch (t) {
				case 'string':
					if (o === '') return Native.jsonStringEmpty;
					var obj = jsDict[o];
					if (obj == undefined) {
						var s = sDict[o];
						if (s === undefined) {
							s = o;
							sDict[o] = s;
						}
						obj = { _id : Native.sidJsonString };
						obj[Native.sidJsonStringVal] = s;
						jsDict[o] = obj;
					}
					return obj;
				case 'number':
					if (o === 0.0) return Native.jsonDoubleZero;
					var obj = nDict[o];
					if (obj === undefined) {
						obj = { _id : Native.sidJsonDouble };
						obj[Native.sidJsonDoubleVal] = o;
						nDict[o] = obj;
					}
					return obj;
				case 'boolean': return o ? Native.jsonBoolTrue : Native.jsonBoolFalse;
				default:
					if(o == null) {
						return Native.jsonNull;
					} else {
						var mappedFields = [];
						for(var f in o) {
							var a2 = Native.object2JsonStructs(o[f], sDict, jsDict, nDict);
							var obj = { _id : Native.sidPair };
							var cf = sDict[f];
							if (cf === undefined) {
								cf = f;
								sDict[f] = cf;
							}
							obj[Native.sidPairFirst] = cf;
							obj[Native.sidPairSecond] = a2;
							mappedFields.push(obj);
						}
						var obj = { _id : Native.sidJsonObject};
						obj[Native.sidJsonObjectFields] = mappedFields;
						return obj;
					}
			}
		}
	return "";
};
Native.object2JsonStructsCompacting_FF = function(o,sDict,jsDict,nDict) {
	
		if (Array.isArray(o)) {
			var n = o.length;
			var a1 = Array(n);
			for (var i=0; i<n; i++) {
				a1[i] = Native.object2JsonStructs_FF(o[i], sDict, jsDict, nDict);
			}
			var obj = { _id : Native.sidJsonArray };
			obj[Native.sidJsonArrayVal] = a1;
			return obj;
		} else {
			var t = typeof o;
			switch (t) {
				case 'string':
					if (o === '') return Native.jsonStringEmpty;
					var obj = jsDict[o];
					if (obj == undefined) {
						var s = sDict[o];
						if (s === undefined) {
							s = o;
							sDict[o] = s;
						}
						obj = { _id : Native.sidJsonString };
						obj[Native.sidJsonStringVal] = s;
						jsDict[o] = obj;
					}
					return obj;
				case 'number':
					if (o === 0.0) return Native.jsonDoubleZero;
					var obj = nDict[o];
					if (obj === undefined) {
						obj = { _id : Native.sidJsonDouble };
						obj[Native.sidJsonDoubleVal] = o;
						nDict[o] = obj;
					}
					return obj;
				case 'boolean': return o ? Native.jsonBoolTrue : Native.jsonBoolFalse;
				default:
					if(o == null) {
						return Native.jsonNull;
					} else {
						var mappedFields = Object.getOwnPropertyNames(o);
						for(var i=0; i< mappedFields.length; i++) {
							var f = mappedFields[i];
							var cf = sDict[f];
							if (cf === undefined) {
								cf = f;
								sDict[f] = cf;
							}

							var a2 = Native.object2JsonStructs_FF(o[f], sDict, jsDict, nDict);
							var obj = { _id : Native.sidPair };
							obj[Native.sidPairFirst] = cf;
							obj[Native.sidPairSecond] = a2;
							mappedFields[i] = obj;
						}
						var obj = { _id : Native.sidJsonObject};
						obj[Native.sidJsonObjectFields] = mappedFields;
						return obj;
					}
			}
		}
	return "";
};
Native.object2JsonStructs = function(o) {
	
		if (Array.isArray(o)) {
			var a1 = Native.map(o,Native.object2JsonStructs);
			var obj = { _id : Native.sidJsonArray };
			obj[Native.sidJsonArrayVal] = a1;
			return obj;
		} else {
			var t = typeof o;
			switch (t) {
				case 'string':
					var obj = { _id : Native.sidJsonString };
					obj[Native.sidJsonStringVal] = o;
					return obj;
				case 'number':
					var obj = { _id : Native.sidJsonDouble };
					obj[Native.sidJsonDoubleVal] = o;
					return obj;
				case 'boolean': return o ? Native.jsonBoolTrue : Native.jsonBoolFalse;
				default:
					if(o == null) {
						return Native.jsonNull;
					} else {
						var mappedFields = [];
						for(var f in o) {
							var a2 = Native.object2JsonStructs(o[f]);
							var obj = { _id : Native.sidPair };
							obj[Native.sidPairFirst] = f;
							obj[Native.sidPairSecond] = a2;
							mappedFields.push(obj);
						}
						var obj = { _id : Native.sidJsonObject};
						obj[Native.sidJsonObjectFields] = mappedFields;
						return obj;
					}
			}
		}
	return "";
};
Native.object2JsonStructs_FF = function(o) {
	
		if (Array.isArray(o)) {
			var a1 = Native.map(o,Native.object2JsonStructs_FF);
			var obj = { _id : Native.sidJsonArray};
			obj[Native.sidJsonArrayVal] = a1;
			return obj;
		} else {
			var t = typeof o;
			switch (t) {
				case 'string':
					var obj = { _id : Native.sidJsonString };
					obj[Native.sidJsonStringVal] = o;
					return obj;
				case 'number':
					var obj = { _id : Native.sidJsonDouble };
					obj[Native.sidJsonDoubleVal] = o;
					return obj;
				case 'boolean': return o ? Native.jsonBoolTrue : Native.jsonBoolFalse;
				default:
					if(o == null) {
						return Native.jsonNull;
					} else {
						var mappedFields = Object.getOwnPropertyNames(o);
						for(var i=0; i< mappedFields.length; i++) {
							var f = mappedFields[i];
							var a2 = Native.object2JsonStructs_FF(o[f]);
							var obj = { _id : Native.sidPair };
							obj[Native.sidPairFirst] = f;
							obj[Native.sidPairSecond] = a2;
							mappedFields[i] = obj;
						}
						var obj = { _id : Native.sidJsonObject};
						obj[Native.sidJsonObjectFields] = mappedFields;
						return obj;
					}
			}
		}
	return "";
};
Native.parseJson = function(json) {
	if(Native.parseJsonFirstCall) {
		Native.sidJsonArray = HaxeRuntime._structids_.h["JsonArray"];
		Native.sidJsonArrayVal = HaxeRuntime._structargs_.h[Native.sidJsonArray][0];
		Native.sidJsonString = HaxeRuntime._structids_.h["JsonString"];
		Native.sidJsonStringVal = HaxeRuntime._structargs_.h[Native.sidJsonString][0];
		Native.sidJsonDouble = HaxeRuntime._structids_.h["JsonDouble"];
		Native.sidJsonDoubleVal = HaxeRuntime._structargs_.h[Native.sidJsonDouble][0];
		var sid = HaxeRuntime._structids_.h["JsonBool"];
		var o = { _id : sid};
		o[HaxeRuntime._structargs_.h[sid][0]] = true;
		Native.jsonBoolTrue = o;
		var sid = HaxeRuntime._structids_.h["JsonBool"];
		var o = { _id : sid};
		o[HaxeRuntime._structargs_.h[sid][0]] = false;
		Native.jsonBoolFalse = o;
		Native.sidPair = HaxeRuntime._structids_.h["Pair"];
		Native.sidPairFirst = HaxeRuntime._structargs_.h[Native.sidPair][0];
		Native.sidPairSecond = HaxeRuntime._structargs_.h[Native.sidPair][1];
		Native.sidJsonObject = HaxeRuntime._structids_.h["JsonObject"];
		Native.sidJsonObjectFields = HaxeRuntime._structargs_.h[Native.sidJsonObject][0];
		Native.jsonNull = HaxeRuntime.makeStructValue("JsonNull",[],null);
		Native.jsonDoubleZero = HaxeRuntime.makeStructValue("JsonDouble",[0.0],null);
		Native.jsonStringEmpty = HaxeRuntime.makeStructValue("JsonString",[""],null);
		Native.parseJsonFirstCall = false;
	}
	if(json == "") {
		return Native.jsonDoubleZero;
	}
	
			try {
				if (Platform.isIOS && json.length > 1024) {
					// on IOS memory restriction is very tight so we try to not create duplicate strings if possible
					// it might have advantages for quite long parsed string only
					return Platform.isFirefox ?
					Native.object2JsonStructsCompacting_FF(JSON.parse(json), {}, {}, {}) :
					Native.object2JsonStructsCompacting(JSON.parse(json), {}, {}, {});
				} else {
					return Platform.isFirefox ?
					Native.object2JsonStructs_FF(JSON.parse(json)) :
					Native.object2JsonStructs(JSON.parse(json));
				}
			} catch (e) {
				return Native.jsonDoubleZero;
			}
		;
	return Native.jsonDoubleZero;
};
Native.concurrentAsync = function(fine,tasks,cb) {
	
var fns = tasks.map(function(c, i, a) {
	var v = function v (callback) {
		var r = c.call();
		callback(null, r);
	}
	return v;
});

async.parallel(fns, function(err, results) { cb(results) });
};
Native.preloadStaticResource = function(href,as) {
	var tag = window.document.createElement("link");
	tag.rel = "preload";
	tag.href = href;
	tag.as = as;
	window.document.head.appendChild(tag);
};
var PixiWorkarounds = function() { };
PixiWorkarounds.__name__ = true;
PixiWorkarounds.workaroundRendererDestroy = function() {
	
			PIXI.WebGLRenderer.prototype.bindTexture = function(texture, location, forceLocation)
			{
				texture = texture || this.emptyTextures[location];
				texture = texture.baseTexture || texture;
				texture.touched = this.textureGC.count;

				if (!forceLocation)
				{
					// TODO - maybe look into adding boundIds.. save us the loop?
					for (var i = 0; i < this.boundTextures.length; i++)
					{
						if (this.boundTextures[i] === texture)
						{
							return i;
						}
					}

					if (location === undefined)
					{
						this._nextTextureLocation++;
						this._nextTextureLocation %= this.boundTextures.length;
						location = this.boundTextures.length - this._nextTextureLocation - 1;
					}
				}
				else
				{
					location = location || 0;
				}

				const gl = this.gl;
				const glTexture = texture._glTextures[this.CONTEXT_UID];

				if (!glTexture)
				{
					// this will also bind the texture..
					try {
						this.textureManager.updateTexture(texture, location);
					} catch (error) {
						// usually a crossorigin problem
					}
				}
				else
				{
					// bind the current texture
					this.boundTextures[location] = texture;
					gl.activeTexture(gl.TEXTURE0 + location);
					gl.bindTexture(gl.TEXTURE_2D, glTexture.texture);
				}

				return location;
			}

			PIXI.WebGLRenderer.prototype.destroy = function(removeView)
			{
				// this.destroyPlugins();

				// remove listeners
				this.view.removeEventListener('webglcontextlost', this.handleContextLost);
				this.view.removeEventListener('webglcontextrestored', this.handleContextRestored);

				this.textureManager.destroy();

				// call base destroy
				this.type = PIXI.RENDERER_TYPE.UNKNOWN;

				this.view = null;

				this.screen = null;

				this.resolution = 0;

				this.transparent = false;

				this.autoResize = false;

				this.blendModes = null;

				this.options = null;

				this.preserveDrawingBuffer = false;
				this.clearBeforeRender = false;

				this.roundPixels = false;

				this._backgroundColor = 0;
				this._backgroundColorRgba = null;
				this._backgroundColorString = null;

				this._tempDisplayObjectParent = null;
				this._lastObjectRendered = null;

				this.uid = 0;

				// destroy the managers
				this.maskManager.destroy();
				this.stencilManager.destroy();
				this.filterManager.destroy();

				this.maskManager = null;
				this.filterManager = null;
				this.textureManager = null;
				this.currentRenderer = null;

				this.handleContextLost = null;
				this.handleContextRestored = null;

				this._contextOptions = null;
				// this.gl.useProgram(null);

				// if (this.gl.getExtension('WEBGL_lose_context'))
				// {
				// 	this.gl.getExtension('WEBGL_lose_context').loseContext();
				// }

				this.gl = null;
			}
		;
};
PixiWorkarounds.workaroundProcessInteractive = function() {
	
			PIXI.interaction.InteractionManager.prototype.processInteractive = function(interactionEvent, displayObject, func, hitTest, interactive)
			{
				if (!displayObject || !displayObject.visible)
				{
					return false;
				}

				const point = interactionEvent.data.global;

				// Took a little while to rework this function correctly! But now it is done and nice and optimised. ^_^
				//
				// This function will now loop through all objects and then only hit test the objects it HAS
				// to, not all of them. MUCH faster..
				// An object will be hit test if the following is true:
				//
				// 1: It is interactive.
				// 2: It belongs to a parent that is interactive AND one of the parents children have not already been hit.
				//
				// As another little optimisation once an interactive object has been hit we can carry on
				// through the scenegraph, but we know that there will be no more hits! So we can avoid extra hit tests
				// A final optimisation is that an object is not hit test directly if a child has already been hit.

				interactive = displayObject.interactive || interactive;

				var hit = false;
				var interactiveParent = interactive;

				// Flag here can set to false if the event is outside the parents hitArea or mask
				var hitTestChildren = true;

				// If there is a hitArea, no need to test against anything else if the pointer is not within the hitArea
				// There is also no longer a need to hitTest children.
				if (displayObject.hitArea)
				{
					if (hitTest)
					{
						displayObject.worldTransform.applyInverse(point, this._tempPoint);
						if (!displayObject.hitArea.contains(this._tempPoint.x, this._tempPoint.y))
						{
							hitTest = false;
							hitTestChildren = false;
						}
						else
						{
							hit = true;
						}
					}
					interactiveParent = false;
				}
				// If there is a mask, no need to test against anything else if the pointer is not within the mask
				else if (displayObject._mask)
				{
					if (hitTest)
					{
						if (!displayObject._mask.containsPoint(point))
						{
							hitTest = false;
							// hitTestChildren = false;
						}
					}
				}

				// ** FREE TIP **! If an object is not interactive or has no buttons in it
				// (such as a game scene!) set interactiveChildren to false for that displayObject.
				// This will allow PixiJS to completely ignore and bypass checking the displayObjects children.
				if (hitTestChildren && displayObject.interactiveChildren && displayObject.children)
				{
					const children = displayObject.children;

					for (var i = children.length - 1; i >= 0; i--)
					{
						const child = children[i];

						// time to get recursive.. if this function will return if something is hit..
						const childHit = this.processInteractive(interactionEvent, child, func, hitTest, interactiveParent);

						if (childHit)
						{
							// its a good idea to check if a child has lost its parent.
							// this means it has been removed whilst looping so its best
							if (!child.parent)
							{
								continue;
							}

							// we no longer need to hit test any more objects in this container as we we
							// now know the parent has been hit
							interactiveParent = false;

							// If the child is interactive , that means that the object hit was actually
							// interactive and not just the child of an interactive object.
							// This means we no longer need to hit test anything else. We still need to run
							// through all objects, but we don't need to perform any hit tests.

							if (childHit)
							{
								if (interactionEvent.target)
								{
									hitTest = false;
								}
								hit = true;
							}
						}
					}
				}

				// no point running this if the item is not interactive or does not have an interactive parent.
				if (interactive)
				{
					// if we are hit testing (as in we have no hit any objects yet)
					// We also don't need to worry about hit testing if once of the displayObjects children
					// has already been hit - but only if it was interactive, otherwise we need to keep
					// looking for an interactive child, just in case we hit one
					if (hitTest && !interactionEvent.target)
					{
						// already tested against hitArea if it is defined
						if (!displayObject.hitArea && displayObject.containsPoint)
						{
							if (displayObject.containsPoint(point))
							{
								hit = true;
							}
						}
					}

					if (displayObject.interactive)
					{
						if (hit && !interactionEvent.target)
						{
							interactionEvent.target = displayObject;
						}

						if (func)
						{
							func(interactionEvent, displayObject, !!hit);
						}
					}
				}

				return hit;
			}
		;
};
PixiWorkarounds.workaroundIEArrayFromMethod = function() {
	
		if (!Array.from) {
			Array.from = (function () {
				var toStr = Object.prototype.toString;
				var isCallable = function (fn) {
					return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
				};
				var toInteger = function (value) {
					var number = Number(value);
					if (isNaN(number)) { return 0; }
					if (number === 0 || !isFinite(number)) { return number; }
					return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
				};
				var maxSafeInteger = Math.pow(2, 53) - 1;
				var toLength = function (value) {
					var len = toInteger(value);
					return Math.min(Math.max(len, 0), maxSafeInteger);
				};

				// The length property of the from method is 1.
				return function from(arrayLike/*, mapFn, thisArg */) {
					// 1. Let C be the this value.
					var C = this;

					// 2. Let items be ToObject(arrayLike).
					var items = Object(arrayLike);

					// 3. ReturnIfAbrupt(items).
					if (arrayLike == null) {
						throw new TypeError('Array.from requires an array-like object - not null or undefined');
					}

					// 4. If mapfn is undefined, then let mapping be false.
					var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
					var T;
					if (typeof mapFn !== 'undefined') {
						// 5. else
						// 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
						if (!isCallable(mapFn)) {
							throw new TypeError('Array.from: when provided, the second argument must be a function');
						}

						// 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
						if (arguments.length > 2) {
							T = arguments[2];
						}
					}

					// 10. Let lenValue be Get(items, 'length').
					// 11. Let len be ToLength(lenValue).
					var len = toLength(items.length);

					// 13. If IsConstructor(C) is true, then
					// 13. a. Let A be the result of calling the [[Construct]] internal method of C with an argument list containing the single item len.
					// 14. a. Else, Let A be ArrayCreate(len).
					var A = isCallable(C) ? Object(new C(len)) : new Array(len);

					// 16. Let k be 0.
					var k = 0;
					// 17. Repeat, while k < len… (also steps a - h)
					var kValue;
					while (k < len) {
						kValue = items[k];
						if (mapFn) {
							A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
						} else {
							A[k] = kValue;
						}
						k += 1;
					}
					// 18. Let putStatus be Put(A, 'length', len, true).
					A.length = len;
					// 20. Return A.
					return A;
				};
			}());
		}
};
PixiWorkarounds.workaroundIECustomEvent = function() {
	
		if ( typeof window.CustomEvent !== 'function' ) {
			function CustomEvent ( event, params ) {
				params = params || { bubbles: false, cancelable: false, detail: undefined };
				var evt = document.createEvent( 'CustomEvent' );
				evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );

				for (var key in params) {
					evt[key] = params[key];
				}

				return evt;
			}

			CustomEvent.prototype = window.Event.prototype;

			window.CustomEvent = CustomEvent;
		};
};
PixiWorkarounds.workaroundGetContext = function() {
	
			if (RenderSupport.RendererType == 'html') {
				Element.prototype.getContext = function(a, b) { return { imageSmoothingEnabled : true }; };
			} else {
				Element.prototype.getContext = null;
			}
		;
};
PixiWorkarounds.workaroundTextMetrics = function() {
	
			if (!HTMLElement.prototype.scrollTo) { HTMLElement.prototype.scrollTo = function (left, top) {this.scrollTop = top; this.scrollLeft = left; } }

			PIXI.TextMetrics.wordWrap = function(text, style, canvas)
			{
				if (canvas == null) {
					canvas = PIXI.TextMetrics._canvas;
				}

				const context = canvas.getContext('2d');

				let width = 0;
				let line = '';
				let lines = '';

				const cache = {};
				const wordSpacing = style.wordSpacing || 0;
				const letterSpacing = style.letterSpacing;
				const whiteSpace = style.whiteSpace;

				// How to handle whitespaces
				const collapseSpaces = PIXI.TextMetrics.collapseSpaces(whiteSpace);
				const collapseNewlines = PIXI.TextMetrics.collapseNewlines(whiteSpace);

				// whether or not spaces may be added to the beginning of lines
				let canPrependSpaces = !collapseSpaces;

				// There is letterSpacing after every char except the last one
				// t_h_i_s_' '_i_s_' '_a_n_' '_e_x_a_m_p_l_e_' '_!
				// so for convenience the above needs to be compared to width + 1 extra letterSpace
				// t_h_i_s_' '_i_s_' '_a_n_' '_e_x_a_m_p_l_e_' '_!_
				// ________________________________________________
				// And then the final space is simply no appended to each line
				const wordWrapWidth = style.wordWrapWidth + letterSpacing;

				// break text into words, spaces and newline chars
				const tokens = PIXI.TextMetrics.tokenize(text);

				for (let i = 0; i < tokens.length; i++)
				{
					// get the word, space or newlineChar
					let token = tokens[i];

					// if word is a new line
					if (PIXI.TextMetrics.isNewline(token))
					{
						// keep the new line
						if (!collapseNewlines)
						{
							lines += PIXI.TextMetrics.addLine(line);
							canPrependSpaces = !collapseSpaces;
							line = '';
							width = 0;
							continue;
						}

						// if we should collapse new lines
						// we simply convert it into a space
						token = ' ';
					}

					// if we should collapse repeated whitespaces
					if (collapseSpaces)
					{
						// check both this and the last tokens for spaces
						const currIsBreakingSpace = PIXI.TextMetrics.isBreakingSpace(token);
						const lastIsBreakingSpace = PIXI.TextMetrics.isBreakingSpace(line[line.length - 1]);

						if (currIsBreakingSpace && lastIsBreakingSpace)
						{
							continue;
						}
					}

					// get word width from cache if possible
					const tokenWidth = PIXI.TextMetrics.getFromCache(token, letterSpacing, cache, context, style);

					// word is longer than desired bounds
					if (tokenWidth > wordWrapWidth)
					{
						// if we are not already at the beginning of a line
						if (line !== '')
						{
							// start newlines for overflow words
							lines += PIXI.TextMetrics.addLine(line);
							line = '';
							width = 0;
						}

						// break large word over multiple lines
						if (PIXI.TextMetrics.canBreakWords(token, style.breakWords))
						{
							// break word into characters
							const characters = token.split('');

							// loop the characters
							for (let j = 0; j < characters.length; j++)
							{
								let char = characters[j];

								let k = 1;
								// we are not at the end of the token

								while (characters[j + k])
								{
									const nextChar = characters[j + k];
									const lastChar = char[char.length - 1];

									// should not split chars
									if (!PIXI.TextMetrics.canBreakChars(lastChar, nextChar, token, j, style.breakWords))
									{
										// combine chars & move forward one
										char += nextChar;
									}
									else
									{
										break;
									}

									k++;
								}

								j += char.length - 1;

								const characterWidth = PIXI.TextMetrics.getFromCache(char, letterSpacing, cache, context, style);

								if (characterWidth + width > wordWrapWidth)
								{
									lines += PIXI.TextMetrics.addLine(line);
									canPrependSpaces = false;
									line = '';
									width = 0;
								}

								line += char;
								width += characterWidth;
							}
						}

						// run word out of the bounds
						else
						{
						// if there are words in this line already
							// finish that line and start a new one
							if (line.length > 0)
							{
								lines += PIXI.TextMetrics.addLine(line);
								line = '';
								width = 0;
							}

							const isLastToken = i === tokens.length - 1;

							// give it its own line if it's not the end
							lines += PIXI.TextMetrics.addLine(token, !isLastToken);
							canPrependSpaces = false;
							line = '';
							width = 0;
						}
					}

					// word could fit
					else
					{
						// word won't fit because of existing words
						// start a new line
						if (tokenWidth + width > wordWrapWidth)
						{
							// if its a space we don't want it
							canPrependSpaces = false;

							// add a new line
							lines += PIXI.TextMetrics.addLine(line);

							// start a new line
							line = '';
							width = 0;
						}

						// don't add spaces to the beginning of lines
						if (line.length > 0 || !PIXI.TextMetrics.isBreakingSpace(token) || canPrependSpaces)
						{
							// add the word to the current line
							line += token;

							// update width counter
							width += tokenWidth + (token != ' ' ? wordSpacing : 0.0);
						}
					}
				}

				lines += PIXI.TextMetrics.addLine(line, false);

				return lines;
			}

			PIXI.TextMetrics.getFromCache = function(key, letterSpacing, cache, context, style)
			{
				let width = cache[key];

				if (width === undefined)
				{
					const spacing = ((key.length) * letterSpacing);
					let widthMulti = Platform.isIE ? 100 : 1;
					let widthContext = context;

					if (Platform.isIE) {
						// In IE, CanvasRenderingContext2D measure text with integer preceision
						// it leads to cumulative errors in flow
						// for example, if we counts width of words in the line
						let widthCanvas = PIXI.TextMetrics._widthCanvas;
						if (typeof widthCanvas === 'undefined') {
							PIXI.TextMetrics._widthCanvas = document.createElement('canvas');
							widthCanvas = PIXI.TextMetrics._widthCanvas;
						}
						let clonedStyle = style.clone();
						clonedStyle.fontSize *= widthMulti;
						widthContext = widthCanvas.getContext('2d');
						widthContext.font = clonedStyle.toFontString();
					}

					width = widthContext.measureText(key).width / widthMulti + spacing;
					cache[key] = width;
				}

				return width;
			}

			var nativeSetProperty = CSSStyleDeclaration.prototype.setProperty;

			CSSStyleDeclaration.prototype.setProperty = function(propertyName, value, priority) {
				RenderSupport.checkUserStyleChanged();
				nativeSetProperty.call(this, propertyName, value, priority);
			}

			PIXI.TextMetrics.measureText = function(text, style, wordWrap, canvas)
			{
				canvas = typeof canvas !== 'undefined' ? canvas : PIXI.TextMetrics._canvas;

				wordWrap = (wordWrap === undefined || wordWrap === null) ? style.wordWrap : wordWrap;
				const font = style.toFontString();
				const fontProperties = PIXI.TextMetrics.measureFont(font);

				// fallback in case UA disallow canvas data extraction
				// (toDataURI, getImageData functions)
				if (fontProperties.fontSize === 0)
				{
					fontProperties.fontSize = style.fontSize;
					fontProperties.ascent = style.fontSize;
				}

				const context = canvas.getContext('2d');
				context.font = font;
				let widthContext = context;

				let widthMulti = Platform.isIE ? 100 : 1;
				if (Platform.isIE) {
					// In IE, CanvasRenderingContext2D measure text with integer preceision
					// it leads to cumulative errors in flow
					// for example, if we counts width of words in the line
					let widthCanvas = PIXI.TextMetrics._widthCanvas;
					if (typeof widthCanvas === 'undefined') {
						PIXI.TextMetrics._widthCanvas = document.createElement('canvas');
						widthCanvas = PIXI.TextMetrics._widthCanvas;
					}
					let clonedStyle = style.clone();
					clonedStyle.fontSize *= widthMulti;
					widthContext = widthCanvas.getContext('2d');
					widthContext.font = clonedStyle.toFontString();
				} else if (Platform.isSamsung) {
					const defaultFontSize = 16;
					const currentFontSize = parseInt(window.getComputedStyle(document.body).getPropertyValue('font-size'));
					const fontScale = currentFontSize / defaultFontSize;
					const scaledFontSize = style.fontSize * fontScale;
					fontProperties.fontSize = fontProperties.ascent = scaledFontSize;

					let contextFontSize = /[\d\.]+px/.exec(widthContext.font);
					if (contextFontSize) {
						contextFontSize = parseFloat(contextFontSize[0]);
						if (contextFontSize) {
							widthMulti = contextFontSize / scaledFontSize;
						}
					}
				}

				const outputText = wordWrap ? PIXI.TextMetrics.wordWrap(text, style, canvas) : text;
				const lines = outputText.split(/(?:\r\n|\r|\n)/);
				const lineWidths = new Array(lines.length);
				let maxLineWidth = 0;

				for (let i = 0; i < lines.length; i++)
				{
					let lineWidth;
					lineWidth = widthContext.measureText(lines[i]).width / widthMulti;
					// Super-specific bug in Safari : when it measures full string, which contains 'T ' combination, it returns a little shorter width than
					// the sum of words separately
					if (Platform.isSafari && lines[i].includes('T ')) {
						lineWidth += 0.3
					}
					lineWidth += (lines[i].length - 1) * style.letterSpacing + (style.wordSpacing ? style.wordSpacing * (lines[i].split(/[\s]+/).length - 1) : 0.0);

					lineWidths[i] = lineWidth;
					maxLineWidth = Math.max(maxLineWidth, lineWidth);
				}
				let width = maxLineWidth + style.strokeThickness;

				if (style.dropShadow)
				{
					width += style.dropShadowDistance;
				}

				const lineHeight = style.lineHeight || fontProperties.fontSize + style.strokeThickness;
				let height = Math.max(lineHeight, fontProperties.fontSize + style.strokeThickness)
					+ ((lines.length - 1) * (lineHeight + style.leading));

				if (style.dropShadow)
				{
					height += style.dropShadowDistance;
				}

				return new PIXI.TextMetrics(
					text,
					style,
					width,
					height,
					lines,
					lineWidths,
					lineHeight + style.leading,
					maxLineWidth,
					fontProperties
				);
			}

			PIXI.TextMetrics.measureFont = function(font, fontSize)
			{
				// as this method is used for preparing assets, don't recalculate things if we don't need to
				if (PIXI.TextMetrics._fonts[font])
				{
					return PIXI.TextMetrics._fonts[font];
				}

				const properties = {};

				const canvas = PIXI.TextMetrics._canvas;
				const context = PIXI.TextMetrics._context;

				context.font = font;

				const metricsString = PIXI.TextMetrics.METRICS_STRING + PIXI.TextMetrics.BASELINE_SYMBOL;
				const width = Math.ceil(context.measureText(metricsString).width);
				var baseline = Math.ceil(context.measureText(PIXI.TextMetrics.BASELINE_SYMBOL).width) * 2;
				const height = 2 * baseline;

				baseline = baseline * PIXI.TextMetrics.BASELINE_MULTIPLIER | 0;

				canvas.width = width;
				canvas.height = height;

				context.fillStyle = '#f00';
				context.fillRect(0, 0, width, height);

				context.font = font;

				context.textBaseline = 'alphabetic';
				context.fillStyle = '#000';
				context.fillText(metricsString, 0, baseline);

				var imagedata = context.getImageData(0, 0, width, height).data;
				var pixels = imagedata.length;
				var line = width * 4;

				var i = 0;
				var idx = 0;
				var stop = false;

				// Some OS (like MacOS) and video adapters renders font with more or less blureness
				// this check helps to minimize the impact of blureness (which leads to difference in measured sizes and baselines)
				// Note: we found that for small fonts like 9 and lower, we should use strict check because bold and normal fonts measured wrong
				const checkBlureness = typeof RenderSupport !== 'undefined' && RenderSupport.RendererType === 'canvas' || (typeof fontSize !== 'undefined' && fontSize <= 10);
				// ascent. scan from top to bottom until we find a non red pixel
				for (i = 0; i < baseline; ++i)
				{
					for (var j = 0; j < line; j += 4)
					{
						if (checkBlureness ? imagedata[idx + j] !== 255 : imagedata[idx + j] <= 150)
						{
							stop = true;
							break;
						}
					}
					if (!stop)
					{
						idx += line;
					}
					else
					{
						break;
					}
				}

				properties.ascent = baseline - i;

				idx = pixels - line;
				stop = false;

				// descent. scan from bottom to top until we find a non red pixel
				for (i = height; i > baseline; --i)
				{
					for (var j = 0; j < line; j += 4)
					{
						if (checkBlureness ? imagedata[idx + j] !== 255 : imagedata[idx + j] <= 150)
						{
							stop = true;
							break;
						}
					}

					if (!stop)
					{
						idx -= line;
					}
					else
					{
						break;
					}
				}

				properties.descent = i - baseline;
				properties.fontSize = properties.ascent + properties.descent;

				PIXI.TextMetrics._fonts[font] = properties;

				return properties;
			};

			PIXI.Text.prototype.drawLetterSpacing = function(text, x, y)
			{
				var isStroke = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

				const style = this._style;

				// letterSpacing of 0 means normal
				// Skip directional chars
				const letterSpacing = style.letterSpacing;

				if (letterSpacing === 0)
				{
					if (isStroke)
					{
						this.context.strokeText(text, x, y);
					}
					else
					{
						this.context.fillText(text, x, y);
					}

					return;
				}

				var currentPosition = x;
				var allWidth = this.context.measureText(text).width;
				var char, tailWidth, charWidth;

				do {
					char = text.substr(0, 1);
					text = text.substr(1);

					if (isStroke) {
						this.context.strokeText(char, currentPosition, y);
					} else {
						this.context.fillText(char, currentPosition, y);
					}

					if (text == '')
						tailWidth = 0;
					else
						tailWidth = this.context.measureText(text).width;


					charWidth = allWidth - tailWidth;

					currentPosition += charWidth +
						((char.charCodeAt(0) === 0x202A || char.charCodeAt(0) === 0x202B || char.charCodeAt(0) === 0x202C) ? 0.0 : letterSpacing);
					allWidth = tailWidth;
				} while (text != '');
			}

			PIXI.Text.prototype._renderCanvas = function(renderer)
			{
				const scaleX = this.worldTransform.a;
				const scaleY = this.worldTransform.d;
				const scaleFactor = Math.min(scaleX, scaleY) * renderer.resolution * this.style.resolution;
				const fontSize = scaleFactor * this.style.fontSize;
				const scaleText = fontSize > 0.6 && scaleFactor != 1.0;

				const tempRoundPixels = renderer.roundPixels;
				renderer.roundPixels = renderer.resolution === this.style.resolution;

				if (scaleText) {
					this.worldTransform.a = scaleX / scaleFactor;
					this.worldTransform.d = scaleY / scaleFactor;

					const tempFontSize = this.style.fontSize;
					const tempLetterSpacing = this.style.letterSpacing;
					const tempLineHeight = this.style.lineHeight;
					const tempWordWrapWidth = this.style.wordWrapWidth;
					const tempStrokeThickness = this.style.strokeThickness;
					const tempDropShadowDistance = this.style.dropShadowDistance;
					const tempLeading = this.style.leading;

					this.style.scaleFactor = scaleFactor;
					this.style.fontSize = fontSize;
					this.style.letterSpacing = this.style.letterSpacing * scaleFactor;
					this.style.lineHeight = this.style.lineHeight * scaleFactor;
					this.style.wordWrapWidth = this.style.wordWrapWidth * scaleFactor;
					this.style.strokeThickness = this.style.strokeThickness * scaleFactor;
					this.style.dropShadowDistance = this.style.dropShadowDistance * scaleFactor;
					this.style.leading = this.style.leading * scaleFactor;
					this.style.fontString = this.style.toFontString();

					if (!PIXI.TextMetrics._fonts[this.style.fontString])
					{
						PIXI.TextMetrics._fonts[this.style.fontString] = {
							fontSize : this.style.fontProperties.fontSize * scaleFactor,
							ascent : this.style.fontProperties.ascent * scaleFactor,
							descent : this.style.fontProperties.descent * scaleFactor
						};
					}

					PIXI.Text.prototype.updateText.call(this, true);
					PIXI.Sprite.prototype._renderCanvas.call(this, renderer);

					this.style.fontSize = tempFontSize;
					this.style.letterSpacing = tempLetterSpacing;
					this.style.lineHeight = tempLineHeight;
					this.style.wordWrapWidth = tempWordWrapWidth;
					this.style.strokeThickness = tempStrokeThickness;
					this.style.dropShadowDistance = tempDropShadowDistance;
					this.style.leading = tempLeading;

					this.worldTransform.a = scaleX;
					this.worldTransform.d = scaleY;
				} else {
					PIXI.Text.prototype.updateText.call(this, true);
					PIXI.Sprite.prototype._renderCanvas.call(this, renderer);
				}

				renderer.roundPixels = tempRoundPixels;
			}

			Object.defineProperty(PIXI.DisplayObject.prototype, 'worldVisible', {
				get : function() {
					return this.clipVisible;
				}
			});

			Object.defineProperty(PIXI.DisplayObject.prototype, 'parent', {
				set : function(p) {
					this._parent = p;

					if (p == null) {
						this.worldTransformChanged = false;
					} else if (this.cacheAsBitmap) {
						DisplayObjectHelper.invalidateTransform(this, 'parent');
					}
				},
				get : function() {
					return this._parent;
				}
			});

			PIXI.Container.prototype.updateTransform = function() {
				if (this.parent.worldTransformChanged) {
					this.parent.updateTransform();
				} else {
					this.transformChanged = false;

					if (this.graphicsChanged) {
						this.updateNativeWidgetGraphicsData();
					}

					if (this.worldTransformChanged)
					{
						this.worldTransformChanged = false;
						this._boundsId++;
						this.transform.updateTransform(this.parent.transform);
						this.worldAlpha = this.alpha * this.parent.worldAlpha;

						for (var i = 0, j = this.children.length; i < j; ++i) {
							const child = this.children[i];

							if (child.transformChanged || child.keepNativeWidgetChildren) {
								child.updateTransform();
							}
						}

						this.emit('transformchanged');

						if (RenderSupport.RendererType != 'html' && !this.isHTML) {
							if (this.accessWidget) {
								this.accessWidget.updateTransform();
							}
						}
					} else for (var i = 0, j = this.children.length; i < j; ++i) {
						const child = this.children[i];

						if (child.transformChanged || child.keepNativeWidgetChildren) {
							child.updateTransform();
						}
					}

					if ((RenderSupport.RendererType == 'html' || this.isHTML) && this.localTransformChanged) {
						this.localTransformChanged = false;

						if (this.isNativeWidget && this.parentClip) {
							DisplayObjectHelper.updateNativeWidget(this);
						}
					} else {
						this.localTransformChanged = false;
					}
				}
			};

			TextClip.prototype.updateTransform = function() {
				if (this.parent.worldTransformChanged) {
					this.parent.updateTransform();
				} else {
					this.transformChanged = false;

					if (this.worldTransformChanged)
					{
						this.worldTransformChanged = false;
						this._boundsId++;
						this.transform.updateTransform(this.parent.transform);
						this.worldAlpha = this.alpha * this.parent.worldAlpha;

						if (RenderSupport.RendererType == 'html' || this.isHTML) {
							if (RenderSupport.LayoutText || this.isCanvas) {
								this.textClipChanged = true;
								this.layoutText();
							} else if (this.children.length > 0) {
								for (var i = 0, j = this.children.length; i < j; ++i) {
									this.removeChild(this.children[i]);
								}

								this.textClip = null;
								this.background = null;
							}
						} else {
							this.layoutText();
						}

						for (var i = 0, j = this.children.length; i < j; ++i) {
							const child = this.children[i];

							if (child.transformChanged) {
								child.updateTransform();
							}
						}

						if (RenderSupport.RendererType != 'html' && !this.isHTML) {
							if (this.accessWidget) {
								this.accessWidget.updateTransform();
							}
						}

						this.emit('transformchanged');
					} else for (var i = 0, j = this.children.length; i < j; ++i) {
						const child = this.children[i];

						if (child.transformChanged) {
							child.updateTransform();
						}
					}

					if ((RenderSupport.RendererType == 'html' || this.isHTML) && (this.localTransformChanged || this.keepNativeWidgetChildren)) {
						this.localTransformChanged = false;

						if (this.isNativeWidget && this.parentClip) {
							DisplayObjectHelper.updateNativeWidget(this);
						}
					} else {
						this.localTransformChanged = false;
					}
				}
			};
		;
};
Math.__name__ = true;
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
Std.parseInt = function(x) {
	if(x != null) {
		var _g = 0;
		var _g1 = x.length;
		while(_g < _g1) {
			var i = _g++;
			var c = x.charCodeAt(i);
			if(c <= 8 || c >= 14 && c != 32 && c != 45) {
				var nc = x.charCodeAt(i + 1);
				var v = parseInt(x,nc == 120 || nc == 88 ? 16 : 10);
				if(isNaN(v)) {
					return null;
				} else {
					return v;
				}
			}
		}
	}
	return null;
};
var js_Boot = function() { };
js_Boot.__name__ = true;
js_Boot.getClass = function(o) {
	if(o == null) {
		return null;
	} else if(((o) instanceof Array)) {
		return Array;
	} else {
		var cl = o.__class__;
		if(cl != null) {
			return cl;
		}
		var name = js_Boot.__nativeClassName(o);
		if(name != null) {
			return js_Boot.__resolveNativeClass(name);
		}
		return null;
	}
};
js_Boot.__string_rec = function(o,s) {
	if(o == null) {
		return "null";
	}
	if(s.length >= 5) {
		return "<...>";
	}
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) {
		t = "object";
	}
	switch(t) {
	case "function":
		return "<function>";
	case "object":
		if(o.__enum__) {
			var e = $hxEnums[o.__enum__];
			var con = e.__constructs__[o._hx_index];
			var n = con._hx_name;
			if(con.__params__) {
				s = s + "\t";
				return n + "(" + ((function($this) {
					var $r;
					var _g = [];
					{
						var _g1 = 0;
						var _g2 = con.__params__;
						while(true) {
							if(!(_g1 < _g2.length)) {
								break;
							}
							var p = _g2[_g1];
							_g1 = _g1 + 1;
							_g.push(js_Boot.__string_rec(o[p],s));
						}
					}
					$r = _g;
					return $r;
				}(this))).join(",") + ")";
			} else {
				return n;
			}
		}
		if(((o) instanceof Array)) {
			var str = "[";
			s += "\t";
			var _g = 0;
			var _g1 = o.length;
			while(_g < _g1) {
				var i = _g++;
				str += (i > 0 ? "," : "") + js_Boot.__string_rec(o[i],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( _g ) {
			haxe_NativeStackTrace.lastError = _g;
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") {
				return s2;
			}
		}
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		var k = null;
		for( k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) {
			str += ", \n";
		}
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "string":
		return o;
	default:
		return String(o);
	}
};
js_Boot.__interfLoop = function(cc,cl) {
	if(cc == null) {
		return false;
	}
	if(cc == cl) {
		return true;
	}
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g = 0;
		var _g1 = intf.length;
		while(_g < _g1) {
			var i = _g++;
			var i1 = intf[i];
			if(i1 == cl || js_Boot.__interfLoop(i1,cl)) {
				return true;
			}
		}
	}
	return js_Boot.__interfLoop(cc.__super__,cl);
};
js_Boot.__instanceof = function(o,cl) {
	if(cl == null) {
		return false;
	}
	switch(cl) {
	case Array:
		return ((o) instanceof Array);
	case Bool:
		return typeof(o) == "boolean";
	case Dynamic:
		return o != null;
	case Float:
		return typeof(o) == "number";
	case Int:
		if(typeof(o) == "number") {
			return ((o | 0) === o);
		} else {
			return false;
		}
		break;
	case String:
		return typeof(o) == "string";
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(js_Boot.__downcastCheck(o,cl)) {
					return true;
				}
			} else if(typeof(cl) == "object" && js_Boot.__isNativeObj(cl)) {
				if(((o) instanceof cl)) {
					return true;
				}
			}
		} else {
			return false;
		}
		if(cl == Class ? o.__name__ != null : false) {
			return true;
		}
		if(cl == Enum ? o.__ename__ != null : false) {
			return true;
		}
		return o.__enum__ != null ? $hxEnums[o.__enum__] == cl : false;
	}
};
js_Boot.__downcastCheck = function(o,cl) {
	if(!((o) instanceof cl)) {
		if(cl.__isInterface__) {
			return js_Boot.__interfLoop(js_Boot.getClass(o),cl);
		} else {
			return false;
		}
	} else {
		return true;
	}
};
js_Boot.__cast = function(o,t) {
	if(o == null || js_Boot.__instanceof(o,t)) {
		return o;
	} else {
		throw haxe_Exception.thrown("Cannot cast " + Std.string(o) + " to " + Std.string(t));
	}
};
js_Boot.__nativeClassName = function(o) {
	var name = js_Boot.__toStr.call(o).slice(8,-1);
	if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") {
		return null;
	}
	return name;
};
js_Boot.__isNativeObj = function(o) {
	return js_Boot.__nativeClassName(o) != null;
};
js_Boot.__resolveNativeClass = function(name) {
	return $global[name];
};
var haxe_CallStack = {};
haxe_CallStack.callStack = function() {
	return haxe_NativeStackTrace.toHaxe(haxe_NativeStackTrace.callStack());
};
haxe_CallStack.exceptionStack = function(fullStack) {
	if(fullStack == null) {
		fullStack = false;
	}
	var eStack = haxe_NativeStackTrace.toHaxe(haxe_NativeStackTrace.exceptionStack());
	return fullStack ? eStack : haxe_CallStack.subtract(eStack,haxe_CallStack.callStack());
};
haxe_CallStack.toString = function(stack) {
	var b = new StringBuf();
	var _g = 0;
	var _g1 = stack;
	while(_g < _g1.length) {
		var s = _g1[_g];
		++_g;
		b.b += "\nCalled from ";
		haxe_CallStack.itemToString(b,s);
	}
	return b.b;
};
haxe_CallStack.subtract = function(this1,stack) {
	var startIndex = -1;
	var i = -1;
	while(++i < this1.length) {
		var _g = 0;
		var _g1 = stack.length;
		while(_g < _g1) {
			var j = _g++;
			if(haxe_CallStack.equalItems(this1[i],stack[j])) {
				if(startIndex < 0) {
					startIndex = i;
				}
				++i;
				if(i >= this1.length) {
					break;
				}
			} else {
				startIndex = -1;
			}
		}
		if(startIndex >= 0) {
			break;
		}
	}
	if(startIndex >= 0) {
		return this1.slice(0,startIndex);
	} else {
		return this1;
	}
};
haxe_CallStack.equalItems = function(item1,item2) {
	if(item1 == null) {
		if(item2 == null) {
			return true;
		} else {
			return false;
		}
	} else {
		switch(item1._hx_index) {
		case 0:
			if(item2 == null) {
				return false;
			} else if(item2._hx_index == 0) {
				return true;
			} else {
				return false;
			}
			break;
		case 1:
			if(item2 == null) {
				return false;
			} else if(item2._hx_index == 1) {
				var m2 = item2.m;
				var m1 = item1.m;
				return m1 == m2;
			} else {
				return false;
			}
			break;
		case 2:
			if(item2 == null) {
				return false;
			} else if(item2._hx_index == 2) {
				var item21 = item2.s;
				var file2 = item2.file;
				var line2 = item2.line;
				var col2 = item2.column;
				var col1 = item1.column;
				var line1 = item1.line;
				var file1 = item1.file;
				var item11 = item1.s;
				if(file1 == file2 && line1 == line2 && col1 == col2) {
					return haxe_CallStack.equalItems(item11,item21);
				} else {
					return false;
				}
			} else {
				return false;
			}
			break;
		case 3:
			if(item2 == null) {
				return false;
			} else if(item2._hx_index == 3) {
				var class2 = item2.classname;
				var method2 = item2.method;
				var method1 = item1.method;
				var class1 = item1.classname;
				if(class1 == class2) {
					return method1 == method2;
				} else {
					return false;
				}
			} else {
				return false;
			}
			break;
		case 4:
			if(item2 == null) {
				return false;
			} else if(item2._hx_index == 4) {
				var v2 = item2.v;
				var v1 = item1.v;
				return v1 == v2;
			} else {
				return false;
			}
			break;
		}
	}
};
haxe_CallStack.itemToString = function(b,s) {
	switch(s._hx_index) {
	case 0:
		b.b += "a C function";
		break;
	case 1:
		var m = s.m;
		b.b += "module ";
		b.b += m == null ? "null" : "" + m;
		break;
	case 2:
		var s1 = s.s;
		var file = s.file;
		var line = s.line;
		var col = s.column;
		if(s1 != null) {
			haxe_CallStack.itemToString(b,s1);
			b.b += " (";
		}
		b.b += file == null ? "null" : "" + file;
		b.b += " line ";
		b.b += line == null ? "null" : "" + line;
		if(col != null) {
			b.b += " column ";
			b.b += col == null ? "null" : "" + col;
		}
		if(s1 != null) {
			b.b += ")";
		}
		break;
	case 3:
		var cname = s.classname;
		var meth = s.method;
		b.b += Std.string(cname == null ? "<unknown>" : cname);
		b.b += ".";
		b.b += meth == null ? "null" : "" + meth;
		break;
	case 4:
		var n = s.v;
		b.b += "local function #";
		b.b += n == null ? "null" : "" + n;
		break;
	}
};
var haxe_NativeStackTrace = function() { };
haxe_NativeStackTrace.__name__ = true;
haxe_NativeStackTrace.saveStack = function(e) {
	haxe_NativeStackTrace.lastError = e;
};
haxe_NativeStackTrace.callStack = function() {
	var e = new Error("");
	var stack = haxe_NativeStackTrace.tryHaxeStack(e);
	if(typeof(stack) == "undefined") {
		try {
			throw e;
		} catch( _g ) {
		}
		stack = e.stack;
	}
	return haxe_NativeStackTrace.normalize(stack,2);
};
haxe_NativeStackTrace.exceptionStack = function() {
	return haxe_NativeStackTrace.normalize(haxe_NativeStackTrace.tryHaxeStack(haxe_NativeStackTrace.lastError));
};
haxe_NativeStackTrace.toHaxe = function(s,skip) {
	if(skip == null) {
		skip = 0;
	}
	if(s == null) {
		return [];
	} else if(typeof(s) == "string") {
		var stack = s.split("\n");
		if(stack[0] == "Error") {
			stack.shift();
		}
		var m = [];
		var _g = 0;
		var _g1 = stack.length;
		while(_g < _g1) {
			var i = _g++;
			if(skip > i) {
				continue;
			}
			var line = stack[i];
			var matched = line.match(/^    at ([A-Za-z0-9_. ]+) \(([^)]+):([0-9]+):([0-9]+)\)$/);
			if(matched != null) {
				var path = matched[1].split(".");
				if(path[0] == "$hxClasses") {
					path.shift();
				}
				var meth = path.pop();
				var file = matched[2];
				var line1 = Std.parseInt(matched[3]);
				var column = Std.parseInt(matched[4]);
				m.push(haxe_StackItem.FilePos(meth == "Anonymous function" ? haxe_StackItem.LocalFunction() : meth == "Global code" ? null : haxe_StackItem.Method(path.join("."),meth),file,line1,column));
			} else {
				m.push(haxe_StackItem.Module(StringTools.trim(line)));
			}
		}
		return m;
	} else if(skip > 0 && Array.isArray(s)) {
		return s.slice(skip);
	} else {
		return s;
	}
};
haxe_NativeStackTrace.tryHaxeStack = function(e) {
	if(e == null) {
		return [];
	}
	var oldValue = Error.prepareStackTrace;
	Error.prepareStackTrace = haxe_NativeStackTrace.prepareHxStackTrace;
	var stack = e.stack;
	Error.prepareStackTrace = oldValue;
	return stack;
};
haxe_NativeStackTrace.prepareHxStackTrace = function(e,callsites) {
	var stack = [];
	var _g = 0;
	while(_g < callsites.length) {
		var site = callsites[_g];
		++_g;
		if(haxe_NativeStackTrace.wrapCallSite != null) {
			site = haxe_NativeStackTrace.wrapCallSite(site);
		}
		var method = null;
		var fullName = site.getFunctionName();
		if(fullName != null) {
			var idx = fullName.lastIndexOf(".");
			if(idx >= 0) {
				var className = fullName.substring(0,idx);
				var methodName = fullName.substring(idx + 1);
				method = haxe_StackItem.Method(className,methodName);
			} else {
				method = haxe_StackItem.Method(null,fullName);
			}
		}
		var fileName = site.getFileName();
		var fileAddr = fileName == null ? -1 : fileName.indexOf("file:");
		if(haxe_NativeStackTrace.wrapCallSite != null && fileAddr > 0) {
			fileName = fileName.substring(fileAddr + 6);
		}
		stack.push(haxe_StackItem.FilePos(method,fileName,site.getLineNumber(),site.getColumnNumber()));
	}
	return stack;
};
haxe_NativeStackTrace.normalize = function(stack,skipItems) {
	if(skipItems == null) {
		skipItems = 0;
	}
	if(Array.isArray(stack) && skipItems > 0) {
		return stack.slice(skipItems);
	} else if(typeof(stack) == "string") {
		switch(stack.substring(0,6)) {
		case "Error\n":case "Error:":
			++skipItems;
			break;
		default:
		}
		return haxe_NativeStackTrace.skipLines(stack,skipItems);
	} else {
		return stack;
	}
};
haxe_NativeStackTrace.skipLines = function(stack,skip,pos) {
	if(pos == null) {
		pos = 0;
	}
	if(skip > 0) {
		pos = stack.indexOf("\n",pos);
		if(pos < 0) {
			return "";
		} else {
			return haxe_NativeStackTrace.skipLines(stack,--skip,pos + 1);
		}
	} else {
		return stack.substring(pos);
	}
};
var haxe_StackItem = $hxEnums["haxe.StackItem"] = { __ename__:true,__constructs__:null
	,CFunction: {_hx_name:"CFunction",_hx_index:0,__enum__:"haxe.StackItem",toString:$estr}
	,Module: ($_=function(m) { return {_hx_index:1,m:m,__enum__:"haxe.StackItem",toString:$estr}; },$_._hx_name="Module",$_.__params__ = ["m"],$_)
	,FilePos: ($_=function(s,file,line,column) { return {_hx_index:2,s:s,file:file,line:line,column:column,__enum__:"haxe.StackItem",toString:$estr}; },$_._hx_name="FilePos",$_.__params__ = ["s","file","line","column"],$_)
	,Method: ($_=function(classname,method) { return {_hx_index:3,classname:classname,method:method,__enum__:"haxe.StackItem",toString:$estr}; },$_._hx_name="Method",$_.__params__ = ["classname","method"],$_)
	,LocalFunction: ($_=function(v) { return {_hx_index:4,v:v,__enum__:"haxe.StackItem",toString:$estr}; },$_._hx_name="LocalFunction",$_.__params__ = ["v"],$_)
};
haxe_StackItem.__constructs__ = [haxe_StackItem.CFunction,haxe_StackItem.Module,haxe_StackItem.FilePos,haxe_StackItem.Method,haxe_StackItem.LocalFunction];
var StringTools = function() { };
StringTools.__name__ = true;
StringTools.startsWith = function(s,start) {
	if(s.length >= start.length) {
		return s.lastIndexOf(start,0) == 0;
	} else {
		return false;
	}
};
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	if(slen >= elen) {
		return s.indexOf(end,slen - elen) == slen - elen;
	} else {
		return false;
	}
};
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	if(!(c > 8 && c < 14)) {
		return c == 32;
	} else {
		return true;
	}
};
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) ++r;
	if(r > 0) {
		return HxOverrides.substr(s,r,l - r);
	} else {
		return s;
	}
};
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) ++r;
	if(r > 0) {
		return HxOverrides.substr(s,0,l - r);
	} else {
		return s;
	}
};
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
};
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
};
var Reflect = function() { };
Reflect.__name__ = true;
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		return null;
	}
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) {
			a.push(f);
		}
		}
	}
	return a;
};
Reflect.isFunction = function(f) {
	if(typeof(f) == "function") {
		return !(f.__name__ || f.__ename__);
	} else {
		return false;
	}
};
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) {
		return true;
	}
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) {
		return false;
	}
	if(f1.scope == f2.scope && f1.method == f2.method) {
		return f1.method != null;
	} else {
		return false;
	}
};
Reflect.isObject = function(v) {
	if(v == null) {
		return false;
	}
	var t = typeof(v);
	if(!(t == "string" || t == "object" && v.__enum__ == null)) {
		if(t == "function") {
			return (v.__name__ || v.__ename__) != null;
		} else {
			return false;
		}
	} else {
		return true;
	}
};
Reflect.copy = function(o) {
	if(o == null) {
		return null;
	}
	var o2 = { };
	var _g = 0;
	var _g1 = Reflect.fields(o);
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		o2[f] = Reflect.field(o,f);
	}
	return o2;
};
var RuntimeType = $hxEnums["RuntimeType"] = { __ename__:true,__constructs__:null
	,RTVoid: {_hx_name:"RTVoid",_hx_index:0,__enum__:"RuntimeType",toString:$estr}
	,RTBool: {_hx_name:"RTBool",_hx_index:1,__enum__:"RuntimeType",toString:$estr}
	,RTInt: {_hx_name:"RTInt",_hx_index:2,__enum__:"RuntimeType",toString:$estr}
	,RTDouble: {_hx_name:"RTDouble",_hx_index:3,__enum__:"RuntimeType",toString:$estr}
	,RTString: {_hx_name:"RTString",_hx_index:4,__enum__:"RuntimeType",toString:$estr}
	,RTArray: ($_=function(type) { return {_hx_index:5,type:type,__enum__:"RuntimeType",toString:$estr}; },$_._hx_name="RTArray",$_.__params__ = ["type"],$_)
	,RTStruct: ($_=function(name) { return {_hx_index:6,name:name,__enum__:"RuntimeType",toString:$estr}; },$_._hx_name="RTStruct",$_.__params__ = ["name"],$_)
	,RTRefTo: ($_=function(type) { return {_hx_index:7,type:type,__enum__:"RuntimeType",toString:$estr}; },$_._hx_name="RTRefTo",$_.__params__ = ["type"],$_)
	,RTUnknown: {_hx_name:"RTUnknown",_hx_index:8,__enum__:"RuntimeType",toString:$estr}
};
RuntimeType.__constructs__ = [RuntimeType.RTVoid,RuntimeType.RTBool,RuntimeType.RTInt,RuntimeType.RTDouble,RuntimeType.RTString,RuntimeType.RTArray,RuntimeType.RTStruct,RuntimeType.RTRefTo,RuntimeType.RTUnknown];
var NativeTime = function() { };
NativeTime.__name__ = true;
NativeTime.timestamp = function() {
	var t = new Date().getTime();
	return t;
};
NativeTime.utc2local = function(stamp) {
	var date = new Date(stamp);
	var offset = date.getTimezoneOffset() * 60000.;
	return stamp - offset;
};
NativeTime.local2utc = function(stamp) {
	var date = new Date(stamp);
	var offset = date.getTimezoneOffset() * 60000.;
	date = new Date(date.getTime() + offset);
	offset = date.getTimezoneOffset() * 60000.;
	return stamp + offset;
};
NativeTime.getTimeOffset = function() {
	var now = new Date();
	now = new Date(now.getFullYear(),now.getMonth(),now.getDate(),0,0,0);
	return now.getTime() - 86400000. * Math.round(now.getTime() / 24 / 3600 / 1000);
};
NativeTime.string2time = function(date) {
	return HxOverrides.strDate(date).getTime();
};
NativeTime.time2string = function(date) {
	return HxOverrides.dateStr(new Date(date));
};
NativeTime.dayOfWeek = function(year,month,day) {
	var d = new Date(year,month - 1,day,0,0,0);
	return (d.getDay() + 6) % 7;
};
var ProgressiveWebTools = function() {
};
ProgressiveWebTools.__name__ = true;
ProgressiveWebTools.enableServiceWorkerCaching = function(swFilePath,callback) {
	if(navigator.serviceWorker) {
		navigator.serviceWorker.register(swFilePath).then(function(registration) {
			haxe_Log.trace("ServiceWorker registration successful with scope: ",{ fileName : "ProgressiveWebTools.hx", lineNumber : 29, className : "ProgressiveWebTools", methodName : "enableServiceWorkerCaching", customParams : [registration.scope]});
			ProgressiveWebTools.globalRegistration = registration;
			if(registration.active) {
				callback(true);
			} else {
				navigator.serviceWorker.oncontrollerchange = function(e) {
					callback(true);
				};
			}
		},function(err) {
			haxe_Log.trace("ServiceWorker registration failed: ",{ fileName : "ProgressiveWebTools.hx", lineNumber : 40, className : "ProgressiveWebTools", methodName : "enableServiceWorkerCaching", customParams : [err]});
			callback(false);
		});
	} else {
		callback(false);
		haxe_Log.trace("No ServiceWorker on this browser",{ fileName : "ProgressiveWebTools.hx", lineNumber : 45, className : "ProgressiveWebTools", methodName : "enableServiceWorkerCaching"});
	}
};
ProgressiveWebTools.subscribeOnServiceWorkerUpdateFound = function(onUpdateFound,onError) {
	if(ProgressiveWebTools.globalRegistration != null) {
		ProgressiveWebTools.globalRegistration.onupdatefound = function() {
			var installingWorker = ProgressiveWebTools.globalRegistration.installing;
			installingWorker.onstatechange = function() {
				if(installingWorker.state == "installed") {
					onUpdateFound();
				}
			};
		};
	} else {
		onError("ServiceWorker is not initialized");
	}
};
ProgressiveWebTools.disableServiceWorkerCaching = function(callback) {
	if(ProgressiveWebTools.globalRegistration != null) {
		ProgressiveWebTools.globalRegistration.unregister().then(function() {
			ProgressiveWebTools.globalRegistration = null;
			callback(true);
		},function(err) {
			callback(false);
		});
	}
};
ProgressiveWebTools.checkServiceWorkerEnabledOnly = function(callback) {
	if(ProgressiveWebTools.globalRegistration != null && navigator.serviceWorker) {
		callback(true);
	} else {
		callback(false);
	}
};
ProgressiveWebTools.checkServiceWorkerCachingEnabled = function(swFileName,callback) {
	if(ProgressiveWebTools.globalRegistration != null) {
		callback(true);
	} else if(navigator.serviceWorker) {
		navigator.serviceWorker.getRegistrations().then(function(registrations) {
			if(registrations.length == 0) {
				callback(false);
			} else if(registrations.filter(function(registration) {
				if(registration.active == null) {
					return false;
				}
				if(registration.active.scriptURL == registration.scope + swFileName) {
					ProgressiveWebTools.globalRegistration = registration;
					return true;
				} else {
					return false;
				}
			}).length > 0) {
				callback(true);
			} else {
				callback(false);
			}
		},function(err) {
			callback(false);
		});
	} else {
		callback(false);
		haxe_Log.trace("No ServiceWorker on this browser",{ fileName : "ProgressiveWebTools.hx", lineNumber : 127, className : "ProgressiveWebTools", methodName : "checkServiceWorkerCachingEnabled"});
	}
};
ProgressiveWebTools.addShortcutAvailableListener = function(callback) {
	var event = "beforeinstallprompt";
	var handler = function(e) {
		e.preventDefault();
		ProgressiveWebTools.globalInstallPrompt = e;
		callback();
	};
	window.addEventListener(event,handler);
	return function() {
		window.removeEventListener(event,handler);
	};
};
ProgressiveWebTools.installShortcut = function(callback) {
	if(ProgressiveWebTools.globalInstallPrompt == null) {
		Errors.warning("Progressive shortcut: You are not allowed to show install prompt until progressiveShortcutInstallAvailable listener fires.");
		return;
	}
	ProgressiveWebTools.globalInstallPrompt.prompt();
	ProgressiveWebTools.globalInstallPrompt.userChoice.then(function(choiceResult) {
		callback(choiceResult.outcome == "accepted");
		ProgressiveWebTools.globalInstallPrompt = null;
	});
};
ProgressiveWebTools.cleanServiceWorkerCache = function(callback) {
	if(navigator.serviceWorker && navigator.serviceWorker.controller) {
		var messageChannel = new MessageChannel();
		messageChannel.port1.onmessage = function(event) {
			if(event.data.error || event.data.status == null) {
				callback(false);
			} else if(event.data.status == "OK") {
				callback(true);
			} else {
				callback(false);
			}
		};
		navigator.serviceWorker.controller.postMessage({ "action" : "clean_cache_storage"},[messageChannel.port2]);
	} else {
		callback(false);
	}
};
ProgressiveWebTools.setServiceWorkerPreferCachedResources = function(prefer,callback) {
	if(navigator.serviceWorker && navigator.serviceWorker.controller) {
		var messageChannel = new MessageChannel();
		messageChannel.port1.onmessage = function(event) {
			if(event.data.error || event.data.status == null) {
				callback(false);
			} else if(event.data.status == "OK") {
				callback(true);
			} else {
				callback(false);
			}
		};
		navigator.serviceWorker.controller.postMessage({ "action" : "set_prefer_cached_resources", "data" : { "value" : prefer}},[messageChannel.port2]);
	} else {
		callback(false);
	}
};
ProgressiveWebTools.setServiceWorkerCacheStaticResources = function(cache,callback) {
	if(navigator.serviceWorker && navigator.serviceWorker.controller) {
		var messageChannel = new MessageChannel();
		messageChannel.port1.onmessage = function(event) {
			if(event.data.error || event.data.status == null) {
				callback(false);
			} else if(event.data.status == "OK") {
				callback(true);
			} else {
				callback(false);
			}
		};
		navigator.serviceWorker.controller.postMessage({ "action" : "set_cache_static_resources", "data" : { "value" : cache}},[messageChannel.port2]);
	} else {
		callback(false);
	}
};
ProgressiveWebTools.addServiceWorkerDynamicResourcesExtension = function(extension,callback) {
	if(navigator.serviceWorker && navigator.serviceWorker.controller) {
		var messageChannel = new MessageChannel();
		messageChannel.port1.onmessage = function(event) {
			if(event.data.error || event.data.status == null) {
				callback(false);
			} else if(event.data.status == "OK") {
				callback(true);
			} else {
				callback(false);
			}
		};
		navigator.serviceWorker.controller.postMessage({ "action" : "add_dynamic_resource_extension", "data" : { "value" : extension}},[messageChannel.port2]);
	} else {
		callback(false);
	}
};
ProgressiveWebTools.removeServiceWorkerDynamicResourcesExtension = function(extension,callback) {
	if(navigator.serviceWorker && navigator.serviceWorker.controller) {
		var messageChannel = new MessageChannel();
		messageChannel.port1.onmessage = function(event) {
			if(event.data.error || event.data.status == null) {
				callback(false);
			} else if(event.data.status == "OK") {
				callback(true);
			} else {
				callback(false);
			}
		};
		navigator.serviceWorker.controller.postMessage({ "action" : "remove_dynamic_resource_extension", "data" : { "value" : extension}},[messageChannel.port2]);
	} else {
		callback(false);
	}
};
ProgressiveWebTools.addRequestCacheFilterN = function(cacheIfUrlMatch,cacheIfMethodMatch,cacheIfParametersMatch,ignoreParameterKeysOnCache,onOK,onError) {
	if(navigator.serviceWorker && navigator.serviceWorker.controller) {
		var messageChannel = new MessageChannel();
		messageChannel.port1.onmessage = function(event) {
			if(event.data.error || event.data.status == null) {
				onError("ServiceWorker can't to add request filter");
			} else if(event.data.status == "OK") {
				onOK();
			} else {
				onError("ServiceWorker can't to add request filter");
			}
		};
		navigator.serviceWorker.controller.postMessage({ "action" : "requests_cache_filter", "data" : { "cacheIfUrlMatch" : cacheIfUrlMatch, "method" : cacheIfMethodMatch, "cacheIfParametersMatch" : cacheIfParametersMatch, "ignoreParameterKeysOnCache" : ignoreParameterKeysOnCache}},[messageChannel.port2]);
	} else {
		onError("ServiceWorker is not initialized");
	}
};
ProgressiveWebTools.pdfViewerEnabled = function(onOK,onError) {
	if(navigator.serviceWorker && navigator.serviceWorker.controller) {
		onOK(navigator && navigator.pdfViewerEnabled);
	} else {
		onError("ServiceWorker is not initialized");
	}
};
ProgressiveWebTools.addRequestSkipFilterN = function(skipIfUrlMatch,skipIfMethodMatch,skipIfHeaderMatch,onOK,onError) {
	if(navigator.serviceWorker && navigator.serviceWorker.controller) {
		var messageChannel = new MessageChannel();
		messageChannel.port1.onmessage = function(event) {
			if(event.data.error || event.data.status == null) {
				onError("ServiceWorker can't to add request filter");
			} else if(event.data.status == "OK") {
				onOK();
			} else {
				onError("ServiceWorker can't to add request filter");
			}
		};
		navigator.serviceWorker.controller.postMessage({ "action" : "requests_skip_filter", "data" : { "url" : skipIfUrlMatch, "method" : skipIfMethodMatch, "header" : skipIfHeaderMatch}},[messageChannel.port2]);
	} else {
		onError("ServiceWorker is not initialized");
	}
};
ProgressiveWebTools.loadAndCacheUrls = function(urls,ignoreParameterKeysOnCache,onOK,onError) {
	if(navigator.serviceWorker && navigator.serviceWorker.controller) {
		var messageChannel = new MessageChannel();
		messageChannel.port1.onmessage = function(event) {
			if(event.data.error || event.data.status == null) {
				onError("ServiceWorker can't execute one or more requests");
			} else if(event.data.status == "OK") {
				onOK();
			} else {
				onError("ServiceWorker can't execute one or more requests");
			}
		};
		navigator.serviceWorker.controller.postMessage({ "action" : "load_and_cache_urls", "data" : { "urls" : urls, "ignoreParameterKeysOnCache" : ignoreParameterKeysOnCache}},[messageChannel.port2]);
	} else {
		onError("ServiceWorker is not initialized");
	}
};
ProgressiveWebTools.checkUrlsInServiceWorkerCache = function(urls,onOK,onError) {
	if(navigator.serviceWorker && navigator.serviceWorker.controller) {
		var messageChannel = new MessageChannel();
		messageChannel.port1.onmessage = function(event) {
			if(event.data.error || event.data.status == null || event.data.urls == null) {
				onError("ServiceWorker can't return the cache state");
			} else if(event.data.status == "OK") {
				onOK(event.data.urls);
			} else {
				onError("ServiceWorker can't return the cache state");
			}
		};
		navigator.serviceWorker.controller.postMessage({ "action" : "check_urls_in_cache", "data" : { "urls" : urls}},[messageChannel.port2]);
	} else {
		onError("ServiceWorker is not initialized");
	}
};
ProgressiveWebTools.isRunningPWA = function() {
	if(window.matchMedia("(display-mode: browser)").matches) {
		if(Platform.isIOS) {
			return window.navigator.standalone == true;
		} else {
			return false;
		}
	} else {
		return true;
	}
};
ProgressiveWebTools.getServiceWorkerJsVersion = function(onOK,onError) {
	if(navigator.serviceWorker && navigator.serviceWorker.controller) {
		var messageChannel = new MessageChannel();
		messageChannel.port1.onmessage = function(event) {
			if(event.data.error || event.data.data == null) {
				onError("ServiceWorker can't execute one or more requests");
			} else {
				onOK(event.data.data);
			}
		};
		navigator.serviceWorker.controller.postMessage({ "action" : "get_service_worker_version"},[messageChannel.port2]);
	} else {
		onError("ServiceWorker is not initialized");
	}
};
ProgressiveWebTools.setUseOnlyCacheInOffline = function(enabled,onOK,onError) {
	if(navigator.serviceWorker && navigator.serviceWorker.controller) {
		var messageChannel = new MessageChannel();
		messageChannel.port1.onmessage = function(event) {
			if(event.data.error || event.data.status == null) {
				onError("ServiceWorker can't change the cache parameter");
			} else if(event.data.status == "OK") {
				onOK();
			} else {
				onError("ServiceWorker can't change the cache parameter");
			}
		};
		navigator.serviceWorker.controller.postMessage({ "action" : "set_use_cache_only_in_offline", "enabled" : enabled},[messageChannel.port2]);
	} else {
		onError("ServiceWorker is not initialized");
	}
};
ProgressiveWebTools.getServiceWorkerRequestsStatsN = function(onOK,onError) {
	if(navigator.serviceWorker && navigator.serviceWorker.controller) {
		var messageChannel = new MessageChannel();
		messageChannel.port1.onmessage = function(event) {
			if(event.data.error || event.data.data == null) {
				onError("ServiceWorker can't get requests stats");
			} else {
				onOK([event.data.data.fromNetwork,event.data.data.fromCache,event.data.data.skipped,event.data.data.failed]);
			}
		};
		navigator.serviceWorker.controller.postMessage({ "action" : "get_requests_stats"},[messageChannel.port2]);
	} else {
		onError("ServiceWorker is not initialized");
	}
};
ProgressiveWebTools.resetSwTimings = function(onOK,onError) {
	if(navigator.serviceWorker && navigator.serviceWorker.controller) {
		var messageChannel = new MessageChannel();
		messageChannel.port1.onmessage = function(event) {
			if(event.data.error || event.data.status == null) {
				onError("ServiceWorker can't reset the timmings");
			} else if(event.data.status == "OK") {
				onOK();
			} else {
				onError("ServiceWorker can't change the cache parameter");
			}
		};
		navigator.serviceWorker.controller.postMessage({ "action" : "reset_timings"},[messageChannel.port2]);
	} else {
		onError("ServiceWorker is not initialized");
	}
};
ProgressiveWebTools.getSwTimingsNative = function(onOK,onError) {
	if(navigator.serviceWorker && navigator.serviceWorker.controller) {
		var messageChannel = new MessageChannel();
		messageChannel.port1.onmessage = function(event) {
			if(event.data.error || event.data.data == null) {
				onError("ServiceWorker can't get requests stats");
			} else {
				onOK(event.data.data.map(function(row) {
					if(row.name == undefined) {
						row.name = "";
					}
					if(row.operation == undefined) {
						row.operation = "";
					}
					if(row.startTimestamp == undefined) {
						row.startTimestamp = "0";
					}
					if(row.duration == undefined) {
						row.duration = "-1";
					}
					return row.name + "\t" + row.operation + "\t" + row.startTimestamp + "\t" + row.duration + "\t" + row.steps.map(function(step) {
						return step.name + "\t" + step.time + "\t";
					}).join("");
				}));
			}
		};
		navigator.serviceWorker.controller.postMessage({ "action" : "get_timings"},[messageChannel.port2]);
	} else {
		onError("ServiceWorker is not initialized");
	}
};
ProgressiveWebTools.getSwTimingsFilterConsoleNative = function(files,operations) {
	if(navigator.serviceWorker && navigator.serviceWorker.controller) {
		var messageChannel = new MessageChannel();
		messageChannel.port1.onmessage = function(event) {
			if(event.data.error || event.data.data == null) {
				haxe_Log.trace("ServiceWorker can't get requests stats",{ fileName : "ProgressiveWebTools.hx", lineNumber : 623, className : "ProgressiveWebTools", methodName : "getSwTimingsFilterConsoleNative"});
			} else {
				haxe_Log.trace("\nfilename - operation - timestamp (msec) - duration (msec):\n" + event.data.data.map(function(row) {
					if(row.name == undefined) {
						row.name = "";
					}
					if(row.operation == undefined) {
						row.operation = "";
					}
					if(row.startTimestamp == undefined) {
						row.startTimestamp = "0";
					}
					if(row.duration == undefined) {
						row.duration = "-1";
					}
					return row;
				}).filter(function(row) {
					if(files.length == 0 || files.includes(row.name)) {
						if(operations.length != 0) {
							return operations.includes(row.operation);
						} else {
							return true;
						}
					} else {
						return false;
					}
				}).map(function(row) {
					return "\"" + row.name + "\"" + " - " + "\"" + row.operation + "\"" + " - " + row.startTimestamp + " - " + row.duration + ":\n" + row.steps.map(function(step) {
						return "\t• \"" + step.name + "\"\t - " + step.time;
					}).join("\n");
				}).join("\n"),{ fileName : "ProgressiveWebTools.hx", lineNumber : 625, className : "ProgressiveWebTools", methodName : "getSwTimingsFilterConsoleNative"});
			}
		};
		navigator.serviceWorker.controller.postMessage({ "action" : "get_timings"},[messageChannel.port2]);
	} else {
		haxe_Log.trace("ServiceWorker is not initialized",{ fileName : "ProgressiveWebTools.hx", lineNumber : 657, className : "ProgressiveWebTools", methodName : "getSwTimingsFilterConsoleNative"});
	}
};
ProgressiveWebTools.prototype = {
	__class__: ProgressiveWebTools
};
var VideoClip = function(metricsFn,playFn,durationFn,positionFn) {
	this.widgetBounds = new PIXI.Bounds();
	this.isAudio = false;
	this.autoPlay = false;
	this.subtitlesScaleModeMax = -1.0;
	this.subtitlesScaleModeMin = -1.0;
	this.subtitlesScaleMode = false;
	this.subtitleBottomBorder = 2.0;
	this.subtitleAlignBottom = false;
	this.loaded = false;
	this.fontFamily = "";
	this.endTime = 0;
	this.startTime = 0;
	this.sources = [];
	this.streamStatusListener = [];
	this.isFlowContainer = false;
	FlowContainer.call(this);
	this.keepNativeWidget = true;
	this.metricsFn = metricsFn;
	this.playFn = playFn;
	this.durationFn = durationFn;
	this.positionFn = positionFn;
};
VideoClip.__name__ = true;
VideoClip.NeedsDrawing = function() {
	var _g = [];
	var _g1 = 0;
	var _g2 = VideoClip.playingVideos;
	while(_g1 < _g2.length) {
		var v = _g2[_g1];
		++_g1;
		var videoWidget = v.videoWidget;
		var tmp;
		if(videoWidget == null) {
			tmp = false;
		} else {
			var checkingGap = Platform.isIOS ? 0.5 : 0.0;
			v.checkTimeRange(videoWidget.currentTime,true,checkingGap);
			if(!((RenderSupport.RendererType == "html" || v.isHTML) && !v.isCanvas)) {
				if(videoWidget.width != videoWidget.videoWidth || videoWidget.height != videoWidget.videoHeight) {
					videoWidget.dispatchEvent(new Event("resize"));
				}
			}
			tmp = v.visible;
		}
		if(tmp) {
			_g.push(v);
		}
	}
	var playingVideosFiltered = _g;
	if(playingVideosFiltered.length > 0) {
		window.dispatchEvent(Platform.isIE ? new CustomEvent('videoplaying') : new Event("videoplaying"));
		var _g = 0;
		while(_g < playingVideosFiltered.length) {
			var v = playingVideosFiltered[_g];
			++_g;
			DisplayObjectHelper.invalidateTransform(v);
		}
		return true;
	}
	return false;
};
VideoClip.__super__ = FlowContainer;
VideoClip.prototype = $extend(FlowContainer.prototype,{
	checkTimeRange: function(currentTime,videoResponse,gap) {
		if(gap == null) {
			gap = 0;
		}
		try {
			if(currentTime < this.startTime - gap && this.startTime < this.videoWidget.duration) {
				this.videoWidget.currentTime = this.startTime;
				this.positionFn(this.videoWidget.currentTime);
			} else if(this.endTime > 0 && this.endTime > this.startTime && currentTime >= this.endTime) {
				if(this.videoWidget.paused) {
					this.videoWidget.currentTime = this.endTime;
				} else {
					this.videoWidget.currentTime = this.startTime;
					if(!this.videoWidget.loop) {
						this.videoWidget.pause();
						this.onStreamEnded();
					}
				}
				this.positionFn(this.videoWidget.currentTime);
			} else if(videoResponse) {
				this.positionFn(this.videoWidget.currentTime);
			} else {
				this.videoWidget.currentTime = currentTime;
			}
		} catch( _g ) {
			haxe_NativeStackTrace.lastError = _g;
		}
	}
	,createVideoClip: function(filename,startPaused,headers) {
		var _gthis = this;
		this.deleteVideoClip();
		this.autoPlay = !startPaused;
		this.addVideoSource(filename,"",headers);
		var tmp = this.isAudio ? "audio" : "video";
		this.videoWidget = window.document.createElement(tmp);
		if((RenderSupport.RendererType == "html" || this.isHTML) && !this.isCanvas) {
			DisplayObjectHelper.initNativeWidget(this,"div");
			this.nativeWidget.appendChild(this.videoWidget);
		}
		var tmp;
		if(filename.indexOf("data:") == 0) {
			tmp = "";
		} else {
			var loc = window.location;
			var tempAnchor = window.document.createElement("a");
			tempAnchor.href = filename;
			var samePort = !tempAnchor.port && loc.port == "" || tempAnchor.port == loc.port;
			tmp = tempAnchor.hostname != loc.hostname || !samePort || tempAnchor.protocol != loc.protocol ? "anonymous" : "";
		}
		this.videoWidget.crossOrigin = tmp;
		this.videoWidget.className = "nativeWidget";
		this.videoWidget.setAttribute("playsinline",true);
		this.videoWidget.setAttribute("autoplay",true);
		this.videoWidget.style.pointerEvents = "none";
		var _g = 0;
		var _g1 = this.sources;
		while(_g < _g1.length) {
			var source = _g1[_g];
			++_g;
			this.videoWidget.appendChild(source);
		}
		if(!((RenderSupport.RendererType == "html" || this.isHTML) && !this.isCanvas)) {
			this.addVideoSprite();
		}
		this.createStreamStatusListeners();
		this.createFullScreenListeners();
		if(!this.isAudio) {
			DisplayObjectHelper.onAdded(this,function() {
				RenderSupport.on("enable_sprites",$bind(_gthis,_gthis.enableSprites));
				return function() {
					RenderSupport.off("enable_sprites",$bind(_gthis,_gthis.enableSprites));
				};
			});
		}
		this.once("removed",$bind(this,this.deleteVideoClip));
	}
	,deleteVideoClip: function() {
		if(this.videoWidget != null) {
			this.pauseVideo();
			var _g = 0;
			var _g1 = this.sources;
			while(_g < _g1.length) {
				var source = _g1[_g];
				++_g;
				this.videoWidget.removeChild(source);
			}
			this.videoWidget.load();
			this.deleteVideoSprite();
			this.deleteSubtitlesClip();
			this.destroyStreamStatusListeners();
			this.destroyFullScreenListeners();
			if(this.videoWidget != null) {
				var parentNode = this.videoWidget.parentNode;
				if(parentNode != null) {
					parentNode.removeChild(this.videoWidget);
				}
				this.videoWidget = null;
			}
		}
		this.loaded = false;
	}
	,updateNativeWidget: function() {
		if(this.visible) {
			DisplayObjectHelper.updateNativeWidgetTransformMatrix(this);
			DisplayObjectHelper.updateNativeWidgetOpacity(this);
			DisplayObjectHelper.updateNativeWidgetMask(this);
			this.nativeWidget.style.transform = "none";
			var width0 = Math.round((this.getWidth != null ? this.getWidth() : this.getLocalBounds().width) * this.transform.scale.x);
			var height0 = Math.round(DisplayObjectHelper.getHeight(this) * this.transform.scale.y);
			var width = isNaN(width0) ? 0 : width0;
			var height = isNaN(height0) ? 0 : height0;
			this.videoWidget.width = width;
			this.videoWidget.height = height;
			this.videoWidget.setAttribute("width","" + width);
			this.videoWidget.setAttribute("height","" + height);
			this.videoWidget.style.width = "" + width + "px";
			this.videoWidget.style.height = "" + height + "px";
			if(this.transform.scale.x == this.transform.scale.y) {
				this.videoWidget.style.objectFit = "";
			} else {
				this.videoWidget.style.objectFit = "fill";
			}
			this.updateSubtitlesClip();
			DisplayObjectHelper.updateNativeWidgetInteractive(this);
		}
		DisplayObjectHelper.updateNativeWidgetDisplay(this);
	}
	,getDescription: function() {
		if(this.videoWidget != null) {
			return "VideoClip (url = " + Std.string(this.videoWidget.url) + ")";
		} else {
			return "";
		}
	}
	,setVolume: function(volume) {
		if(this.videoWidget != null) {
			this.videoWidget.volume = volume;
			if(Platform.isIOS) {
				this.videoWidget.muted = volume == 0.0;
			}
		}
	}
	,setLooping: function(loop) {
		if(this.videoWidget != null) {
			this.videoWidget.loop = loop;
		}
	}
	,setIsAudio: function() {
		this.isAudio = Util.getParameter("video2audio") != "0";
	}
	,playVideo: function(filename,startPaused,headers) {
		this.createVideoClip(filename,startPaused,headers);
	}
	,playVideoFromMediaStream: function(mediaStream,startPaused) {
		this.createVideoClip("",startPaused,[]);
		this.videoWidget.srcObject = mediaStream.mediaStream;
		mediaStream.videoClip = this;
		mediaStream.emit("attached");
	}
	,setTimeRange: function(start,end) {
		this.startTime = start >= 0 ? this.floorTime(start) : 0;
		this.endTime = end > this.startTime ? this.floorTime(end) : this.videoWidget.duration;
		this.checkTimeRange(this.videoWidget.currentTime,true);
	}
	,setCurrentTime: function(time) {
		this.checkTimeRange(time,false);
	}
	,setVideoSubtitle: function(text,fontfamily,fontsize,fontweight,fontslope,fillcolor,fillopacity,letterspacing,backgroundcolour,backgroundopacity,alignBottom,bottomBorder,scaleMode,scaleModeMin,scaleModeMax,escapeHTML) {
		if(text == "") {
			this.deleteSubtitlesClip();
		} else {
			this.setVideoSubtitleClip(text,fontfamily,fontsize,fontweight,fontslope,fillcolor,fillopacity,letterspacing,backgroundcolour,backgroundopacity,alignBottom,bottomBorder,scaleMode,scaleModeMin,scaleModeMax,escapeHTML);
		}
	}
	,setPlaybackRate: function(rate) {
		if(this.videoWidget != null) {
			this.videoWidget.playbackRate = rate;
		}
	}
	,setVideoSubtitleClip: function(text,fontfamily,fontsize,fontweight,fontslope,fillcolor,fillopacity,letterspacing,backgroundcolour,backgroundopacity,alignBottom,bottomBorder,scaleMode,scaleModeMin,scaleModeMax,escapeHTML) {
		if(this.fontFamily != fontfamily && fontfamily != "") {
			this.fontFamily = fontfamily;
			this.deleteSubtitlesClip();
		}
		this.createSubtitlesClip();
		this.textField.setAutoAlign("AutoAlignCenter");
		this.textField.setNeedBaseline(false);
		this.textField.setTextAndStyle(" " + text + " ",this.fontFamily,fontsize,fontweight,fontslope,fillcolor,fillopacity,letterspacing,backgroundcolour,backgroundopacity);
		this.textField.setEscapeHTML(escapeHTML);
		this.subtitleAlignBottom = alignBottom;
		if(bottomBorder >= 0) {
			this.subtitleBottomBorder = bottomBorder;
		}
		this.subtitlesScaleMode = scaleMode;
		this.subtitlesScaleModeMin = scaleModeMin;
		this.subtitlesScaleModeMax = scaleModeMax;
		this.updateSubtitlesClip();
	}
	,createSubtitlesClip: function() {
		if(this.textField == null) {
			this.textField = new TextClip();
			this.textField.setWordWrap(true);
			this.addChild(this.textField);
		}
	}
	,updateSubtitlesClip: function() {
		if(this.videoWidget != null && this.textField != null) {
			if(this.videoWidget.width == 0) {
				var clip = this.textField;
				if(clip._visible != false) {
					clip._visible = false;
					DisplayObjectHelper.invalidateVisible(clip);
				}
			} else {
				var clip = this.textField;
				if(clip._visible != true) {
					clip._visible = true;
					DisplayObjectHelper.invalidateVisible(clip);
				}
				var xScale = this.subtitlesScaleMode ? this.transform.scale.x : 1.0;
				var yScale = this.subtitlesScaleMode ? this.transform.scale.y : 1.0;
				if(this.subtitlesScaleModeMin != -1.0) {
					xScale = Math.max(xScale,this.subtitlesScaleModeMin);
					yScale = Math.max(yScale,this.subtitlesScaleModeMin);
				}
				if(this.subtitlesScaleModeMax != -1.0) {
					xScale = Math.min(xScale,this.subtitlesScaleModeMax);
					yScale = Math.min(yScale,this.subtitlesScaleModeMax);
				}
				var clip = this.textField;
				if(!clip.destroyed && clip.scale.x != xScale) {
					var from = DisplayObjectHelper.DebugUpdate ? "setClipScaleX " + clip.scale.x + " : " + xScale : null;
					clip.scale.x = xScale;
					if((RenderSupport.RendererType == "html" || clip.isHTML) && !clip.isCanvas && xScale != 0.0) {
						DisplayObjectHelper.initNativeWidget(clip);
					}
					DisplayObjectHelper.invalidateTransform(clip,from);
				}
				var clip = this.textField;
				if(!clip.destroyed && clip.scale.y != yScale) {
					var from = DisplayObjectHelper.DebugUpdate ? "setClipScaleY " + clip.scale.y + " : " + yScale : null;
					clip.scale.y = yScale;
					if((RenderSupport.RendererType == "html" || clip.isHTML) && !clip.isCanvas && yScale != 0.0) {
						DisplayObjectHelper.initNativeWidget(clip);
					}
					DisplayObjectHelper.invalidateTransform(clip,from);
				}
				this.textField.setWidth(0.0);
				this.textField.setWidth(Math.min(this.textField.getWidth(),this.videoWidget.width / xScale));
				var clip = this.textField;
				var x = (this.videoWidget.width - this.textField.getWidth() * xScale) / 2.0;
				if(clip.scrollRect != null) {
					x -= clip.scrollRect.x;
				}
				if(!clip.destroyed && clip.x != x) {
					var from = DisplayObjectHelper.DebugUpdate ? "setClipX " + clip.x + " : " + x : null;
					clip.x = x;
					DisplayObjectHelper.invalidateTransform(clip,from);
				}
				var clip = this.textField;
				var y = this.videoWidget.height - this.textField.getHeight() * yScale - this.subtitleBottomBorder * yScale + (this.subtitleAlignBottom ? this.y : 0.0);
				if(clip.scrollRect != null) {
					y -= clip.scrollRect.y;
				}
				if(!clip.destroyed && clip.y != y) {
					var from = DisplayObjectHelper.DebugUpdate ? "setClipY " + clip.y + " : " + y : null;
					clip.y = y;
					DisplayObjectHelper.invalidateTransform(clip,from);
				}
				DisplayObjectHelper.invalidateTransform(this.textField,"updateSubtitlesClip");
			}
		}
	}
	,deleteSubtitlesClip: function() {
		this.removeChild(this.textField);
		this.textField = null;
	}
	,addVideoSprite: function() {
		if(this.videoWidget != null) {
			this.videoTexture = PIXI.Texture.fromVideo(this.videoWidget);
			this.videoTexture.baseTexture.autoUpdate = false;
			this.videoSprite = new PIXI.Sprite(this.videoTexture);
			this.videoSprite._visible = true;
			this.addChild(this.videoSprite);
		}
	}
	,deleteVideoSprite: function() {
		if(this.videoSprite != null) {
			this.videoSprite.destroy({ children : true, texture : true, baseTexture : true});
			this.removeChild(this.videoSprite);
			this.videoSprite = null;
		}
		if(this.videoTexture != null) {
			this.videoTexture.destroy(true);
			this.videoTexture = null;
		}
	}
	,enableSprites: function() {
		if(this.destroyed || this.parent == null || this.nativeWidget == null) {
			return;
		}
		this.addVideoSprite();
	}
	,getCurrentTime: function() {
		if(this.videoWidget != null) {
			return this.videoWidget.currentTime;
		} else {
			return 0;
		}
	}
	,pauseVideo: function() {
		if(this.loaded && !this.videoWidget.paused) {
			this.autoPlay = false;
			this.videoWidget.pause();
			HxOverrides.remove(VideoClip.playingVideos,this);
		}
	}
	,resumeVideo: function() {
		var _gthis = this;
		if(this.loaded && this.videoWidget.paused) {
			this.autoPlay = true;
			var playPromise = this.videoWidget.play();
			if(playPromise != null) {
				playPromise.then(function(arg) {
					VideoClip.playingVideos.push(_gthis);
				},function(e) {
					_gthis.playFn(false);
				});
			} else {
				VideoClip.playingVideos.push(this);
			}
		}
	}
	,onMetadataLoaded: function() {
		this.durationFn(this.videoWidget.duration);
		this.updateVideoMetrics();
		this.videoWidget.currentTime = 0;
		this.checkTimeRange(this.videoWidget.currentTime,true);
		DisplayObjectHelper.invalidateTransform(this,"onMetadataLoaded");
		if(this.textField != null) {
			if(!((RenderSupport.RendererType == "html" || this.isHTML) && !this.isCanvas) && this.getChildIndex(this.videoSprite) > this.getChildIndex(this.textField)) {
				this.swapChildren(this.videoSprite,this.textField);
			}
			this.updateSubtitlesClip();
		}
		if(!((RenderSupport.RendererType == "html" || this.isHTML) && !this.isCanvas)) {
			this.videoTexture.update();
		}
		this.loaded = true;
		if(this.autoPlay) {
			this.resumeVideo();
		} else {
			this.videoWidget.pause();
		}
	}
	,updateVideoMetrics: function() {
		this.metricsFn(this.videoWidget.videoWidth,this.videoWidget.videoHeight);
		this.calculateWidgetBounds();
		DisplayObjectHelper.invalidateTransform(this,"updateVideoMetrics");
		if((RenderSupport.RendererType == "html" || this.isHTML) && !this.isCanvas) {
			var tmp = this.getWidth != null ? this.getWidth() : this.getLocalBounds().width;
			this.videoWidget.style.width = "" + tmp + "px";
			var tmp = "" + DisplayObjectHelper.getHeight(this);
			this.videoWidget.style.height = tmp + "px";
		} else {
			this.videoWidget.width = this.videoWidget.videoWidth;
			this.videoWidget.height = this.videoWidget.videoHeight;
			this.videoTexture.update();
		}
	}
	,onStreamLoaded: function() {
		var _g = 0;
		var _g1 = this.streamStatusListener;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			l("NetStream.Play.Start");
		}
	}
	,onStreamEnded: function() {
		if(!this.videoWidget.loop) {
			HxOverrides.remove(VideoClip.playingVideos,this);
		}
		var _g = 0;
		var _g1 = this.streamStatusListener;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			l("NetStream.Play.Stop");
		}
	}
	,onStreamError: function() {
		var _g = 0;
		var _g1 = this.streamStatusListener;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			l("NetStream.Play.StreamNotFound");
		}
	}
	,onStreamPlay: function() {
		if(this.videoWidget != null && !this.videoWidget.paused) {
			if(!this.autoPlay) {
				this.videoWidget.pause();
			} else {
				var _g = 0;
				var _g1 = this.streamStatusListener;
				while(_g < _g1.length) {
					var l = _g1[_g];
					++_g;
					l("FlowGL.User.Resume");
				}
				this.playFn(true);
			}
		}
	}
	,onStreamPause: function() {
		if(this.videoWidget != null && this.videoWidget.paused) {
			var _g = 0;
			var _g1 = this.streamStatusListener;
			while(_g < _g1.length) {
				var l = _g1[_g];
				++_g;
				l("FlowGL.User.Pause");
			}
			this.playFn(false);
		}
	}
	,onStreamPlaying: function() {
		if(this.videoWidget != null) {
			var _g = 0;
			var _g1 = this.streamStatusListener;
			while(_g < _g1.length) {
				var l = _g1[_g];
				++_g;
				l("FlowGL.User.Playing");
			}
		}
	}
	,onStreamWaiting: function(e) {
		if(this.videoWidget != null) {
			var _g = 0;
			var _g1 = this.streamStatusListener;
			while(_g < _g1.length) {
				var l = _g1[_g];
				++_g;
				l("FlowGL.User.Waiting");
			}
		}
	}
	,onFullScreen: function() {
		if(this.videoWidget != null) {
			RenderSupport.fullScreenTrigger();
			if(RenderSupport.IsFullScreen) {
				window.document.body.appendChild(this.videoWidget);
			} else {
				window.document.body.removeChild(this.videoWidget);
			}
		}
	}
	,addStreamStatusListener: function(fn) {
		var _gthis = this;
		this.streamStatusListener.push(fn);
		return function() {
			HxOverrides.remove(_gthis.streamStatusListener,fn);
		};
	}
	,addVideoSource: function(src,type,headers) {
		var _gthis = this;
		var source = window.document.createElement("source");
		var isAppended = false;
		if(headers.length == 0) {
			source.onerror = $bind(this,this.onStreamError);
			source.src = src;
			if(type != "") {
				source.type = type;
			}
		} else {
			var videoXhr = new XMLHttpRequest();
			videoXhr.open("GET",src,true);
			var _g = 0;
			while(_g < headers.length) {
				var header = headers[_g];
				++_g;
				videoXhr.setRequestHeader(header[0],header[1]);
			}
			videoXhr.responseType = "blob";
			videoXhr.onload = function(oEvent) {
				if(videoXhr.status == 200) {
					if(type == "") {
						type = videoXhr.getResponseHeader("content-type");
					}
					if(type != "") {
						source.type = type;
					}
					source.src = URL.createObjectURL(videoXhr.response);
					if(!isAppended && _gthis.videoWidget != null) {
						isAppended = true;
						_gthis.videoWidget.appendChild(source);
					}
				} else if(videoXhr.status >= 400) {
					_gthis.onStreamError();
				}
			};
			videoXhr.onerror = $bind(this,this.onStreamError);
			videoXhr.send(null);
		}
		this.sources.push(source);
		if(!isAppended && this.videoWidget != null) {
			isAppended = true;
			this.videoWidget.appendChild(source);
		}
	}
	,setVideoExternalSubtitle: function(src,kind) {
		var _gthis = this;
		if(src == "") {
			return function() {
			};
		}
		var track = window.document.createElement("track");
		track.setAttribute("default","");
		track.setAttribute("src",src);
		if(kind != "") {
			track.setAttribute("kind",kind);
		}
		this.sources.push(track);
		if(this.videoWidget != null) {
			this.videoWidget.appendChild(track);
		}
		return function() {
			HxOverrides.remove(_gthis.sources,track);
			if(_gthis.videoWidget != null) {
				_gthis.videoWidget.removeChild(track);
			}
		};
	}
	,createStreamStatusListeners: function() {
		if(this.videoWidget != null) {
			this.videoWidget.addEventListener("loadedmetadata",$bind(this,this.onMetadataLoaded),false);
			this.videoWidget.addEventListener("resize",$bind(this,this.updateVideoMetrics),false);
			this.videoWidget.addEventListener("loadeddata",$bind(this,this.onStreamLoaded),false);
			this.videoWidget.addEventListener("ended",$bind(this,this.onStreamEnded),false);
			this.videoWidget.addEventListener("error",$bind(this,this.onStreamError),false);
			this.videoWidget.addEventListener("play",$bind(this,this.onStreamPlay),false);
			this.videoWidget.addEventListener("pause",$bind(this,this.onStreamPause),false);
			this.videoWidget.addEventListener("playing",$bind(this,this.onStreamPlaying),false);
			this.videoWidget.addEventListener("waiting",$bind(this,this.onStreamWaiting),false);
		}
	}
	,destroyStreamStatusListeners: function() {
		if(this.videoWidget != null) {
			this.videoWidget.removeEventListener("loadedmetadata",$bind(this,this.onMetadataLoaded));
			this.videoWidget.removeEventListener("resize",$bind(this,this.updateVideoMetrics));
			this.videoWidget.removeEventListener("loadeddata",$bind(this,this.onStreamLoaded));
			this.videoWidget.removeEventListener("ended",$bind(this,this.onStreamEnded));
			this.videoWidget.removeEventListener("error",$bind(this,this.onStreamError));
			this.videoWidget.removeEventListener("play",$bind(this,this.onStreamPlay));
			this.videoWidget.removeEventListener("pause",$bind(this,this.onStreamPause));
			this.videoWidget.removeEventListener("playing",$bind(this,this.onStreamPlaying),false);
			this.videoWidget.removeEventListener("waiting",$bind(this,this.onStreamWaiting),false);
		}
	}
	,createFullScreenListeners: function() {
		if(this.videoWidget != null) {
			if(Platform.isIOS) {
				this.videoWidget.addEventListener("webkitbeginfullscreen",$bind(this,this.onFullScreen),false);
				this.videoWidget.addEventListener("webkitendfullscreen",$bind(this,this.onFullScreen),false);
			}
			this.videoWidget.addEventListener("fullscreenchange",$bind(this,this.onFullScreen),false);
			this.videoWidget.addEventListener("webkitfullscreenchange",$bind(this,this.onFullScreen),false);
			this.videoWidget.addEventListener("mozfullscreenchange",$bind(this,this.onFullScreen),false);
		}
	}
	,destroyFullScreenListeners: function() {
		if(this.videoWidget != null) {
			if(Platform.isIOS) {
				this.videoWidget.removeEventListener("webkitbeginfullscreen",$bind(this,this.onFullScreen));
				this.videoWidget.removeEventListener("webkitendfullscreen",$bind(this,this.onFullScreen));
			}
			this.videoWidget.removeEventListener("fullscreenchange",$bind(this,this.onFullScreen));
			this.videoWidget.removeEventListener("webkitfullscreenchange",$bind(this,this.onFullScreen));
			this.videoWidget.removeEventListener("mozfullscreenchange",$bind(this,this.onFullScreen));
		}
	}
	,getCurrentFrame: function() {
		try {
			var canvas = window.document.createElement("canvas");
			var ctx = canvas.getContext("2d");
			canvas.width = this.videoWidget.videoWidth;
			canvas.height = this.videoWidget.videoHeight;
			ctx.drawImage(this.videoWidget,0,0);
			var data = canvas.toDataURL();
			return data;
		} catch( _g ) {
			haxe_NativeStackTrace.lastError = _g;
			return "error";
		}
	}
	,getLocalBounds: function(rect) {
		return this.localBounds.getRectangle(rect);
	}
	,floorTime: function(time) {
		return Math.floor(time * 100) / 100;
	}
	,calculateWidgetBounds: function() {
		this.widgetBounds.minX = 0;
		this.widgetBounds.minY = 0;
		this.widgetBounds.maxX = this.videoWidget.videoWidth;
		this.widgetBounds.maxY = this.videoWidget.videoHeight;
	}
	,createNativeWidget: function(tagName) {
		if(tagName == null) {
			tagName = "video";
		}
		if(!this.isNativeWidget) {
			return;
		}
		DisplayObjectHelper.deleteNativeWidget(this);
		this.nativeWidget = window.document.createElement(tagName);
		DisplayObjectHelper.updateClipID(this);
		this.nativeWidget.className = "nativeWidget";
		this.isNativeWidget = true;
	}
	,__class__: VideoClip
});
var FlowInstance = function(rootId,stage,renderer) {
	this.listeners = new haxe_ds_StringMap();
	this.rootId = "";
	this.rootId = rootId;
	this.stage = stage;
	this.renderer = renderer;
};
FlowInstance.__name__ = true;
FlowInstance.prototype = {
	emit: function(event,value) {
		this.stage.emit(event,value);
	}
	,registerListener: function(event,listener) {
		this.listeners.h[event] = listener;
	}
	,getListener: function(event) {
		return this.listeners.h[event];
	}
	,unregisterListener: function(event) {
		var listenerFn = this.getListener(event);
		var _this = this.listeners;
		if(Object.prototype.hasOwnProperty.call(_this.h,event)) {
			delete(_this.h[event]);
		}
		return listenerFn;
	}
	,__class__: FlowInstance
};
var FlowSprite = function(url,cache,metricsFn,errorFn,onlyDownload,altText,headers) {
	this.disposed = false;
	this.useCrossOrigin = false;
	this.keepNativeWidgetChildren = false;
	this.keepNativeWidget = false;
	this.isNativeWidget = false;
	this.forceSvg = false;
	this.isSvg = false;
	this.isCanvas = false;
	this.isEmpty = true;
	this.filterPadding = 0.0;
	this._bounds = new PIXI.Bounds();
	this.widgetBounds = new PIXI.Bounds();
	this.localBounds = new PIXI.Bounds();
	this.retries = 0;
	this.altText = "";
	this.onlyDownload = false;
	this.cache = false;
	this.updateParent = false;
	this.widgetBoundsChanged = false;
	this.visibilityChanged = true;
	this.failed = false;
	this.loaded = false;
	this.headers = [];
	this.url = "";
	this.transformChanged = true;
	this.clipVisible = false;
	this._visible = true;
	PIXI.Sprite.call(this);
	this.visible = false;
	this.interactiveChildren = false;
	this.url = url;
	this.headers = headers;
	this.cache = cache;
	this.metricsFn = metricsFn;
	this.errorFn = errorFn;
	this.onlyDownload = onlyDownload;
	this.altText = altText;
	if(StringTools.endsWith(url,".swf")) {
		url = StringTools.replace(url,".swf",".png");
	}
	if((RenderSupport.RendererType == "html" || this.isHTML) && !this.isCanvas) {
		this.forceSvg = Platform.isChrome && url.indexOf(".svg") > 0;
		DisplayObjectHelper.initNativeWidget(this,"img");
	} else {
		this.once("removed",$bind(this,this.onSpriteRemoved));
		this.once("added",$bind(this,this.onSpriteAdded));
	}
};
FlowSprite.__name__ = true;
FlowSprite.clearUrlTextureCache = function(url) {
	var _this = FlowSprite.cachedImagesUrls;
	if(Object.prototype.hasOwnProperty.call(_this.h,url)) {
		delete(_this.h[url]);
	}
	var texture = PIXI.Texture.removeFromCache(url);
	var baseTexture = PIXI.BaseTexture.removeFromCache(url);
	delete this.baseTexture;
	delete this.texture;
};
FlowSprite.pushTextureToCache = function(texture) {
	if(texture != null && texture.baseTexture != null && texture.baseTexture.imageUrl != null) {
		var url = texture.baseTexture.imageUrl;
		if(url != null) {
			if(Object.prototype.hasOwnProperty.call(FlowSprite.cachedImagesUrls.h,url)) {
				FlowSprite.cachedImagesUrls.h[url] += 1;
			} else {
				FlowSprite.cachedImagesUrls.h[url] = 1;
				var h = FlowSprite.cachedImagesUrls.h;
				var cachedImagesKeys_h = h;
				var cachedImagesKeys_keys = Object.keys(h);
				var cachedImagesKeys_length = cachedImagesKeys_keys.length;
				var cachedImagesKeys_current = 0;
				var cachedImagesCount = Lambda.count(FlowSprite.cachedImagesUrls);
				while(cachedImagesCount > 50) {
					FlowSprite.clearUrlTextureCache(cachedImagesKeys_keys[cachedImagesKeys_current++]);
					--cachedImagesCount;
				}
			}
		}
	}
};
FlowSprite.removeTextureFromCache = function(texture) {
	if(texture != null && texture.baseTexture != null && texture.baseTexture.imageUrl != null) {
		var url = texture.baseTexture.imageUrl;
		if(url != null) {
			if(Object.prototype.hasOwnProperty.call(FlowSprite.cachedImagesUrls.h,url) && FlowSprite.cachedImagesUrls.h[url] > 1) {
				FlowSprite.cachedImagesUrls.h[url] -= 1;
				return FlowSprite.cachedImagesUrls.h[url] == 0;
			} else {
				FlowSprite.clearUrlTextureCache(url);
				return true;
			}
		}
	}
	return false;
};
FlowSprite.__super__ = PIXI.Sprite;
FlowSprite.prototype = $extend(PIXI.Sprite.prototype,{
	onSpriteAdded: function() {
		var _gthis = this;
		if(!this.loaded) {
			if(this.url.indexOf(".svg") > 0) {
				var svgXhr = new XMLHttpRequest();
				if(!Platform.isIE && !Platform.isEdge) {
					svgXhr.overrideMimeType("image/svg+xml");
				}
				svgXhr.onload = function() {
					var tmp = encodeURIComponent(svgXhr.response);
					_gthis.url = "data:image/svg+xml;utf8," + tmp;
					_gthis.loadTexture();
				};
				svgXhr.open("GET",this.url,true);
				svgXhr.send();
			} else {
				this.loadTexture();
			}
		}
	}
	,onSpriteRemoved: function() {
		if(FlowSprite.removeTextureFromCache(this.texture) && !this.loaded) {
			var nativeWidget = this.texture.baseTexture.source;
			nativeWidget.removeAttribute("src");
			if(nativeWidget != null) {
				var parentNode = nativeWidget.parentNode;
				if(parentNode != null) {
					parentNode.removeChild(nativeWidget);
				}
				nativeWidget = null;
			}
			this.texture.baseTexture.destroy();
		}
		this.texture = PIXI.Texture.EMPTY;
	}
	,onDispose: function() {
		this.disposed = true;
		if(this.texture != null) {
			FlowSprite.removeTextureFromCache(this.texture);
		}
		this.loaded = false;
		this.visibilityChanged = true;
		if(this.parent != null) {
			this.loadTexture();
		} else {
			this.texture = PIXI.Texture.EMPTY;
		}
		DisplayObjectHelper.invalidateStage(this);
		DisplayObjectHelper.deleteNativeWidget(this);
	}
	,onError: function() {
		if(this.texture != null) {
			FlowSprite.removeTextureFromCache(this.texture);
		}
		this.loaded = false;
		this.failed = true;
		this.visibilityChanged = true;
		this.texture = PIXI.Texture.EMPTY;
		if(this.parent == null) {
			return;
		}
		this.errorFn("Can not load " + this.url);
		DisplayObjectHelper.deleteNativeWidget(this);
	}
	,enableSprites: function() {
		var tmp;
		if(!(this.destroyed || this.parent == null || this.nativeWidget == null)) {
			if(RenderSupport.printMode) {
				var url = this.url;
				var tmp1;
				if(url.indexOf("data:") == 0) {
					tmp1 = "";
				} else {
					var loc = window.location;
					var tempAnchor = window.document.createElement("a");
					tempAnchor.href = url;
					var samePort = !tempAnchor.port && loc.port == "" || tempAnchor.port == loc.port;
					tmp1 = tempAnchor.hostname != loc.hostname || !samePort || tempAnchor.protocol != loc.protocol ? "anonymous" : "";
				}
				tmp = tmp1 == "anonymous";
			} else {
				tmp = false;
			}
		} else {
			tmp = true;
		}
		if(tmp) {
			return;
		}
		if(this.nativeWidget.baseTexture == null) {
			if(this.texture != null) {
				this.nativeWidget.baseTexture = this.texture.baseTexture;
			} else {
				return;
			}
		}
		this.texture = PIXI.Texture.from(this.nativeWidget);
		RenderSupport.on("disable_sprites",$bind(this,this.disableSprites));
	}
	,disableSprites: function() {
		this.texture = PIXI.Texture.EMPTY;
		RenderSupport.off("disable_sprites",$bind(this,this.disableSprites));
	}
	,onLoaded: function() {
		var _gthis = this;
		RenderSupport.once("drawframe",function() {
			if(_gthis.disposed) {
				return;
			}
			try {
				DisplayObjectHelper.invalidateTransform(_gthis,"onLoaded");
				_gthis.widgetBoundsChanged = true;
				_gthis.calculateWidgetBounds();
				if(_gthis.widgetBounds.maxX == 0.0) {
					if(_gthis.parent != null && _gthis.retries < 10) {
						_gthis.retries++;
						_gthis.nativeWidget.style.width = null;
						_gthis.nativeWidget.style.height = null;
						Native.timer(_gthis.retries * 1000,$bind(_gthis,_gthis.onLoaded));
					} else if(_gthis.forceSvg) {
						_gthis.forceImageElement();
					} else {
						_gthis.onError();
					}
				} else {
					if((RenderSupport.RendererType == "html" || _gthis.isHTML) && !_gthis.isCanvas) {
						if(_gthis.nativeWidget == null) {
							return;
						}
						DisplayObjectHelper.onAdded(_gthis,function() {
							RenderSupport.on("enable_sprites",$bind(_gthis,_gthis.enableSprites));
							return function() {
								RenderSupport.off("enable_sprites",$bind(_gthis,_gthis.enableSprites));
								_gthis.disableSprites();
							};
						});
						var f = _gthis.widgetBounds.maxX;
						var width = isFinite(f) ? _gthis.forceSvg && window.devicePixelRatio > 1 && Platform.isChrome ? _gthis.widgetBounds.maxX / window.devicePixelRatio : _gthis.widgetBounds.maxX : 0;
						var f = _gthis.widgetBounds.maxY;
						var height = isFinite(f) ? _gthis.forceSvg && window.devicePixelRatio > 1 && Platform.isChrome ? _gthis.widgetBounds.maxY / window.devicePixelRatio : _gthis.widgetBounds.maxY : 0;
						_gthis.metricsFn(width,height);
					} else {
						_gthis.metricsFn(_gthis.texture.width,_gthis.texture.height);
					}
					_gthis.visibilityChanged = true;
					_gthis.loaded = true;
					_gthis.failed = false;
				}
			} catch( _g ) {
				haxe_NativeStackTrace.lastError = _g;
				if(_gthis.parent != null && _gthis.retries < 2) {
					_gthis.loadTexture();
				} else {
					_gthis.onError();
				}
			}
		});
	}
	,loadTexture: function() {
		this.retries++;
		var tmp = this.url;
		var url = this.url;
		var tmp1;
		if(url.indexOf("data:") == 0) {
			tmp1 = "";
		} else {
			var loc = window.location;
			var tempAnchor = window.document.createElement("a");
			tempAnchor.href = url;
			var samePort = !tempAnchor.port && loc.port == "" || tempAnchor.port == loc.port;
			tmp1 = tempAnchor.hostname != loc.hostname || !samePort || tempAnchor.protocol != loc.protocol ? "anonymous" : "";
		}
		this.texture = PIXI.Texture.fromImage(tmp,tmp1 != "");
		FlowSprite.pushTextureToCache(this.texture);
		if(this.texture.baseTexture == null || this.texture.baseTexture == undefined) {
			this.onError();
		} else {
			if(this.texture.baseTexture.hasLoaded) {
				this.onLoaded();
			}
			this.texture.baseTexture.on("loaded",$bind(this,this.onLoaded));
			this.texture.baseTexture.on("error",$bind(this,this.onError));
			this.texture.baseTexture.on("dispose",$bind(this,this.onDispose));
		}
	}
	,getLocalBounds: function(rect) {
		rect = this.localBounds.getRectangle(rect);
		if(this.filterPadding != 0.0) {
			rect.x -= this.filterPadding;
			rect.y -= this.filterPadding;
			rect.width += this.filterPadding * 2.0;
			rect.height += this.filterPadding * 2.0;
		}
		return rect;
	}
	,getBounds: function(skipUpdate,rect) {
		if(!skipUpdate) {
			this.updateTransform();
		}
		if(this._boundsID != this._lastBoundsID) {
			this.calculateBounds();
		}
		return this._bounds.getRectangle(rect);
	}
	,calculateBounds: function() {
		this._bounds.minX = this.localBounds.minX * this.worldTransform.a + this.localBounds.minY * this.worldTransform.c + this.worldTransform.tx;
		this._bounds.minY = this.localBounds.minX * this.worldTransform.b + this.localBounds.minY * this.worldTransform.d + this.worldTransform.ty;
		this._bounds.maxX = this.localBounds.maxX * this.worldTransform.a + this.localBounds.maxY * this.worldTransform.c + this.worldTransform.tx;
		this._bounds.maxY = this.localBounds.maxX * this.worldTransform.b + this.localBounds.maxY * this.worldTransform.d + this.worldTransform.ty;
	}
	,forceImageElement: function(tagName) {
		if(tagName == null) {
			tagName = "img";
		}
		if(this.destroyed || this.parent == null || this.nativeWidget == null || this.disposed) {
			return;
		}
		this.forceSvg = false;
		this.createNativeWidget(tagName);
	}
	,createNativeWidget: function(tagName) {
		if(tagName == null) {
			tagName = "img";
		}
		var _gthis = this;
		if(!this.isNativeWidget) {
			return;
		}
		DisplayObjectHelper.deleteNativeWidget(this);
		if(this.forceSvg) {
			this.nativeWidget = window.document.createElement("div");
			DisplayObjectHelper.updateClipID(this);
			var svgXhr = new XMLHttpRequest();
			if(!Platform.isIE && !Platform.isEdge) {
				svgXhr.overrideMimeType("image/svg+xml");
			}
			svgXhr.onload = function() {
				if(_gthis.destroyed || _gthis.parent == null || _gthis.nativeWidget == null || _gthis.disposed) {
					return;
				}
				try {
					var isContentTypeSvg = svgXhr.getResponseHeader("content-type").indexOf("svg") > 0;
					if(isContentTypeSvg && svgXhr.response.indexOf("data:img") > 0) {
						_gthis.nativeWidget.style.width = null;
						_gthis.nativeWidget.style.height = null;
						_gthis.nativeWidget.innerHTML = svgXhr.response;
						_gthis.onLoaded();
					} else if(isContentTypeSvg && svgXhr.response.indexOf("foreignObject") > 0) {
						var warnMessage = "Warning! SVG (" + _gthis.url + ") has a <foreignObject> inside, which could effect file size and ability to take a screenshot";
						console.warn(warnMessage);
						_gthis.errorFn(warnMessage);
						var tmp = encodeURIComponent(svgXhr.response);
						_gthis.url = "data:image/svg+xml;utf8," + tmp;
						_gthis.forceImageElement();
					} else {
						_gthis.forceImageElement();
					}
				} catch( _g ) {
					haxe_NativeStackTrace.lastError = _g;
					_gthis.forceImageElement();
				}
			};
			svgXhr.onerror = function() {
				_gthis.forceImageElement();
			};
			svgXhr.open("GET",this.url,true);
			var _g = 0;
			var _g1 = this.headers;
			while(_g < _g1.length) {
				var header = _g1[_g];
				++_g;
				svgXhr.setRequestHeader(header[0],header[1]);
			}
			svgXhr.send();
		} else if(this.headers.length == 0) {
			this.nativeWidget = window.document.createElement(tagName);
			DisplayObjectHelper.updateClipID(this);
			if(this.useCrossOrigin) {
				var url = this.url;
				var tmp;
				if(url.indexOf("data:") == 0) {
					tmp = "";
				} else {
					var loc = window.location;
					var tempAnchor = window.document.createElement("a");
					tempAnchor.href = url;
					var samePort = !tempAnchor.port && loc.port == "" || tempAnchor.port == loc.port;
					tmp = tempAnchor.hostname != loc.hostname || !samePort || tempAnchor.protocol != loc.protocol ? "anonymous" : "";
				}
				this.nativeWidget.crossOrigin = tmp;
			}
			this.nativeWidget.onload = $bind(this,this.onLoaded);
			this.nativeWidget.onerror = $bind(this,this.onError);
			this.nativeWidget.src = this.url;
		} else {
			this.nativeWidget = window.document.createElement(tagName);
			DisplayObjectHelper.updateClipID(this);
			if(this.useCrossOrigin) {
				var url = this.url;
				var tmp;
				if(url.indexOf("data:") == 0) {
					tmp = "";
				} else {
					var loc = window.location;
					var tempAnchor = window.document.createElement("a");
					tempAnchor.href = url;
					var samePort = !tempAnchor.port && loc.port == "" || tempAnchor.port == loc.port;
					tmp = tempAnchor.hostname != loc.hostname || !samePort || tempAnchor.protocol != loc.protocol ? "anonymous" : "";
				}
				this.nativeWidget.crossOrigin = tmp;
			}
			var imgXhr = new XMLHttpRequest();
			imgXhr.open("GET",this.url,true);
			var _g = 0;
			var _g1 = this.headers;
			while(_g < _g1.length) {
				var header = _g1[_g];
				++_g;
				imgXhr.setRequestHeader(header[0],header[1]);
			}
			imgXhr.responseType = "blob";
			imgXhr.onload = function(oEvent) {
				if(imgXhr.status == 200) {
					_gthis.nativeWidget.src = URL.createObjectURL(imgXhr.response);
					Native.defer(function() {
						URL.revokeObjectURL(_gthis.nativeWidget.src);
					});
					_gthis.onLoaded();
				} else if(imgXhr.status >= 400) {
					_gthis.onError();
				}
			};
			imgXhr.onerror = $bind(this,this.onError);
			imgXhr.send(null);
		}
		this.nativeWidget.className = "nativeWidget";
		if(this.className != null && this.className != "") {
			this.nativeWidget.classList.add(this.className);
		}
		this.nativeWidget.style.visibility = "hidden";
		this.nativeWidget.alt = this.altText;
		this.isNativeWidget = true;
	}
	,switchUseCrossOrigin: function(useCrossOrigin) {
		if(this.useCrossOrigin != useCrossOrigin) {
			this.useCrossOrigin = useCrossOrigin;
			if(useCrossOrigin) {
				var url = this.url;
				var tmp;
				if(url.indexOf("data:") == 0) {
					tmp = "";
				} else {
					var loc = window.location;
					var tempAnchor = window.document.createElement("a");
					tempAnchor.href = url;
					var samePort = !tempAnchor.port && loc.port == "" || tempAnchor.port == loc.port;
					tmp = tempAnchor.hostname != loc.hostname || !samePort || tempAnchor.protocol != loc.protocol ? "anonymous" : "";
				}
				this.nativeWidget.crossOrigin = tmp;
			} else {
				this.nativeWidget.crossOrigin = null;
			}
		}
	}
	,setPictureReferrerPolicy: function(referrerpolicy) {
		if(this.nativeWidget != null) {
			this.nativeWidget.referrerPolicy = referrerpolicy;
		}
	}
	,calculateWidgetBounds: function() {
		if(!this.widgetBoundsChanged) {
			return;
		}
		if((RenderSupport.RendererType == "html" || this.isHTML) && !this.isCanvas) {
			if(this.nativeWidget == null) {
				this.widgetBounds.clear();
			} else {
				this.nativeWidget.style.width = null;
				this.nativeWidget.style.height = null;
				this.widgetBounds.minX = 0;
				this.widgetBounds.minY = 0;
				if(this.nativeWidget.naturalWidth != null && this.nativeWidget.naturalHeight != null && (this.nativeWidget.naturalWidth > 0 || this.nativeWidget.naturalHeight > 0)) {
					this.widgetBounds.maxX = this.nativeWidget.naturalWidth;
					this.widgetBounds.maxY = this.nativeWidget.naturalHeight;
				} else if(this.isSvg) {
					var svgElement = this.nativeWidget.children[0];
					if(svgElement != null) {
						var viewBox = svgElement.viewBox.baseVal;
						var IMG_STANDARD_WIDTH = 300;
						var IMG_STANDARD_HEIGHT = 150;
						var svgWidth = viewBox.width;
						var svgHeight = viewBox.height;
						var scale = Math.min(1,Math.min(IMG_STANDARD_WIDTH / svgWidth,IMG_STANDARD_HEIGHT / svgHeight));
						this.widgetBounds.maxX = svgWidth * scale;
						this.widgetBounds.maxY = svgHeight * scale;
					}
				} else {
					window.document.body.appendChild(this.nativeWidget);
					this.widgetBounds.maxX = this.nativeWidget.clientWidth * RenderSupport.backingStoreRatio;
					this.widgetBounds.maxY = this.nativeWidget.clientHeight * RenderSupport.backingStoreRatio;
					DisplayObjectHelper.addNativeWidget(this);
				}
			}
		} else {
			this.widgetBounds.minX = 0;
			this.widgetBounds.minY = 0;
			this.widgetBounds.maxX = this.texture.width;
			this.widgetBounds.maxY = this.texture.height;
		}
		this.widgetBoundsChanged = false;
	}
	,__class__: FlowSprite
});
var GesturesDetector = function() { };
GesturesDetector.__name__ = true;
GesturesDetector.processPinch = function(p1,p2) {
	var distance = Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
	var state = 1;
	if(!GesturesDetector.IsPinchInProgress) {
		GesturesDetector.IsPinchInProgress = true;
		GesturesDetector.PinchInitialDistance = distance;
		state = 0;
	}
	GesturesDetector.CurrentPinchFocus.x = (p1.x + p2.x) / 2.0;
	GesturesDetector.CurrentPinchFocus.y = (p1.y + p2.y) / 2.0;
	GesturesDetector.CurrentPinchScaleFactor = distance / GesturesDetector.PinchInitialDistance;
	var _g = 0;
	var _g1 = GesturesDetector.PinchListeners;
	while(_g < _g1.length) {
		var l = _g1[_g];
		++_g;
		l(state,GesturesDetector.CurrentPinchFocus.x,GesturesDetector.CurrentPinchFocus.y,GesturesDetector.CurrentPinchScaleFactor,0.0);
	}
};
GesturesDetector.endPinch = function() {
	if(GesturesDetector.IsPinchInProgress) {
		GesturesDetector.IsPinchInProgress = false;
		var _g = 0;
		var _g1 = GesturesDetector.PinchListeners;
		while(_g < _g1.length) {
			var l = _g1[_g];
			++_g;
			l(2,GesturesDetector.CurrentPinchFocus.x,GesturesDetector.CurrentPinchFocus.y,GesturesDetector.CurrentPinchScaleFactor,0.0);
		}
	}
};
GesturesDetector.addPinchListener = function(cb) {
	GesturesDetector.PinchListeners.push(cb);
	return function() {
		HxOverrides.remove(GesturesDetector.PinchListeners,cb);
	};
};
var Lambda = function() { };
Lambda.__name__ = true;
Lambda.array = function(it) {
	var a = [];
	var i = $getIterator(it);
	while(i.hasNext()) {
		var i1 = i.next();
		a.push(i1);
	}
	return a;
};
Lambda.exists = function(it,f) {
	var x = $getIterator(it);
	while(x.hasNext()) {
		var x1 = x.next();
		if(f(x1)) {
			return true;
		}
	}
	return false;
};
Lambda.fold = function(it,f,first) {
	var x = $getIterator(it);
	while(x.hasNext()) {
		var x1 = x.next();
		first = f(x1,first);
	}
	return first;
};
Lambda.count = function(it,pred) {
	var n = 0;
	if(pred == null) {
		var _ = $getIterator(it);
		while(_.hasNext()) {
			var _1 = _.next();
			++n;
		}
	} else {
		var x = $getIterator(it);
		while(x.hasNext()) {
			var x1 = x.next();
			if(pred(x1)) {
				++n;
			}
		}
	}
	return n;
};
var FontLoader = function() { };
FontLoader.__name__ = true;
FontLoader.loadPreconfiguredWebFonts = function(names,onDone) {
	var config = JSON.parse(haxe_Resource.getString("webfontconfig"));
	var fontFields = ["google","custom"];
	var _g = 0;
	var _g1 = names.length;
	while(_g < _g1) {
		var i = _g++;
		loadCSSFileInternal("fonts/" + names[i] + "/def.css");
	}
	var _g = 0;
	var _g1 = fontFields.length;
	while(_g < _g1) {
		var i = _g++;
		var fontFieldsConfig = Reflect.field(config,fontFields[i]);
		var fonts = Reflect.field(fontFieldsConfig,"families");
		if(fonts != null) {
			var _g2 = 0;
			var _g3 = fonts.length;
			while(_g2 < _g3) {
				var j = _g2++;
				var font = fonts[j];
				var parts = font.split(":");
				var family = parts[0];
				var testString = null;
				if(names.indexOf(family) >= 0) {
					var testStrings = Reflect.field(fontFieldsConfig,"testStrings");
					if(testStrings != null) {
						testString = Reflect.field(testStrings,family);
						if(testString == null) {
							testString = "русский العصور english";
						}
					}
					FontLoader.addStyledTexts(family,parts.length > 1 ? parts[1] : null,testString);
				}
			}
		}
	}
	setTimeout(onDone, 25);
};
FontLoader.loadFSFont = function(family,url) {
	FontLoader.addFontFace(family,url);
	FontLoader.addStyledText(family);
};
FontLoader.loadWebFonts = function(onDone) {
	if(HaxeRuntime.typeof(WebFont) != "undefined") {
		var webfontconfig = JSON.parse(haxe_Resource.getString("webfontconfig"));
		if(webfontconfig != null && Reflect.fields(webfontconfig).length > 0) {
			webfontconfig.active = onDone;
			webfontconfig.inactive = onDone;
			webfontconfig.loading = function() {
				FontLoader.workaroundWebFontLoading(webfontconfig);
				Errors.print("Loading web fonts...");
			};
			WebFont.load(webfontconfig);
		} else {
			setTimeout(onDone, 25);
		}
		return webfontconfig;
	} else {
		Errors.print("WebFont is not defined");
		setTimeout(onDone, 25);
		return { };
	}
};
FontLoader.workaroundWebFontLoading = function(config) {
	var fontFields = ["google","custom"];
	var fontList = [];
	var testStringsMap_h = Object.create(null);
	testStringsMap_h[""] = "";
	var _g = 0;
	var _g1 = fontFields.length;
	while(_g < _g1) {
		var i = _g++;
		var fontFieldsConfig = Reflect.field(config,fontFields[i]);
		var fonts = Reflect.field(fontFieldsConfig,"families");
		if(fonts != null) {
			fontList = fontList.concat(fonts);
		}
		var testStrings = Reflect.field(fontFieldsConfig,"testStrings");
		if(testStrings != null) {
			var _g2 = 0;
			var _g3 = Reflect.fields(testStrings);
			while(_g2 < _g3.length) {
				var family = _g3[_g2];
				++_g2;
				testStringsMap_h[family] = Reflect.field(testStrings,family);
			}
		}
	}
	var _g = 0;
	var _g1 = fontList.length;
	while(_g < _g1) {
		var i = _g++;
		var font = fontList[i];
		var parts = font.split(":");
		var family = parts[0];
		var testString = testStringsMap_h[family];
		FontLoader.addStyledTexts(family,parts.length > 1 ? parts[1] : null);
	}
};
FontLoader.addStyledTexts = function(family,facesStr,testString) {
	if(testString == null) {
		testString = "";
	}
	if(facesStr == null) {
		FontLoader.addStyledText(family,"","",testString);
	} else {
		var styles = facesStr.split(",");
		var _g = 0;
		var _g1 = styles.length;
		while(_g < _g1) {
			var j = _g++;
			var weight = "";
			var style = "";
			if(FontLoader.wsReg.match(styles[j])) {
				weight = FontLoader.wsReg.matched(1);
				style = FontLoader.wsReg.matched(2);
			}
			FontLoader.addStyledText(family,weight,style,testString);
		}
	}
};
FontLoader.addStyledText = function(family,weight,style,testString) {
	if(testString == null) {
		testString = "";
	}
	if(style == null) {
		style = "";
	}
	if(weight == null) {
		weight = "";
	}
	var text = window.document.createElement("span");
	text.innerText = "Loading font '" + family + "' [" + testString + "]...";
	text.style.fontFamily = family;
	if(weight != "") {
		text.style.fontWeight = weight;
	}
	if(style != "") {
		text.style.fontStyle = style;
	}
	text.style.visibility = "hidden";
	text.style.position = "fixed";
	window.document.body.appendChild(text);
	Native.timer(FontLoader.FontLoadingTimeout,function() {
		window.document.body.removeChild(text);
	});
};
FontLoader.addFontFace = function(family,url) {
	var css = "@font-face {\tfont-family: " + family + "; src: url(" + url + "); }";
	var style = window.document.createElement("style");
	style.appendChild(window.document.createTextNode(css));
	window.document.head.appendChild(style);
};
var haxe_Resource = function() { };
haxe_Resource.__name__ = true;
haxe_Resource.getString = function(name) {
	var _g = 0;
	var _g1 = haxe_Resource.content;
	while(_g < _g1.length) {
		var x = _g1[_g];
		++_g;
		if(x.name == name) {
			if(x.str != null) {
				return x.str;
			}
			var b = haxe_crypto_Base64.decode(x.data);
			return b.toString();
		}
	}
	return null;
};
var haxe_io_Bytes = function(data) {
	this.length = data.byteLength;
	this.b = new Uint8Array(data);
	this.b.bufferValue = data;
	data.hxBytes = this;
	data.bytes = this.b;
};
haxe_io_Bytes.__name__ = true;
haxe_io_Bytes.ofString = function(s,encoding) {
	if(encoding == haxe_io_Encoding.RawNative) {
		var buf = new Uint8Array(s.length << 1);
		var _g = 0;
		var _g1 = s.length;
		while(_g < _g1) {
			var i = _g++;
			var c = s.charCodeAt(i);
			buf[i << 1] = c & 255;
			buf[i << 1 | 1] = c >> 8;
		}
		return new haxe_io_Bytes(buf.buffer);
	}
	var a = [];
	var i = 0;
	while(i < s.length) {
		var c = s.charCodeAt(i++);
		if(55296 <= c && c <= 56319) {
			c = c - 55232 << 10 | s.charCodeAt(i++) & 1023;
		}
		if(c <= 127) {
			a.push(c);
		} else if(c <= 2047) {
			a.push(192 | c >> 6);
			a.push(128 | c & 63);
		} else if(c <= 65535) {
			a.push(224 | c >> 12);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		} else {
			a.push(240 | c >> 18);
			a.push(128 | c >> 12 & 63);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		}
	}
	return new haxe_io_Bytes(new Uint8Array(a).buffer);
};
haxe_io_Bytes.ofData = function(b) {
	var hb = b.hxBytes;
	if(hb != null) {
		return hb;
	}
	return new haxe_io_Bytes(b);
};
haxe_io_Bytes.prototype = {
	getString: function(pos,len,encoding) {
		if(pos < 0 || len < 0 || pos + len > this.length) {
			throw haxe_Exception.thrown(haxe_io_Error.OutsideBounds);
		}
		if(encoding == null) {
			encoding = haxe_io_Encoding.UTF8;
		}
		var s = "";
		var b = this.b;
		var i = pos;
		var max = pos + len;
		switch(encoding._hx_index) {
		case 0:
			var debug = pos > 0;
			while(i < max) {
				var c = b[i++];
				if(c < 128) {
					if(c == 0) {
						break;
					}
					s += String.fromCodePoint(c);
				} else if(c < 224) {
					var code = (c & 63) << 6 | b[i++] & 127;
					s += String.fromCodePoint(code);
				} else if(c < 240) {
					var c2 = b[i++];
					var code1 = (c & 31) << 12 | (c2 & 127) << 6 | b[i++] & 127;
					s += String.fromCodePoint(code1);
				} else {
					var c21 = b[i++];
					var c3 = b[i++];
					var u = (c & 15) << 18 | (c21 & 127) << 12 | (c3 & 127) << 6 | b[i++] & 127;
					s += String.fromCodePoint(u);
				}
			}
			break;
		case 1:
			while(i < max) {
				var c = b[i++] | b[i++] << 8;
				s += String.fromCodePoint(c);
			}
			break;
		}
		return s;
	}
	,toString: function() {
		return this.getString(0,this.length);
	}
	,__class__: haxe_io_Bytes
};
var haxe_io_Encoding = $hxEnums["haxe.io.Encoding"] = { __ename__:true,__constructs__:null
	,UTF8: {_hx_name:"UTF8",_hx_index:0,__enum__:"haxe.io.Encoding",toString:$estr}
	,RawNative: {_hx_name:"RawNative",_hx_index:1,__enum__:"haxe.io.Encoding",toString:$estr}
};
haxe_io_Encoding.__constructs__ = [haxe_io_Encoding.UTF8,haxe_io_Encoding.RawNative];
var haxe_crypto_Base64 = function() { };
haxe_crypto_Base64.__name__ = true;
haxe_crypto_Base64.decode = function(str,complement) {
	if(complement == null) {
		complement = true;
	}
	if(complement) {
		while(HxOverrides.cca(str,str.length - 1) == 61) str = HxOverrides.substr(str,0,-1);
	}
	return new haxe_crypto_BaseCode(haxe_crypto_Base64.BYTES).decodeBytes(haxe_io_Bytes.ofString(str));
};
var haxe_crypto_BaseCode = function(base) {
	var len = base.length;
	var nbits = 1;
	while(len > 1 << nbits) ++nbits;
	if(nbits > 8 || len != 1 << nbits) {
		throw haxe_Exception.thrown("BaseCode : base length must be a power of two.");
	}
	this.base = base;
	this.nbits = nbits;
};
haxe_crypto_BaseCode.__name__ = true;
haxe_crypto_BaseCode.prototype = {
	initTable: function() {
		var tbl = [];
		var _g = 0;
		while(_g < 256) {
			var i = _g++;
			tbl[i] = -1;
		}
		var _g = 0;
		var _g1 = this.base.length;
		while(_g < _g1) {
			var i = _g++;
			tbl[this.base.b[i]] = i;
		}
		this.tbl = tbl;
	}
	,decodeBytes: function(b) {
		var nbits = this.nbits;
		var base = this.base;
		if(this.tbl == null) {
			this.initTable();
		}
		var tbl = this.tbl;
		var size = b.length * nbits >> 3;
		var out = new haxe_io_Bytes(new ArrayBuffer(size));
		var buf = 0;
		var curbits = 0;
		var pin = 0;
		var pout = 0;
		while(pout < size) {
			while(curbits < 8) {
				curbits += nbits;
				buf <<= nbits;
				var i = tbl[b.b[pin++]];
				if(i == -1) {
					throw haxe_Exception.thrown("BaseCode : invalid encoded char");
				}
				buf |= i;
			}
			curbits -= 8;
			out.b[pout++] = buf >> curbits & 255;
		}
		return out;
	}
	,__class__: haxe_crypto_BaseCode
};
var RenderSupport = function() {
};
RenderSupport.__name__ = true;
RenderSupport.debugLog = function(text,text2) {
	if(text2 == null) {
		text2 = "";
	}
	if(RenderSupport.DebugClip != null) {
		var innertext = RenderSupport.DebugClip.innerText;
		var newText = "";
		newText = innertext.split('\n').slice(-40).join('\n');
		RenderSupport.DebugClip.innerText = newText + ("\n" + text + " " + Std.string(text2));
	}
};
RenderSupport.on = function(event,fn,context) {
	RenderSupport.PixiStage.on(event,fn,context);
};
RenderSupport.off = function(event,fn,context) {
	RenderSupport.PixiStage.off(event,fn,context);
};
RenderSupport.once = function(event,fn,context) {
	RenderSupport.PixiStage.once(event,fn,context);
};
RenderSupport.emit = function(event,a1,a2,a3,a4,a5) {
	return RenderSupport.PixiStage.emit(event,a1,a2,a3,a4,a5);
};
RenderSupport.emitForAll = function(event,value) {
	var _g = 0;
	var _g1 = RenderSupport.FlowInstances;
	while(_g < _g1.length) {
		var instance = _g1[_g];
		++_g;
		instance.emit(event,value);
	}
};
RenderSupport.setRendererType = function(rendererType) {
	if(RenderSupport.RendererType != rendererType) {
		RenderSupport.RendererType = rendererType;
		RenderSupport.RoundPixels = Util.getParameter("roundpixels") != null ? Util.getParameter("roundpixels") != "0" : RenderSupport.RendererType != "html";
		RenderSupport.Antialias = Util.getParameter("antialias") != null ? Util.getParameter("antialias") == "1" : !Native.isTouchScreen() && (RenderSupport.RendererType != "webgl" || Native.detectDedicatedGPU());
		PIXI.TextMetrics.METRICS_STRING = ((Platform.isMacintosh || Platform.isIOS) && RenderSupport.RendererType != 'html') ? '|Éq█Å' : '|Éq';
		PixiWorkarounds.workaroundGetContext();
		RenderSupport.createPixiRenderer();
		TextClip.recalculateUseTextBackgroundWidget();
	}
};
RenderSupport.setRenderRoot = function(rootId) {
	var renderRoot = window.document.getElementById(rootId);
	if(renderRoot == null) {
		console.warn("Warning! Element with id = \"" + rootId + "\" has not been found");
	}
	if(renderRoot != RenderSupport.RenderRoot) {
		if(renderRoot.shadowRoot == null) {
			RenderSupport.previousRoot = RenderSupport.PixiStage.nativeWidget;
			RenderSupport.previousInstance = RenderSupport.PixiStage.flowInstance;
			RenderSupport.RenderRoot = renderRoot;
			if(RenderSupport.RenderRoot != null) {
				RenderSupport.RenderRoot.style.position = "relative";
				RenderSupport.RenderRoot.style.touchAction = "none";
				if(!Platform.isIE) {
					RenderSupport.RenderRoot.attachShadow({ mode : "open"});
				}
			}
			RenderSupport.setupPixiStage();
			RenderSupport.createPixiRenderer();
			var root = RenderSupport.PixiStage.nativeWidget;
			if(Platform.isMobile) {
				if(Platform.isAndroid || Platform.isChrome || Platform.isSafari && Platform.browserMajorVersion >= 13) {
					RenderSupport.updateNonPassiveEventListener(root,"pointerdown",RenderSupport.onpointerdown);
					RenderSupport.updateNonPassiveEventListener(root,"pointerup",RenderSupport.onpointerup);
					RenderSupport.updateNonPassiveEventListener(root,"pointermove",RenderSupport.onpointermove);
					RenderSupport.updateNonPassiveEventListener(root,"pointerout",RenderSupport.onpointerout);
				}
				RenderSupport.updateNonPassiveEventListener(root,"touchstart",RenderSupport.onpointerdown);
				RenderSupport.updateNonPassiveEventListener(root,"touchend",RenderSupport.onpointerup);
				RenderSupport.updateNonPassiveEventListener(root,"touchmove",RenderSupport.onpointermove);
			} else if(Platform.isSafari) {
				RenderSupport.updateNonPassiveEventListener(root,"mousedown",RenderSupport.onpointerdown);
				RenderSupport.updateNonPassiveEventListener(root,"mouseup",RenderSupport.onpointerup);
				RenderSupport.updateNonPassiveEventListener(root,"mousemove",RenderSupport.onpointermove);
				RenderSupport.updateNonPassiveEventListener(root,"mouseout",RenderSupport.onpointerout);
			} else if(Platform.isIE || Util.getParameter("debug_click_listener") == "1") {
				var stage = RenderSupport.PixiStage;
				root.onpointerdown = function(e) {
					RenderSupport.onpointerdown(e,stage);
				};
				root.onpointerup = function(e) {
					RenderSupport.onpointerup(e,stage);
				};
				root.onpointermove = function(e) {
					RenderSupport.onpointermove(e,stage);
				};
				root.onpointerout = function(e) {
					RenderSupport.onpointerout(e,stage);
				};
			} else {
				RenderSupport.updateNonPassiveEventListener(root,"pointerdown",RenderSupport.onpointerdown);
				RenderSupport.updateNonPassiveEventListener(root,"pointerup",RenderSupport.onpointerup);
				RenderSupport.updateNonPassiveEventListener(root,"pointermove",RenderSupport.onpointermove);
				RenderSupport.updateNonPassiveEventListener(root,"pointerout",RenderSupport.onpointerout);
				RenderSupport.updateNonPassiveEventListener(root,"touchstart",RenderSupport.blockEvent);
				RenderSupport.updateNonPassiveEventListener(root,"touchend",RenderSupport.blockEvent);
				RenderSupport.updateNonPassiveEventListener(root,"touchmove",RenderSupport.blockEvent);
			}
			RenderSupport.updateNonPassiveEventListener(root,"keydown",function(e,stage) {
				e.stopPropagation();
				if(RenderSupport.RendererType == "html") {
					RenderSupport.onKeyDownAccessibilityZoom(e);
				}
				RenderSupport.MousePos.x = e.clientX;
				RenderSupport.MousePos.y = e.clientY;
				RenderSupport.emitKey(stage,"keydown",e);
			});
			RenderSupport.updateNonPassiveEventListener(root,"keyup",function(e,stage) {
				e.stopPropagation();
				RenderSupport.MousePos.x = e.clientX;
				RenderSupport.MousePos.y = e.clientY;
				RenderSupport.emitKey(stage,"keyup",e);
			});
			var stage1 = RenderSupport.PixiStage;
			RenderSupport.setStageWheelHandler(function(p) {
				stage1.emit("mousewheel",p);
				RenderSupport.emitMouseEvent(stage1,"mousemove",RenderSupport.MousePos.x,RenderSupport.MousePos.y);
			});
			RenderSupport.on("mousedown",function(e) {
				RenderSupport.hadUserInteracted = true;
				RenderSupport.MouseUpReceived = false;
			});
			RenderSupport.on("mouseup",function(e) {
				RenderSupport.MouseUpReceived = true;
			});
			if(root != window.document.body) {
				RenderSupport.on("fullscreen",function() {
					var e = { target : window};
					if(!RenderSupport.printMode) {
						var oldBrowserZoom = RenderSupport.browserZoom;
						RenderSupport.backingStoreRatio = RenderSupport.getBackingStoreRatio();
						if(RenderSupport.backingStoreRatio != RenderSupport.PixiRenderer.resolution) {
							RenderSupport.createPixiRenderer();
						} else {
							var win_width = Platform.isSamsung ? Math.min(e.target.innerWidth,e.target.outerWidth) : e.target.innerWidth;
							var win_height = e.target.innerHeight;
							if(RenderSupport.viewportScaleWorkaroundEnabled) {
								var viewportScale = RenderSupport.getViewportScale();
								var portraitOrientation = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
								if(!(!RenderSupport.viewportScaleWorkaroundEnabled && (portraitOrientation ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape) != -1)) {
									var screenSize;
									if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
										var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
										screenSize = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
									} else {
										screenSize = { width : window.screen.width, height : window.screen.height};
									}
									var innerHeightCompensation = RenderSupport.viewportScaleWorkaroundEnabled && window.innerHeight == RenderSupport.InnerHeightAtRenderTime && screenSize.height != window.innerHeight && screenSize.height - window.innerHeight * RenderSupport.getViewportScale() < 100 ? 95.0 / RenderSupport.getViewportScale() : 0.0;
									var topHeight = RenderSupport.viewportScaleWorkaroundEnabled ? screenSize.height - window.innerHeight + innerHeightCompensation : screenSize.height - window.innerHeight * RenderSupport.browserZoom;
									if(portraitOrientation) {
										if(RenderSupport.WindowTopHeightPortrait == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
											RenderSupport.WindowTopHeightPortrait = topHeight;
										}
									} else if(RenderSupport.WindowTopHeightLandscape == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
										RenderSupport.WindowTopHeightLandscape = topHeight;
									}
								}
								var screen_size;
								if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
									var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
									screen_size = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
								} else {
									screen_size = { width : window.screen.width, height : window.screen.height};
								}
								win_width = screen_size.width;
								win_height = (screen_size.height - (window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0 ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape)) * viewportScale;
								window.document.documentElement.style.width = "calc(100% * " + viewportScale + ")";
								window.document.documentElement.style.height = "calc(100% * " + viewportScale + ")";
								window.document.documentElement.style.transform = "scale(" + 1 / viewportScale + ")";
								window.document.documentElement.style.transformOrigin = "0 0";
							} else if(Platform.isAndroid || Platform.isIOS && (Platform.isChrome || ProgressiveWebTools.isRunningPWA())) {
								var portraitOrientation = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
								if(!(!RenderSupport.viewportScaleWorkaroundEnabled && (portraitOrientation ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape) != -1)) {
									var screenSize;
									if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
										var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
										screenSize = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
									} else {
										screenSize = { width : window.screen.width, height : window.screen.height};
									}
									var innerHeightCompensation = RenderSupport.viewportScaleWorkaroundEnabled && window.innerHeight == RenderSupport.InnerHeightAtRenderTime && screenSize.height != window.innerHeight && screenSize.height - window.innerHeight * RenderSupport.getViewportScale() < 100 ? 95.0 / RenderSupport.getViewportScale() : 0.0;
									var topHeight = RenderSupport.viewportScaleWorkaroundEnabled ? screenSize.height - window.innerHeight + innerHeightCompensation : screenSize.height - window.innerHeight * RenderSupport.browserZoom;
									if(portraitOrientation) {
										if(RenderSupport.WindowTopHeightPortrait == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
											RenderSupport.WindowTopHeightPortrait = topHeight;
										}
									} else if(RenderSupport.WindowTopHeightLandscape == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
										RenderSupport.WindowTopHeightLandscape = topHeight;
									}
								}
								if(oldBrowserZoom == RenderSupport.browserZoom) {
									var screen_size;
									if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
										var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
										screen_size = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
									} else {
										screen_size = { width : window.screen.width, height : window.screen.height};
									}
									if(!Platform.isAndroid) {
										win_width = screen_size.width;
									}
									win_height = Math.floor((screen_size.height - (RenderSupport.IsFullScreen ? 0.0 : window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0 ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape)) / RenderSupport.browserZoom);
								}
								if(Platform.isAndroid) {
									RenderSupport.PixiStage.y = 0.0;
									RenderSupport.ensureCurrentInputVisible();
								}
							}
							if(RenderSupport.RenderRoot != null) {
								var _g = 0;
								var _g1 = RenderSupport.FlowInstances;
								while(_g < _g1.length) {
									var instance = _g1[_g];
									++_g;
									var renderRoot = instance.stage.nativeWidget.host;
									var pixiView = instance.renderer.view;
									win_width = RenderSupport.getRenderRootWidth(renderRoot);
									win_height = RenderSupport.getRenderRootHeight(renderRoot);
									pixiView.width = win_width * RenderSupport.backingStoreRatio;
									pixiView.height = win_height * RenderSupport.backingStoreRatio;
									pixiView.style.width = win_width;
									pixiView.style.height = win_height;
									instance.renderer.resize(win_width,win_height);
								}
							} else {
								RenderSupport.PixiView.width = win_width * RenderSupport.backingStoreRatio;
								RenderSupport.PixiView.height = win_height * RenderSupport.backingStoreRatio;
								RenderSupport.PixiView.style.width = win_width;
								RenderSupport.PixiView.style.height = win_height;
								RenderSupport.PixiRenderer.resize(win_width,win_height);
							}
						}
						RenderSupport.broadcastResizeEvent();
						RenderSupport.InvalidateLocalStages();
						RenderSupport.animate();
					}
				});
			}
			RenderSupport.switchFocusFramesShow(false);
			RenderSupport.setDropCurrentFocusOnMouse(true);
			RenderSupport.attachFlowStyles();
			if(RenderSupport.UserStyleTestElement != null && RenderSupport.UserStyleTestElement.parentElement != RenderSupport.PixiStage.nativeWidget) {
				RenderSupport.PixiStage.nativeWidget.appendChild(RenderSupport.UserStyleTestElement);
			}
		} else {
			var existingInstance = RenderSupport.getInstanceByRootId(rootId);
			if(existingInstance == null) {
				console.warn("WARNING! Existing instance has not been found into FlowInstances");
			} else {
				RenderSupport.RenderRoot = renderRoot;
				RenderSupport.PixiStage = existingInstance.stage;
			}
		}
	}
};
RenderSupport.getRenderRoot = function() {
	if(RenderSupport.RenderRoot == null) {
		return "";
	}
	return RenderSupport.RenderRoot.id;
};
RenderSupport.attachFlowStyles = function() {
	RenderSupport.attachFlowStyle("flowjspixi.css");
	RenderSupport.attachFlowStyle("fonts/fonts.css");
	if(Platform.isIE) {
		window.document.body.style.overflow = "auto";
		RenderSupport.PixiStage.nativeWidget.classList.add("renderRoot");
		Native.timer(0,function() {
			RenderSupport.findFlowjspixiCss(function(pixijscss) {
				try {
					pixijscss.deleteRule(0);
					pixijscss.insertRule(".renderRoot * {position: fixed;}",0);
				} catch( _g ) {
					haxe_NativeStackTrace.lastError = _g;
				}
			});
		});
	}
};
RenderSupport.attachFlowStyle = function(url) {
	var flowStyle = window.document.head.querySelector("link[href*='" + url + "']");
	if(flowStyle != null) {
		if(Platform.isIE) {
			flowStyle.setAttribute("rel","stylesheet");
		} else {
			var clonedNode = flowStyle.cloneNode();
			RenderSupport.PixiStage.nativeWidget.appendChild(clonedNode);
			clonedNode.setAttribute("rel","stylesheet");
		}
	}
};
RenderSupport.setupPixiStage = function() {
	RenderSupport.PixiStage = new FlowContainer(true);
};
RenderSupport.setKeepTextClips = function(keep) {
	TextClip.KeepTextClips = keep;
};
RenderSupport.getRendererType = function() {
	return RenderSupport.RendererType;
};
RenderSupport.roundPlus = function(x,n) {
	var m = Math.pow(10,n);
	return Math.round(x * m) / m;
};
RenderSupport.getAccessibilityZoom = function() {
	if(RenderSupport.RendererType == "html" && RenderSupport.accessibilityZoom > 0.0) {
		return RenderSupport.accessibilityZoom;
	} else {
		return 1.0;
	}
};
RenderSupport.setAccessibilityZoom = function(zoom) {
	RenderSupport.debugLog("setAccessibilityZoom",zoom);
	RenderSupport.debugLog("accessibilityZoom",RenderSupport.accessibilityZoom);
	if(RenderSupport.accessibilityZoom != zoom) {
		RenderSupport.accessibilityZoom = zoom;
		Native.setKeyValue("accessibility_zoom",zoom == null ? "null" : "" + zoom);
		RenderSupport.broadcastResizeEvent();
		RenderSupport.InvalidateLocalStages();
		RenderSupport.showAccessibilityZoomTooltip();
	}
};
RenderSupport.showAccessibilityZoomTooltip = function() {
	RenderSupport.debugLog("browserZoom",RenderSupport.browserZoom);
	if(RenderSupport.accessibilityZoomTooltip != null) {
		RenderSupport.accessibilityZoomTooltip.parentNode.removeChild(RenderSupport.accessibilityZoomTooltip);
		RenderSupport.accessibilityZoomTooltip = null;
	}
	if(RenderSupport.browserZoom != 1.0) {
		return;
	}
	var p = window.document.createElement("p");
	RenderSupport.PixiStage.nativeWidget.appendChild(p);
	p.classList.add("nativeWidget");
	p.classList.add("textWidget");
	p.textContent = "Zoom: " + Math.round(RenderSupport.accessibilityZoom * 100) + "%";
	p.style.fontSize = "12px";
	p.style.zIndex = "1000";
	p.style.background = "#424242";
	p.style.color = "#FFFFFF";
	p.style.padding = "8px";
	p.style.paddingTop = "4px";
	p.style.paddingBottom = "4px";
	p.style.borderRadius = "4px";
	p.style.left = "50%";
	p.style.top = "8px";
	p.style.transform = "translate(-50%, 0)";
	RenderSupport.accessibilityZoomTooltip = p;
	Native.timer(2000,function() {
		if(RenderSupport.accessibilityZoomTooltip != null && RenderSupport.accessibilityZoomTooltip == p) {
			RenderSupport.accessibilityZoomTooltip.parentNode.removeChild(RenderSupport.accessibilityZoomTooltip);
			RenderSupport.accessibilityZoomTooltip = null;
		}
	});
};
RenderSupport.onKeyDownAccessibilityZoom = function(e) {
	if(RenderSupport.browserZoom != 1.0) {
		return;
	}
	if(Platform.isMacintosh ? e.metaKey == true : e.ctrlKey == true) {
		if(e.which == "61" || e.which == "107" || e.which == "187") {
			e.preventDefault();
			RenderSupport.setAccessibilityZoom(Lambda.fold(RenderSupport.accessibilityZoomValues,function(a,b) {
				if(a < b && a > RenderSupport.getAccessibilityZoom()) {
					return a;
				} else {
					return b;
				}
			},5.0));
		} else if(e.which == "173" || e.which == "109" || e.which == "189") {
			e.preventDefault();
			RenderSupport.setAccessibilityZoom(Lambda.fold(RenderSupport.accessibilityZoomValues,function(a,b) {
				if(a > b && a < RenderSupport.getAccessibilityZoom()) {
					return a;
				} else {
					return b;
				}
			},0.25));
		}
	}
};
RenderSupport.onMouseWheelAccessibilityZoom = function(e,dx,dy) {
	if(RenderSupport.browserZoom != 1.0 || Platform.isMacintosh) {
		return false;
	}
	if(Platform.isMacintosh ? e.metaKey == true : e.ctrlKey == true) {
		if(dy > 0) {
			e.preventDefault();
			if(RenderSupport.onMouseWheelAccessibilityZoomEnabled) {
				RenderSupport.onMouseWheelAccessibilityZoomEnabled = false;
				RenderSupport.setAccessibilityZoom(Lambda.fold(RenderSupport.accessibilityZoomValues,function(a,b) {
					if(a < b && a > RenderSupport.getAccessibilityZoom()) {
						return a;
					} else {
						return b;
					}
				},5.0));
				RenderSupport.once("drawframe",function() {
					RenderSupport.onMouseWheelAccessibilityZoomEnabled = true;
				});
			}
			return true;
		} else if(dy < 0) {
			e.preventDefault();
			if(RenderSupport.onMouseWheelAccessibilityZoomEnabled) {
				RenderSupport.onMouseWheelAccessibilityZoomEnabled = false;
				RenderSupport.setAccessibilityZoom(Lambda.fold(RenderSupport.accessibilityZoomValues,function(a,b) {
					if(a > b && a < RenderSupport.getAccessibilityZoom()) {
						return a;
					} else {
						return b;
					}
				},0.25));
				RenderSupport.once("drawframe",function() {
					RenderSupport.onMouseWheelAccessibilityZoomEnabled = true;
				});
			}
			return true;
		}
	}
	return false;
};
RenderSupport.createUserStyleTestElement = function() {
	if(RenderSupport.UserStyleTestElement == null) {
		RenderSupport.UserStyleTestElement = window.document.createElement("p");
		RenderSupport.UserStyleTestElement.setAttribute("role","presentation");
		RenderSupport.UserStyleTestElement.style.visibility = "hidden";
		window.document.body.appendChild(RenderSupport.UserStyleTestElement);
	}
};
RenderSupport.getUserDefinedFontSize = function() {
	if(RenderSupport.UserDefinedFontSize == null) {
		RenderSupport.createUserStyleTestElement();
		var style = window.getComputedStyle(RenderSupport.UserStyleTestElement);
		RenderSupport.UserDefinedFontSize = parseFloat(style.fontSize);
	}
	var f = RenderSupport.UserDefinedFontSize;
	if(isNaN(f)) {
		RenderSupport.UserDefinedFontSize = 16.0;
	}
	return RenderSupport.UserDefinedFontSize;
};
RenderSupport.getUserDefinedLetterSpacing = function() {
	RenderSupport.createUserStyleTestElement();
	var style = window.getComputedStyle(RenderSupport.UserStyleTestElement);
	RenderSupport.UserDefinedLetterSpacing = style.letterSpacing != "normal" ? new String(style.letterSpacing).indexOf("em") >= 0 ? 0.0 : parseFloat(style.letterSpacing) : 0.0;
	return RenderSupport.UserDefinedLetterSpacing;
};
RenderSupport.getUserDefinedLineHeightPercent = function() {
	RenderSupport.createUserStyleTestElement();
	var style = window.getComputedStyle(RenderSupport.UserStyleTestElement);
	RenderSupport.UserDefinedLineHeightPercent = style.lineHeight != "normal" ? new String(style.lineHeight).indexOf("em") >= 0 ? parseFloat(style.lineHeight) : parseFloat(style.lineHeight) / parseFloat(style.fontSize) : 1.15;
	return RenderSupport.UserDefinedLineHeightPercent;
};
RenderSupport.getUserDefinedWordSpacingPercent = function() {
	RenderSupport.createUserStyleTestElement();
	var style = window.getComputedStyle(RenderSupport.UserStyleTestElement);
	RenderSupport.UserDefinedWordSpacingPercent = style.wordSpacing != "normal" ? new String(style.wordSpacing).indexOf("em") >= 0 ? parseFloat(style.wordSpacing) : parseFloat(style.wordSpacing) / parseFloat(style.fontSize) : 0.0;
	return RenderSupport.UserDefinedWordSpacingPercent;
};
RenderSupport.getUserDefinedLetterSpacingPercent = function() {
	RenderSupport.createUserStyleTestElement();
	var style = window.getComputedStyle(RenderSupport.UserStyleTestElement);
	RenderSupport.UserDefinedLetterSpacingPercent = style.letterSpacing != "normal" ? new String(style.letterSpacing).indexOf("em") >= 0 ? parseFloat(style.letterSpacing) : 0.0 : 0.0;
	return RenderSupport.UserDefinedLetterSpacingPercent;
};
RenderSupport.emitUserStyleChanged = function() {
	if(!RenderSupport.UserStylePending) {
		RenderSupport.UserStylePending = true;
		var userStyleChanged = RenderSupport.checkUserStyleChanged();
		RenderSupport.once("drawframe",function() {
			if(userStyleChanged) {
				RenderSupport.emit("userstylechanged");
			}
			RenderSupport.UserStylePending = false;
		});
	}
};
RenderSupport.checkUserStyleChanged = function() {
	return RenderSupport.UserDefinedLetterSpacing != RenderSupport.getUserDefinedLetterSpacing() | RenderSupport.UserDefinedLetterSpacingPercent != RenderSupport.getUserDefinedLetterSpacingPercent() | RenderSupport.UserDefinedWordSpacingPercent != RenderSupport.getUserDefinedWordSpacingPercent() | RenderSupport.UserDefinedLineHeightPercent != RenderSupport.getUserDefinedLineHeightPercent();
};
RenderSupport.isInsideFrame = function() {
	try {
		return window.self !== window.top;
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		return true;
	}
};
RenderSupport.isViewportScaleWorkaroundEnabled = function() {
	try {
		if(Platform.isIOS && Platform.isChrome) {
			return RenderSupport.isInsideFrame();
		} else {
			return false;
		}
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		var e = haxe_Exception.caught(_g).unwrap();
		console.log("isViewportScaleWorkaroundEnabled error : ");
		console.log(e);
		return false;
	}
};
RenderSupport.monitorUserStyleChanges = function() {
	return Native.setInterval(1000,RenderSupport.emitUserStyleChanged);
};
RenderSupport.setPrintPageSize = function(wd,hgt) {
	var style = window.document.createElement("style");
	style.setAttribute("type","text/css");
	style.innerHTML = "@page { size: " + wd + "px " + hgt + "px !important; margin:0 !important; padding:0 !important; } " + ".print-page { width: 100% !important; height: 100% !important; overflow: hidden !important; }";
	window.document.head.appendChild(style);
	return function() {
		window.document.head.removeChild(style);
	};
};
RenderSupport.getClipHTML = function(clip) {
	if(!RenderSupport.printMode) {
		RenderSupport.printMode = true;
		RenderSupport.prevInvalidateRenderable = DisplayObjectHelper.InvalidateRenderable;
		DisplayObjectHelper.InvalidateRenderable = false;
	}
	DisplayObjectHelper.initNativeWidget(clip);
	var clip1 = RenderSupport.PixiStage;
	if(clip1.renderable != true) {
		clip1.renderable = true;
		DisplayObjectHelper.invalidateVisible(clip1);
		if(!clip1.keepNativeWidget) {
			DisplayObjectHelper.invalidateTransform(clip1,"setClipRenderable");
		}
	}
	var _g = 0;
	var _g1 = clip1.children || [];
	while(_g < _g1.length) {
		var child = _g1[_g];
		++_g;
		if(child.clipVisible && !child.isMask) {
			var renderable = true;
			if(renderable == null) {
				renderable = true;
			}
			if(child.renderable != renderable) {
				child.renderable = renderable;
				DisplayObjectHelper.invalidateVisible(child);
				if(!child.keepNativeWidget) {
					DisplayObjectHelper.invalidateTransform(child,"setClipRenderable");
				}
			}
			var _g2 = 0;
			var _g3 = child.children || [];
			while(_g2 < _g3.length) {
				var child1 = _g3[_g2];
				++_g2;
				if(child1.clipVisible && !child1.isMask) {
					DisplayObjectHelper.forceClipRenderable(child1,renderable);
				}
			}
		}
	}
	RenderSupport.forceRender();
	var nativeWidget = clip.nativeWidget;
	var content = nativeWidget ? nativeWidget.innerHTML : "";
	if(RenderSupport.printMode) {
		RenderSupport.printMode = false;
		DisplayObjectHelper.InvalidateRenderable = RenderSupport.prevInvalidateRenderable;
	}
	return content;
};
RenderSupport.showPrintDialog = function() {
	if(!RenderSupport.printMode) {
		RenderSupport.printMode = true;
		RenderSupport.prevInvalidateRenderable = DisplayObjectHelper.InvalidateRenderable;
		DisplayObjectHelper.InvalidateRenderable = false;
	}
	var clip = RenderSupport.PixiStage;
	if(clip.renderable != true) {
		clip.renderable = true;
		DisplayObjectHelper.invalidateVisible(clip);
		if(!clip.keepNativeWidget) {
			DisplayObjectHelper.invalidateTransform(clip,"setClipRenderable");
		}
	}
	var _g = 0;
	var _g1 = clip.children || [];
	while(_g < _g1.length) {
		var child = _g1[_g];
		++_g;
		if(child.clipVisible && !child.isMask) {
			var renderable = true;
			if(renderable == null) {
				renderable = true;
			}
			if(child.renderable != renderable) {
				child.renderable = renderable;
				DisplayObjectHelper.invalidateVisible(child);
				if(!child.keepNativeWidget) {
					DisplayObjectHelper.invalidateTransform(child,"setClipRenderable");
				}
			}
			var _g2 = 0;
			var _g3 = child.children || [];
			while(_g2 < _g3.length) {
				var child1 = _g3[_g2];
				++_g2;
				if(child1.clipVisible && !child1.isMask) {
					DisplayObjectHelper.forceClipRenderable(child1,renderable);
				}
			}
		}
	}
	RenderSupport.emit("beforeprint");
	var openPrintDialog = function() {
		RenderSupport.forceRender();
		DisplayObjectHelper.onImagesLoaded(RenderSupport.PixiStage,function() {
			if(RenderSupport.forceOnAfterprint) {
				RenderSupport.PixiStage.once("drawframe",function() {
					RenderSupport.emit("afterprint");
				});
			}
			window.print();
		});
	};
	if(Native.isNew) {
		RenderSupport.PixiStage.once("drawframe",openPrintDialog);
	} else {
		Native.timer(10,openPrintDialog);
	}
};
RenderSupport.getBackingStoreRatio = function() {
	var ratio = (window.devicePixelRatio != null ? window.devicePixelRatio : 1.0) * (Util.getParameter("resolution") != null ? parseFloat(Util.getParameter("resolution")) : 1.0);
	RenderSupport.browserZoom = Platform.isSamsung ? Math.max(window.outerWidth / window.innerWidth,1.0) : window.outerWidth / window.innerWidth;
	if(!Platform.isMobile && RenderSupport.browserZoom != 1.0) {
		RenderSupport.accessibilityZoom = 1.0;
		Native.setKeyValue("accessibility_zoom","1.0");
	}
	if(Platform.isSafari && !Platform.isMobile) {
		ratio *= RenderSupport.browserZoom;
	}
	return Math.max(RenderSupport.roundPlus(ratio,2),1.0);
};
RenderSupport.defer = function(fn,time) {
	if(time == null) {
		time = 10;
	}
	setTimeout(fn, time);
};
RenderSupport.preventDefaultFileDrop = function() {
	window.ondragover = window.ondrop = function(event) {
		if(event.dataTransfer.dropEffect != "copy") {
			event.dataTransfer.dropEffect = "none";
		}
		event.preventDefault();
		return false;
	};
};
RenderSupport.init = function() {
	if(RenderSupport.PixiStage == null) {
		RenderSupport.setupPixiStage();
	}
	if(Util.getParameter("oldjs") != "1") {
		RenderSupport.initPixiRenderer();
		if(RenderSupport.mainNoDelay) {
			RenderSupport.defer(RenderSupport.StartFlowMainWithTimeCheck);
		}
	} else {
		RenderSupport.defer(RenderSupport.StartFlowMain);
	}
	return true;
};
RenderSupport.printOptionValues = function() {
	if(RenderSupport.AccessibilityEnabled) {
		Errors.print("Flow Pixi renderer DEBUG mode is turned on");
	}
};
RenderSupport.disablePixiPlugins = function() {
	delete PIXI.CanvasRenderer.__plugins.accessibility;
	delete PIXI.CanvasRenderer.__plugins.tilingSprite;
	delete PIXI.CanvasRenderer.__plugins.mesh;
	delete PIXI.CanvasRenderer.__plugins.particle;
	delete PIXI.CanvasRenderer.__plugins.prepare;
	delete PIXI.WebGLRenderer.__plugins.accessibility;
	delete PIXI.WebGLRenderer.__plugins.extract;
	delete PIXI.WebGLRenderer.__plugins.tilingSprite;
	delete PIXI.WebGLRenderer.__plugins.mesh;
	delete PIXI.WebGLRenderer.__plugins.particle;
	delete PIXI.WebGLRenderer.__plugins.prepare;
	PIXI.ticker.shared.autoStart = false;
	PIXI.ticker.shared.stop();
	PIXI.ticker.shared.destroy();
};
RenderSupport.createPixiRenderer = function() {
	RenderSupport.backingStoreRatio = RenderSupport.getBackingStoreRatio();
	if(RenderSupport.PixiRenderer != null && (RenderSupport.previousRoot == null || RenderSupport.previousRoot == window.document.body)) {
		if(RenderSupport.PixiRenderer.gl != null && RenderSupport.PixiRenderer.gl.destroy != null) {
			RenderSupport.PixiRenderer.gl.destroy();
		}
		RenderSupport.PixiRenderer.destroy();
		var _g = [];
		var _g1 = 0;
		var _g2 = RenderSupport.FlowInstances;
		while(_g1 < _g2.length) {
			var v = _g2[_g1];
			++_g1;
			if(v.renderer != RenderSupport.PixiRenderer) {
				_g.push(v);
			}
		}
		RenderSupport.FlowInstances = _g;
	}
	if(RenderSupport.PixiView != null && RenderSupport.PixiView.parentNode != null && RenderSupport.previousRoot == window.document.body) {
		RenderSupport.PixiView.parentNode.removeChild(RenderSupport.PixiView);
	}
	if(RenderSupport.RendererType == "html") {
		RenderSupport.PixiView = window.document.createElement("div");
		RenderSupport.PixiView.style.background = "white";
	} else if(RenderSupport.RendererType != "canvas") {
		RenderSupport.PixiView = null;
	}
	var options = { antialias : RenderSupport.Antialias, transparent : RenderSupport.TransparentBackground, backgroundColor : RenderSupport.TransparentBackground ? 0 : 16777215, preserveDrawingBuffer : false, resolution : RenderSupport.backingStoreRatio, roundPixels : RenderSupport.RoundPixels, autoResize : true, view : RenderSupport.PixiView};
	var width = window.innerWidth;
	var height = window.innerHeight;
	if(RenderSupport.RenderRoot != null) {
		width = RenderSupport.getRenderRootWidth();
		height = RenderSupport.getRenderRootHeight();
		Native.timer(0,function() {
			if(width != RenderSupport.getRenderRootWidth() || height != RenderSupport.getRenderRootHeight()) {
				var e = { target : window};
				if(!RenderSupport.printMode) {
					var oldBrowserZoom = RenderSupport.browserZoom;
					RenderSupport.backingStoreRatio = RenderSupport.getBackingStoreRatio();
					if(RenderSupport.backingStoreRatio != RenderSupport.PixiRenderer.resolution) {
						RenderSupport.createPixiRenderer();
					} else {
						var win_width = Platform.isSamsung ? Math.min(e.target.innerWidth,e.target.outerWidth) : e.target.innerWidth;
						var win_height = e.target.innerHeight;
						if(RenderSupport.viewportScaleWorkaroundEnabled) {
							var viewportScale = RenderSupport.getViewportScale();
							var portraitOrientation = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
							if(!(!RenderSupport.viewportScaleWorkaroundEnabled && (portraitOrientation ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape) != -1)) {
								var screenSize;
								if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
									var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
									screenSize = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
								} else {
									screenSize = { width : window.screen.width, height : window.screen.height};
								}
								var innerHeightCompensation = RenderSupport.viewportScaleWorkaroundEnabled && window.innerHeight == RenderSupport.InnerHeightAtRenderTime && screenSize.height != window.innerHeight && screenSize.height - window.innerHeight * RenderSupport.getViewportScale() < 100 ? 95.0 / RenderSupport.getViewportScale() : 0.0;
								var topHeight = RenderSupport.viewportScaleWorkaroundEnabled ? screenSize.height - window.innerHeight + innerHeightCompensation : screenSize.height - window.innerHeight * RenderSupport.browserZoom;
								if(portraitOrientation) {
									if(RenderSupport.WindowTopHeightPortrait == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
										RenderSupport.WindowTopHeightPortrait = topHeight;
									}
								} else if(RenderSupport.WindowTopHeightLandscape == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
									RenderSupport.WindowTopHeightLandscape = topHeight;
								}
							}
							var screen_size;
							if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
								var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
								screen_size = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
							} else {
								screen_size = { width : window.screen.width, height : window.screen.height};
							}
							win_width = screen_size.width;
							win_height = (screen_size.height - (window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0 ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape)) * viewportScale;
							window.document.documentElement.style.width = "calc(100% * " + viewportScale + ")";
							window.document.documentElement.style.height = "calc(100% * " + viewportScale + ")";
							window.document.documentElement.style.transform = "scale(" + 1 / viewportScale + ")";
							window.document.documentElement.style.transformOrigin = "0 0";
						} else if(Platform.isAndroid || Platform.isIOS && (Platform.isChrome || ProgressiveWebTools.isRunningPWA())) {
							var portraitOrientation = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
							if(!(!RenderSupport.viewportScaleWorkaroundEnabled && (portraitOrientation ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape) != -1)) {
								var screenSize;
								if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
									var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
									screenSize = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
								} else {
									screenSize = { width : window.screen.width, height : window.screen.height};
								}
								var innerHeightCompensation = RenderSupport.viewportScaleWorkaroundEnabled && window.innerHeight == RenderSupport.InnerHeightAtRenderTime && screenSize.height != window.innerHeight && screenSize.height - window.innerHeight * RenderSupport.getViewportScale() < 100 ? 95.0 / RenderSupport.getViewportScale() : 0.0;
								var topHeight = RenderSupport.viewportScaleWorkaroundEnabled ? screenSize.height - window.innerHeight + innerHeightCompensation : screenSize.height - window.innerHeight * RenderSupport.browserZoom;
								if(portraitOrientation) {
									if(RenderSupport.WindowTopHeightPortrait == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
										RenderSupport.WindowTopHeightPortrait = topHeight;
									}
								} else if(RenderSupport.WindowTopHeightLandscape == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
									RenderSupport.WindowTopHeightLandscape = topHeight;
								}
							}
							if(oldBrowserZoom == RenderSupport.browserZoom) {
								var screen_size;
								if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
									var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
									screen_size = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
								} else {
									screen_size = { width : window.screen.width, height : window.screen.height};
								}
								if(!Platform.isAndroid) {
									win_width = screen_size.width;
								}
								win_height = Math.floor((screen_size.height - (RenderSupport.IsFullScreen ? 0.0 : window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0 ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape)) / RenderSupport.browserZoom);
							}
							if(Platform.isAndroid) {
								RenderSupport.PixiStage.y = 0.0;
								RenderSupport.ensureCurrentInputVisible();
							}
						}
						if(RenderSupport.RenderRoot != null) {
							var _g = 0;
							var _g1 = RenderSupport.FlowInstances;
							while(_g < _g1.length) {
								var instance = _g1[_g];
								++_g;
								var renderRoot = instance.stage.nativeWidget.host;
								var pixiView = instance.renderer.view;
								win_width = RenderSupport.getRenderRootWidth(renderRoot);
								win_height = RenderSupport.getRenderRootHeight(renderRoot);
								pixiView.width = win_width * RenderSupport.backingStoreRatio;
								pixiView.height = win_height * RenderSupport.backingStoreRatio;
								pixiView.style.width = win_width;
								pixiView.style.height = win_height;
								instance.renderer.resize(win_width,win_height);
							}
						} else {
							RenderSupport.PixiView.width = win_width * RenderSupport.backingStoreRatio;
							RenderSupport.PixiView.height = win_height * RenderSupport.backingStoreRatio;
							RenderSupport.PixiView.style.width = win_width;
							RenderSupport.PixiView.style.height = win_height;
							RenderSupport.PixiRenderer.resize(win_width,win_height);
						}
					}
					RenderSupport.broadcastResizeEvent();
					RenderSupport.InvalidateLocalStages();
					RenderSupport.animate();
				}
			}
		});
	}
	if(RenderSupport.RendererType == "webgl") {
		RenderSupport.PixiRenderer = new PIXI.WebGLRenderer(width,height,options);
		RenderSupport.RendererType = "webgl";
	} else if(RenderSupport.RendererType == "auto") {
		RenderSupport.PixiRenderer = PIXI.autoDetectRenderer(options,width,height);
		if(HaxeRuntime.instanceof(RenderSupport.PixiRenderer,PIXI.WebGLRenderer)) {
			RenderSupport.RendererType = "webgl";
		} else {
			RenderSupport.RendererType = "canvas";
		}
	} else if(RenderSupport.RendererType == "html") {
		RenderSupport.PixiRenderer = new PIXI.CanvasRenderer(width,height,options);
	} else {
		RenderSupport.PixiRenderer = new PIXI.CanvasRenderer(width,height,options);
		RenderSupport.RendererType = "canvas";
	}
	if(RenderSupport.PixiStage.flowInstance == null) {
		var newInstance = new FlowInstance(RenderSupport.getRenderRoot(),RenderSupport.PixiStage,RenderSupport.PixiRenderer);
		RenderSupport.PixiStage.flowInstance = newInstance;
	} else {
		RenderSupport.PixiStage.flowInstance.renderer = RenderSupport.PixiRenderer;
	}
	RenderSupport.FlowInstances.push(RenderSupport.PixiStage.flowInstance);
	if(RenderSupport.RendererType == "canvas") {
		RenderSupport.PixiRenderer.context.fillStyle = "white";
		RenderSupport.PixiRenderer.context.fillRect(0,0,RenderSupport.PixiRenderer.view.width,RenderSupport.PixiRenderer.view.height);
		RenderSupport.PixiRenderer.plugins.interaction.mouseOverRenderer = true;
		var tempPlugins = PIXI.WebGLRenderer.__plugins;
		PIXI.WebGLRenderer.__plugins = [];
		PIXI.WebGLRenderer.__plugins = tempPlugins;
	} else if(RenderSupport.RendererType == "webgl") {
		RenderSupport.PixiRenderer.gl.viewport(0,0,RenderSupport.PixiRenderer.gl.drawingBufferWidth,RenderSupport.PixiRenderer.gl.drawingBufferHeight);
		RenderSupport.PixiRenderer.gl.clearColor(1.0,1.0,1.0,1.0);
		RenderSupport.PixiRenderer.gl.clear(RenderSupport.PixiRenderer.gl.COLOR_BUFFER_BIT);
	} else if(RenderSupport.RendererType == "html") {
		RenderSupport.PixiRenderer.plugins.interaction.removeEvents();
		RenderSupport.PixiRenderer.plugins.interaction.interactionDOMElement = RenderSupport.PixiView;
	}
	RenderSupport.PixiView = RenderSupport.PixiRenderer.view;
	RenderSupport.PixiView.tabIndex = 1;
	RenderSupport.PixiView.onfocus = function(e) {
		var accessWidget = AccessWidget.tree.getFirstAccessWidget();
		if(accessWidget != null && accessWidget.get_element() != null && accessWidget.clip != null && accessWidget.get_element() != e.relatedTarget) {
			RenderSupport.setFocus(accessWidget.clip,true);
		} else {
			accessWidget = AccessWidget.tree.getLastAccessWidget();
			if(accessWidget != null && accessWidget.get_element() != null && accessWidget.clip != null && accessWidget.get_element() != e.relatedTarget) {
				RenderSupport.setFocus(accessWidget.clip,true);
			}
		}
	};
	if(RenderSupport.IsLoading) {
		RenderSupport.PixiView.style.display = "none";
	}
	if(Platform.isSafari || RenderSupport.PixiStage.nativeWidget != window.document.body) {
		RenderSupport.PixiView.style.position = "absolute";
		RenderSupport.PixiView.style.top = "0px";
	}
	RenderSupport.PixiView.style.zIndex = AccessWidget.zIndexValues.canvas;
	RenderSupport.PixiStage.nativeWidget.insertBefore(RenderSupport.PixiView,RenderSupport.PixiStage.nativeWidget.firstChild);
	var ctx = RenderSupport.PixiRenderer.context;
	if(ctx != null) {
		ctx.mozImageSmoothingEnabled = true;
		ctx.webkitImageSmoothingEnabled = true;
		ctx.imageSmoothingQuality = Platform.isChrome ? "high" : "medium";
		ctx.msImageSmoothingEnabled = true;
		ctx.imageSmoothingEnabled = true;
	}
	if(RenderSupport.viewportScaleWorkaroundEnabled) {
		try {
			var e = { target : window};
			var delay = 10000;
			if(delay == null) {
				delay = 100;
			}
			Native.timer(delay,function() {
				if(!RenderSupport.printMode) {
					var oldBrowserZoom = RenderSupport.browserZoom;
					RenderSupport.backingStoreRatio = RenderSupport.getBackingStoreRatio();
					if(RenderSupport.backingStoreRatio != RenderSupport.PixiRenderer.resolution) {
						RenderSupport.createPixiRenderer();
					} else {
						var win_width = Platform.isSamsung ? Math.min(e.target.innerWidth,e.target.outerWidth) : e.target.innerWidth;
						var win_height = e.target.innerHeight;
						if(RenderSupport.viewportScaleWorkaroundEnabled) {
							var viewportScale = RenderSupport.getViewportScale();
							var portraitOrientation = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
							if(!(!RenderSupport.viewportScaleWorkaroundEnabled && (portraitOrientation ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape) != -1)) {
								var screenSize;
								if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
									var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
									screenSize = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
								} else {
									screenSize = { width : window.screen.width, height : window.screen.height};
								}
								var innerHeightCompensation = RenderSupport.viewportScaleWorkaroundEnabled && window.innerHeight == RenderSupport.InnerHeightAtRenderTime && screenSize.height != window.innerHeight && screenSize.height - window.innerHeight * RenderSupport.getViewportScale() < 100 ? 95.0 / RenderSupport.getViewportScale() : 0.0;
								var topHeight = RenderSupport.viewportScaleWorkaroundEnabled ? screenSize.height - window.innerHeight + innerHeightCompensation : screenSize.height - window.innerHeight * RenderSupport.browserZoom;
								if(portraitOrientation) {
									if(RenderSupport.WindowTopHeightPortrait == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
										RenderSupport.WindowTopHeightPortrait = topHeight;
									}
								} else if(RenderSupport.WindowTopHeightLandscape == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
									RenderSupport.WindowTopHeightLandscape = topHeight;
								}
							}
							var screen_size;
							if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
								var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
								screen_size = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
							} else {
								screen_size = { width : window.screen.width, height : window.screen.height};
							}
							win_width = screen_size.width;
							win_height = (screen_size.height - (window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0 ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape)) * viewportScale;
							window.document.documentElement.style.width = "calc(100% * " + viewportScale + ")";
							window.document.documentElement.style.height = "calc(100% * " + viewportScale + ")";
							window.document.documentElement.style.transform = "scale(" + 1 / viewportScale + ")";
							window.document.documentElement.style.transformOrigin = "0 0";
						} else if(Platform.isAndroid || Platform.isIOS && (Platform.isChrome || ProgressiveWebTools.isRunningPWA())) {
							var portraitOrientation = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
							if(!(!RenderSupport.viewportScaleWorkaroundEnabled && (portraitOrientation ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape) != -1)) {
								var screenSize;
								if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
									var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
									screenSize = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
								} else {
									screenSize = { width : window.screen.width, height : window.screen.height};
								}
								var innerHeightCompensation = RenderSupport.viewportScaleWorkaroundEnabled && window.innerHeight == RenderSupport.InnerHeightAtRenderTime && screenSize.height != window.innerHeight && screenSize.height - window.innerHeight * RenderSupport.getViewportScale() < 100 ? 95.0 / RenderSupport.getViewportScale() : 0.0;
								var topHeight = RenderSupport.viewportScaleWorkaroundEnabled ? screenSize.height - window.innerHeight + innerHeightCompensation : screenSize.height - window.innerHeight * RenderSupport.browserZoom;
								if(portraitOrientation) {
									if(RenderSupport.WindowTopHeightPortrait == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
										RenderSupport.WindowTopHeightPortrait = topHeight;
									}
								} else if(RenderSupport.WindowTopHeightLandscape == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
									RenderSupport.WindowTopHeightLandscape = topHeight;
								}
							}
							if(oldBrowserZoom == RenderSupport.browserZoom) {
								var screen_size;
								if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
									var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
									screen_size = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
								} else {
									screen_size = { width : window.screen.width, height : window.screen.height};
								}
								if(!Platform.isAndroid) {
									win_width = screen_size.width;
								}
								win_height = Math.floor((screen_size.height - (RenderSupport.IsFullScreen ? 0.0 : window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0 ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape)) / RenderSupport.browserZoom);
							}
							if(Platform.isAndroid) {
								RenderSupport.PixiStage.y = 0.0;
								RenderSupport.ensureCurrentInputVisible();
							}
						}
						if(RenderSupport.RenderRoot != null) {
							var _g = 0;
							var _g1 = RenderSupport.FlowInstances;
							while(_g < _g1.length) {
								var instance = _g1[_g];
								++_g;
								var renderRoot = instance.stage.nativeWidget.host;
								var pixiView = instance.renderer.view;
								win_width = RenderSupport.getRenderRootWidth(renderRoot);
								win_height = RenderSupport.getRenderRootHeight(renderRoot);
								pixiView.width = win_width * RenderSupport.backingStoreRatio;
								pixiView.height = win_height * RenderSupport.backingStoreRatio;
								pixiView.style.width = win_width;
								pixiView.style.height = win_height;
								instance.renderer.resize(win_width,win_height);
							}
						} else {
							RenderSupport.PixiView.width = win_width * RenderSupport.backingStoreRatio;
							RenderSupport.PixiView.height = win_height * RenderSupport.backingStoreRatio;
							RenderSupport.PixiView.style.width = win_width;
							RenderSupport.PixiView.style.height = win_height;
							RenderSupport.PixiRenderer.resize(win_width,win_height);
						}
					}
					RenderSupport.broadcastResizeEvent();
					RenderSupport.InvalidateLocalStages();
					RenderSupport.animate();
				}
			});
		} catch( _g ) {
			haxe_NativeStackTrace.lastError = _g;
			var e1 = haxe_Exception.caught(_g).unwrap();
			console.log("onBrowserWindowResizeDelayed error : ");
			console.log(e1);
		}
	}
};
RenderSupport.getRenderRootWidth = function(root) {
	if(root == null) {
		root = RenderSupport.RenderRoot;
	}
	var width = 0;
	var rWidth = Std.parseInt(root.getAttribute("width"));
	if(RenderSupport.IsFullScreen) {
		width = window.innerWidth;
	} else if(rWidth != null && !isNaN(rWidth)) {
		width = rWidth;
	} else {
		var bRect = root.getBoundingClientRect();
		var width1 = window.document.body.getBoundingClientRect().width;
		var width2 = Platform.isIE ? bRect.left : bRect.x;
		width = Math.floor(Math.min(width1,window.innerWidth - width2));
	}
	root.style.width = width + "px";
	return width;
};
RenderSupport.getRenderRootHeight = function(root) {
	if(root == null) {
		root = RenderSupport.RenderRoot;
	}
	var height = 0;
	var rHeight = Std.parseInt(root.getAttribute("height"));
	if(RenderSupport.IsFullScreen) {
		height = window.innerHeight;
	} else if(rHeight != null && !isNaN(rHeight)) {
		height = rHeight;
	} else {
		var bRect = root.getBoundingClientRect();
		var height1 = Platform.isIE ? bRect.top : bRect.y;
		height = Math.floor(window.innerHeight - height1);
	}
	root.style.height = height + "px";
	return height;
};
RenderSupport.getRenderRootPos = function(stage) {
	var root;
	if(stage == null) {
		if(RenderSupport.RenderRoot == null) {
			return new PIXI.Point(0,0);
		}
		root = RenderSupport.RenderRoot;
	} else {
		root = stage.nativeWidget;
		if(root.host != null) {
			root = root.host;
		}
	}
	var rootRect = root.getBoundingClientRect();
	if(Platform.isIE) {
		return new PIXI.Point(rootRect.left + window.pageXOffset,rootRect.top + window.pageYOffset);
	} else {
		return new PIXI.Point(rootRect.x + window.scrollX,rootRect.y + window.scrollY);
	}
};
RenderSupport.getMouseEventPosition = function(event,rootPosition) {
	if(rootPosition == null) {
		rootPosition = RenderSupport.getRenderRootPos();
	}
	return new PIXI.Point(event.pageX - rootPosition.x,event.pageY - rootPosition.y);
};
RenderSupport.initPixiRenderer = function() {
	RenderSupport.disablePixiPlugins();
	if(Util.getParameter("debugClip") == "1") {
		RenderSupport.appendDebugClip();
	}
	if(PIXI.VERSION != "4.8.2") {
		document.location.reload(true);
	}
	PIXI.TextMetrics.METRICS_STRING = ((Platform.isMacintosh || Platform.isIOS) && RenderSupport.RendererType != 'html') ? '|Éq█Å' : '|Éq';
	PixiWorkarounds.workaroundGetContext();
	PixiWorkarounds.workaroundTextMetrics();
	PixiWorkarounds.workaroundRendererDestroy();
	PixiWorkarounds.workaroundProcessInteractive();
	if(Platform.isIE) {
		PixiWorkarounds.workaroundIEArrayFromMethod();
		PixiWorkarounds.workaroundIECustomEvent();
	}
	if(RenderSupport.viewportScaleWorkaroundEnabled) {
		RenderSupport.InnerHeightAtRenderTime = window.innerHeight;
	}
	RenderSupport.createPixiRenderer();
	if(RenderSupport.ScrollCatcherEnabled) {
		RenderSupport.appendScrollCatcher();
	}
	RenderSupport.preventDefaultFileDrop();
	var root = RenderSupport.PixiStage.nativeWidget;
	if(Platform.isMobile) {
		if(Platform.isAndroid || Platform.isChrome || Platform.isSafari && Platform.browserMajorVersion >= 13) {
			RenderSupport.updateNonPassiveEventListener(root,"pointerdown",RenderSupport.onpointerdown);
			RenderSupport.updateNonPassiveEventListener(root,"pointerup",RenderSupport.onpointerup);
			RenderSupport.updateNonPassiveEventListener(root,"pointermove",RenderSupport.onpointermove);
			RenderSupport.updateNonPassiveEventListener(root,"pointerout",RenderSupport.onpointerout);
		}
		RenderSupport.updateNonPassiveEventListener(root,"touchstart",RenderSupport.onpointerdown);
		RenderSupport.updateNonPassiveEventListener(root,"touchend",RenderSupport.onpointerup);
		RenderSupport.updateNonPassiveEventListener(root,"touchmove",RenderSupport.onpointermove);
	} else if(Platform.isSafari) {
		RenderSupport.updateNonPassiveEventListener(root,"mousedown",RenderSupport.onpointerdown);
		RenderSupport.updateNonPassiveEventListener(root,"mouseup",RenderSupport.onpointerup);
		RenderSupport.updateNonPassiveEventListener(root,"mousemove",RenderSupport.onpointermove);
		RenderSupport.updateNonPassiveEventListener(root,"mouseout",RenderSupport.onpointerout);
	} else if(Platform.isIE || Util.getParameter("debug_click_listener") == "1") {
		var stage = RenderSupport.PixiStage;
		root.onpointerdown = function(e) {
			RenderSupport.onpointerdown(e,stage);
		};
		root.onpointerup = function(e) {
			RenderSupport.onpointerup(e,stage);
		};
		root.onpointermove = function(e) {
			RenderSupport.onpointermove(e,stage);
		};
		root.onpointerout = function(e) {
			RenderSupport.onpointerout(e,stage);
		};
	} else {
		RenderSupport.updateNonPassiveEventListener(root,"pointerdown",RenderSupport.onpointerdown);
		RenderSupport.updateNonPassiveEventListener(root,"pointerup",RenderSupport.onpointerup);
		RenderSupport.updateNonPassiveEventListener(root,"pointermove",RenderSupport.onpointermove);
		RenderSupport.updateNonPassiveEventListener(root,"pointerout",RenderSupport.onpointerout);
		RenderSupport.updateNonPassiveEventListener(root,"touchstart",RenderSupport.blockEvent);
		RenderSupport.updateNonPassiveEventListener(root,"touchend",RenderSupport.blockEvent);
		RenderSupport.updateNonPassiveEventListener(root,"touchmove",RenderSupport.blockEvent);
	}
	RenderSupport.updateNonPassiveEventListener(root,"keydown",function(e,stage) {
		e.stopPropagation();
		if(RenderSupport.RendererType == "html") {
			RenderSupport.onKeyDownAccessibilityZoom(e);
		}
		RenderSupport.MousePos.x = e.clientX;
		RenderSupport.MousePos.y = e.clientY;
		RenderSupport.emitKey(stage,"keydown",e);
	});
	RenderSupport.updateNonPassiveEventListener(root,"keyup",function(e,stage) {
		e.stopPropagation();
		RenderSupport.MousePos.x = e.clientX;
		RenderSupport.MousePos.y = e.clientY;
		RenderSupport.emitKey(stage,"keyup",e);
	});
	var stage1 = RenderSupport.PixiStage;
	RenderSupport.setStageWheelHandler(function(p) {
		stage1.emit("mousewheel",p);
		RenderSupport.emitMouseEvent(stage1,"mousemove",RenderSupport.MousePos.x,RenderSupport.MousePos.y);
	});
	RenderSupport.on("mousedown",function(e) {
		RenderSupport.hadUserInteracted = true;
		RenderSupport.MouseUpReceived = false;
	});
	RenderSupport.on("mouseup",function(e) {
		RenderSupport.MouseUpReceived = true;
	});
	if(root != window.document.body) {
		RenderSupport.on("fullscreen",function() {
			var e = { target : window};
			if(!RenderSupport.printMode) {
				var oldBrowserZoom = RenderSupport.browserZoom;
				RenderSupport.backingStoreRatio = RenderSupport.getBackingStoreRatio();
				if(RenderSupport.backingStoreRatio != RenderSupport.PixiRenderer.resolution) {
					RenderSupport.createPixiRenderer();
				} else {
					var win_width = Platform.isSamsung ? Math.min(e.target.innerWidth,e.target.outerWidth) : e.target.innerWidth;
					var win_height = e.target.innerHeight;
					if(RenderSupport.viewportScaleWorkaroundEnabled) {
						var viewportScale = RenderSupport.getViewportScale();
						var portraitOrientation = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
						if(!(!RenderSupport.viewportScaleWorkaroundEnabled && (portraitOrientation ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape) != -1)) {
							var screenSize;
							if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
								var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
								screenSize = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
							} else {
								screenSize = { width : window.screen.width, height : window.screen.height};
							}
							var innerHeightCompensation = RenderSupport.viewportScaleWorkaroundEnabled && window.innerHeight == RenderSupport.InnerHeightAtRenderTime && screenSize.height != window.innerHeight && screenSize.height - window.innerHeight * RenderSupport.getViewportScale() < 100 ? 95.0 / RenderSupport.getViewportScale() : 0.0;
							var topHeight = RenderSupport.viewportScaleWorkaroundEnabled ? screenSize.height - window.innerHeight + innerHeightCompensation : screenSize.height - window.innerHeight * RenderSupport.browserZoom;
							if(portraitOrientation) {
								if(RenderSupport.WindowTopHeightPortrait == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
									RenderSupport.WindowTopHeightPortrait = topHeight;
								}
							} else if(RenderSupport.WindowTopHeightLandscape == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
								RenderSupport.WindowTopHeightLandscape = topHeight;
							}
						}
						var screen_size;
						if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
							var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
							screen_size = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
						} else {
							screen_size = { width : window.screen.width, height : window.screen.height};
						}
						win_width = screen_size.width;
						win_height = (screen_size.height - (window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0 ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape)) * viewportScale;
						window.document.documentElement.style.width = "calc(100% * " + viewportScale + ")";
						window.document.documentElement.style.height = "calc(100% * " + viewportScale + ")";
						window.document.documentElement.style.transform = "scale(" + 1 / viewportScale + ")";
						window.document.documentElement.style.transformOrigin = "0 0";
					} else if(Platform.isAndroid || Platform.isIOS && (Platform.isChrome || ProgressiveWebTools.isRunningPWA())) {
						var portraitOrientation = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
						if(!(!RenderSupport.viewportScaleWorkaroundEnabled && (portraitOrientation ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape) != -1)) {
							var screenSize;
							if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
								var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
								screenSize = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
							} else {
								screenSize = { width : window.screen.width, height : window.screen.height};
							}
							var innerHeightCompensation = RenderSupport.viewportScaleWorkaroundEnabled && window.innerHeight == RenderSupport.InnerHeightAtRenderTime && screenSize.height != window.innerHeight && screenSize.height - window.innerHeight * RenderSupport.getViewportScale() < 100 ? 95.0 / RenderSupport.getViewportScale() : 0.0;
							var topHeight = RenderSupport.viewportScaleWorkaroundEnabled ? screenSize.height - window.innerHeight + innerHeightCompensation : screenSize.height - window.innerHeight * RenderSupport.browserZoom;
							if(portraitOrientation) {
								if(RenderSupport.WindowTopHeightPortrait == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
									RenderSupport.WindowTopHeightPortrait = topHeight;
								}
							} else if(RenderSupport.WindowTopHeightLandscape == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
								RenderSupport.WindowTopHeightLandscape = topHeight;
							}
						}
						if(oldBrowserZoom == RenderSupport.browserZoom) {
							var screen_size;
							if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
								var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
								screen_size = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
							} else {
								screen_size = { width : window.screen.width, height : window.screen.height};
							}
							if(!Platform.isAndroid) {
								win_width = screen_size.width;
							}
							win_height = Math.floor((screen_size.height - (RenderSupport.IsFullScreen ? 0.0 : window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0 ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape)) / RenderSupport.browserZoom);
						}
						if(Platform.isAndroid) {
							RenderSupport.PixiStage.y = 0.0;
							RenderSupport.ensureCurrentInputVisible();
						}
					}
					if(RenderSupport.RenderRoot != null) {
						var _g = 0;
						var _g1 = RenderSupport.FlowInstances;
						while(_g < _g1.length) {
							var instance = _g1[_g];
							++_g;
							var renderRoot = instance.stage.nativeWidget.host;
							var pixiView = instance.renderer.view;
							win_width = RenderSupport.getRenderRootWidth(renderRoot);
							win_height = RenderSupport.getRenderRootHeight(renderRoot);
							pixiView.width = win_width * RenderSupport.backingStoreRatio;
							pixiView.height = win_height * RenderSupport.backingStoreRatio;
							pixiView.style.width = win_width;
							pixiView.style.height = win_height;
							instance.renderer.resize(win_width,win_height);
						}
					} else {
						RenderSupport.PixiView.width = win_width * RenderSupport.backingStoreRatio;
						RenderSupport.PixiView.height = win_height * RenderSupport.backingStoreRatio;
						RenderSupport.PixiView.style.width = win_width;
						RenderSupport.PixiView.style.height = win_height;
						RenderSupport.PixiRenderer.resize(win_width,win_height);
					}
				}
				RenderSupport.broadcastResizeEvent();
				RenderSupport.InvalidateLocalStages();
				RenderSupport.animate();
			}
		});
	}
	RenderSupport.switchFocusFramesShow(false);
	RenderSupport.setDropCurrentFocusOnMouse(true);
	var portraitOrientation = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
	if(!(!RenderSupport.viewportScaleWorkaroundEnabled && (portraitOrientation ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape) != -1)) {
		var screenSize;
		if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
			var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
			screenSize = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
		} else {
			screenSize = { width : window.screen.width, height : window.screen.height};
		}
		var innerHeightCompensation = RenderSupport.viewportScaleWorkaroundEnabled && window.innerHeight == RenderSupport.InnerHeightAtRenderTime && screenSize.height != window.innerHeight && screenSize.height - window.innerHeight * RenderSupport.getViewportScale() < 100 ? 95.0 / RenderSupport.getViewportScale() : 0.0;
		var topHeight = RenderSupport.viewportScaleWorkaroundEnabled ? screenSize.height - window.innerHeight + innerHeightCompensation : screenSize.height - window.innerHeight * RenderSupport.browserZoom;
		if(portraitOrientation) {
			if(RenderSupport.WindowTopHeightPortrait == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
				RenderSupport.WindowTopHeightPortrait = topHeight;
			}
		} else if(RenderSupport.WindowTopHeightLandscape == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
			RenderSupport.WindowTopHeightLandscape = topHeight;
		}
	}
	window.addEventListener("resize",Platform.isWKWebView || Platform.isIOS && ProgressiveWebTools.isRunningPWA() ? RenderSupport.onBrowserWindowResizeDelayed : RenderSupport.onBrowserWindowResize,false);
	window.addEventListener("blur",function() {
		RenderSupport.PageWasHidden = true;
		var key = RenderSupport.keysPending.iterator();
		while(key.hasNext()) {
			var key1 = key.next();
			key1.preventDefault = function() {
			};
			RenderSupport.emit("keyup",key1);
		}
	},false);
	window.addEventListener("focus",function() {
		RenderSupport.InvalidateLocalStages();
		RenderSupport.requestAnimationFrame();
	},false);
	window.addEventListener("focus",function() {
		var oldBrowserZoom = RenderSupport.browserZoom;
		window.resizeBy(-1,0);
		window.resizeBy(1,0);
		RenderSupport.backingStoreRatio = RenderSupport.getBackingStoreRatio();
		if(oldBrowserZoom != RenderSupport.browserZoom) {
			var e = { target : { innerWidth : window.innerWidth - 1, innerHeight : window.innerHeight}};
			if(!RenderSupport.printMode) {
				var oldBrowserZoom = RenderSupport.browserZoom;
				RenderSupport.backingStoreRatio = RenderSupport.getBackingStoreRatio();
				if(RenderSupport.backingStoreRatio != RenderSupport.PixiRenderer.resolution) {
					RenderSupport.createPixiRenderer();
				} else {
					var win_width = Platform.isSamsung ? Math.min(e.target.innerWidth,e.target.outerWidth) : e.target.innerWidth;
					var win_height = e.target.innerHeight;
					if(RenderSupport.viewportScaleWorkaroundEnabled) {
						var viewportScale = RenderSupport.getViewportScale();
						var portraitOrientation = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
						if(!(!RenderSupport.viewportScaleWorkaroundEnabled && (portraitOrientation ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape) != -1)) {
							var screenSize;
							if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
								var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
								screenSize = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
							} else {
								screenSize = { width : window.screen.width, height : window.screen.height};
							}
							var innerHeightCompensation = RenderSupport.viewportScaleWorkaroundEnabled && window.innerHeight == RenderSupport.InnerHeightAtRenderTime && screenSize.height != window.innerHeight && screenSize.height - window.innerHeight * RenderSupport.getViewportScale() < 100 ? 95.0 / RenderSupport.getViewportScale() : 0.0;
							var topHeight = RenderSupport.viewportScaleWorkaroundEnabled ? screenSize.height - window.innerHeight + innerHeightCompensation : screenSize.height - window.innerHeight * RenderSupport.browserZoom;
							if(portraitOrientation) {
								if(RenderSupport.WindowTopHeightPortrait == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
									RenderSupport.WindowTopHeightPortrait = topHeight;
								}
							} else if(RenderSupport.WindowTopHeightLandscape == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
								RenderSupport.WindowTopHeightLandscape = topHeight;
							}
						}
						var screen_size;
						if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
							var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
							screen_size = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
						} else {
							screen_size = { width : window.screen.width, height : window.screen.height};
						}
						win_width = screen_size.width;
						win_height = (screen_size.height - (window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0 ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape)) * viewportScale;
						window.document.documentElement.style.width = "calc(100% * " + viewportScale + ")";
						window.document.documentElement.style.height = "calc(100% * " + viewportScale + ")";
						window.document.documentElement.style.transform = "scale(" + 1 / viewportScale + ")";
						window.document.documentElement.style.transformOrigin = "0 0";
					} else if(Platform.isAndroid || Platform.isIOS && (Platform.isChrome || ProgressiveWebTools.isRunningPWA())) {
						var portraitOrientation = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
						if(!(!RenderSupport.viewportScaleWorkaroundEnabled && (portraitOrientation ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape) != -1)) {
							var screenSize;
							if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
								var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
								screenSize = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
							} else {
								screenSize = { width : window.screen.width, height : window.screen.height};
							}
							var innerHeightCompensation = RenderSupport.viewportScaleWorkaroundEnabled && window.innerHeight == RenderSupport.InnerHeightAtRenderTime && screenSize.height != window.innerHeight && screenSize.height - window.innerHeight * RenderSupport.getViewportScale() < 100 ? 95.0 / RenderSupport.getViewportScale() : 0.0;
							var topHeight = RenderSupport.viewportScaleWorkaroundEnabled ? screenSize.height - window.innerHeight + innerHeightCompensation : screenSize.height - window.innerHeight * RenderSupport.browserZoom;
							if(portraitOrientation) {
								if(RenderSupport.WindowTopHeightPortrait == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
									RenderSupport.WindowTopHeightPortrait = topHeight;
								}
							} else if(RenderSupport.WindowTopHeightLandscape == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
								RenderSupport.WindowTopHeightLandscape = topHeight;
							}
						}
						if(oldBrowserZoom == RenderSupport.browserZoom) {
							var screen_size;
							if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
								var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
								screen_size = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
							} else {
								screen_size = { width : window.screen.width, height : window.screen.height};
							}
							if(!Platform.isAndroid) {
								win_width = screen_size.width;
							}
							win_height = Math.floor((screen_size.height - (RenderSupport.IsFullScreen ? 0.0 : window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0 ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape)) / RenderSupport.browserZoom);
						}
						if(Platform.isAndroid) {
							RenderSupport.PixiStage.y = 0.0;
							RenderSupport.ensureCurrentInputVisible();
						}
					}
					if(RenderSupport.RenderRoot != null) {
						var _g = 0;
						var _g1 = RenderSupport.FlowInstances;
						while(_g < _g1.length) {
							var instance = _g1[_g];
							++_g;
							var renderRoot = instance.stage.nativeWidget.host;
							var pixiView = instance.renderer.view;
							win_width = RenderSupport.getRenderRootWidth(renderRoot);
							win_height = RenderSupport.getRenderRootHeight(renderRoot);
							pixiView.width = win_width * RenderSupport.backingStoreRatio;
							pixiView.height = win_height * RenderSupport.backingStoreRatio;
							pixiView.style.width = win_width;
							pixiView.style.height = win_height;
							instance.renderer.resize(win_width,win_height);
						}
					} else {
						RenderSupport.PixiView.width = win_width * RenderSupport.backingStoreRatio;
						RenderSupport.PixiView.height = win_height * RenderSupport.backingStoreRatio;
						RenderSupport.PixiView.style.width = win_width;
						RenderSupport.PixiView.style.height = win_height;
						RenderSupport.PixiRenderer.resize(win_width,win_height);
					}
				}
				RenderSupport.broadcastResizeEvent();
				RenderSupport.InvalidateLocalStages();
				RenderSupport.animate();
			}
			var e = { target : { innerWidth : window.innerWidth, innerHeight : window.innerHeight}};
			if(!RenderSupport.printMode) {
				var oldBrowserZoom = RenderSupport.browserZoom;
				RenderSupport.backingStoreRatio = RenderSupport.getBackingStoreRatio();
				if(RenderSupport.backingStoreRatio != RenderSupport.PixiRenderer.resolution) {
					RenderSupport.createPixiRenderer();
				} else {
					var win_width = Platform.isSamsung ? Math.min(e.target.innerWidth,e.target.outerWidth) : e.target.innerWidth;
					var win_height = e.target.innerHeight;
					if(RenderSupport.viewportScaleWorkaroundEnabled) {
						var viewportScale = RenderSupport.getViewportScale();
						var portraitOrientation = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
						if(!(!RenderSupport.viewportScaleWorkaroundEnabled && (portraitOrientation ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape) != -1)) {
							var screenSize;
							if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
								var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
								screenSize = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
							} else {
								screenSize = { width : window.screen.width, height : window.screen.height};
							}
							var innerHeightCompensation = RenderSupport.viewportScaleWorkaroundEnabled && window.innerHeight == RenderSupport.InnerHeightAtRenderTime && screenSize.height != window.innerHeight && screenSize.height - window.innerHeight * RenderSupport.getViewportScale() < 100 ? 95.0 / RenderSupport.getViewportScale() : 0.0;
							var topHeight = RenderSupport.viewportScaleWorkaroundEnabled ? screenSize.height - window.innerHeight + innerHeightCompensation : screenSize.height - window.innerHeight * RenderSupport.browserZoom;
							if(portraitOrientation) {
								if(RenderSupport.WindowTopHeightPortrait == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
									RenderSupport.WindowTopHeightPortrait = topHeight;
								}
							} else if(RenderSupport.WindowTopHeightLandscape == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
								RenderSupport.WindowTopHeightLandscape = topHeight;
							}
						}
						var screen_size;
						if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
							var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
							screen_size = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
						} else {
							screen_size = { width : window.screen.width, height : window.screen.height};
						}
						win_width = screen_size.width;
						win_height = (screen_size.height - (window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0 ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape)) * viewportScale;
						window.document.documentElement.style.width = "calc(100% * " + viewportScale + ")";
						window.document.documentElement.style.height = "calc(100% * " + viewportScale + ")";
						window.document.documentElement.style.transform = "scale(" + 1 / viewportScale + ")";
						window.document.documentElement.style.transformOrigin = "0 0";
					} else if(Platform.isAndroid || Platform.isIOS && (Platform.isChrome || ProgressiveWebTools.isRunningPWA())) {
						var portraitOrientation = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
						if(!(!RenderSupport.viewportScaleWorkaroundEnabled && (portraitOrientation ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape) != -1)) {
							var screenSize;
							if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
								var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
								screenSize = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
							} else {
								screenSize = { width : window.screen.width, height : window.screen.height};
							}
							var innerHeightCompensation = RenderSupport.viewportScaleWorkaroundEnabled && window.innerHeight == RenderSupport.InnerHeightAtRenderTime && screenSize.height != window.innerHeight && screenSize.height - window.innerHeight * RenderSupport.getViewportScale() < 100 ? 95.0 / RenderSupport.getViewportScale() : 0.0;
							var topHeight = RenderSupport.viewportScaleWorkaroundEnabled ? screenSize.height - window.innerHeight + innerHeightCompensation : screenSize.height - window.innerHeight * RenderSupport.browserZoom;
							if(portraitOrientation) {
								if(RenderSupport.WindowTopHeightPortrait == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
									RenderSupport.WindowTopHeightPortrait = topHeight;
								}
							} else if(RenderSupport.WindowTopHeightLandscape == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
								RenderSupport.WindowTopHeightLandscape = topHeight;
							}
						}
						if(oldBrowserZoom == RenderSupport.browserZoom) {
							var screen_size;
							if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
								var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
								screen_size = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
							} else {
								screen_size = { width : window.screen.width, height : window.screen.height};
							}
							if(!Platform.isAndroid) {
								win_width = screen_size.width;
							}
							win_height = Math.floor((screen_size.height - (RenderSupport.IsFullScreen ? 0.0 : window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0 ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape)) / RenderSupport.browserZoom);
						}
						if(Platform.isAndroid) {
							RenderSupport.PixiStage.y = 0.0;
							RenderSupport.ensureCurrentInputVisible();
						}
					}
					if(RenderSupport.RenderRoot != null) {
						var _g = 0;
						var _g1 = RenderSupport.FlowInstances;
						while(_g < _g1.length) {
							var instance = _g1[_g];
							++_g;
							var renderRoot = instance.stage.nativeWidget.host;
							var pixiView = instance.renderer.view;
							win_width = RenderSupport.getRenderRootWidth(renderRoot);
							win_height = RenderSupport.getRenderRootHeight(renderRoot);
							pixiView.width = win_width * RenderSupport.backingStoreRatio;
							pixiView.height = win_height * RenderSupport.backingStoreRatio;
							pixiView.style.width = win_width;
							pixiView.style.height = win_height;
							instance.renderer.resize(win_width,win_height);
						}
					} else {
						RenderSupport.PixiView.width = win_width * RenderSupport.backingStoreRatio;
						RenderSupport.PixiView.height = win_height * RenderSupport.backingStoreRatio;
						RenderSupport.PixiView.style.width = win_width;
						RenderSupport.PixiView.style.height = win_height;
						RenderSupport.PixiRenderer.resize(win_width,win_height);
					}
				}
				RenderSupport.broadcastResizeEvent();
				RenderSupport.InvalidateLocalStages();
				RenderSupport.animate();
			}
		}
	});
	window.addEventListener("beforeprint",function() {
		if(!RenderSupport.printMode) {
			RenderSupport.printMode = true;
			RenderSupport.prevInvalidateRenderable = DisplayObjectHelper.InvalidateRenderable;
			DisplayObjectHelper.InvalidateRenderable = false;
			var clip = RenderSupport.PixiStage;
			if(clip.renderable != true) {
				clip.renderable = true;
				DisplayObjectHelper.invalidateVisible(clip);
				if(!clip.keepNativeWidget) {
					DisplayObjectHelper.invalidateTransform(clip,"setClipRenderable");
				}
			}
			var _g = 0;
			var _g1 = clip.children || [];
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				if(child.clipVisible && !child.isMask) {
					var renderable = true;
					if(renderable == null) {
						renderable = true;
					}
					if(child.renderable != renderable) {
						child.renderable = renderable;
						DisplayObjectHelper.invalidateVisible(child);
						if(!child.keepNativeWidget) {
							DisplayObjectHelper.invalidateTransform(child,"setClipRenderable");
						}
					}
					var _g2 = 0;
					var _g3 = child.children || [];
					while(_g2 < _g3.length) {
						var child1 = _g3[_g2];
						++_g2;
						if(child1.clipVisible && !child1.isMask) {
							DisplayObjectHelper.forceClipRenderable(child1,renderable);
						}
					}
				}
			}
			RenderSupport.emit("beforeprint");
			RenderSupport.forceRender();
		}
	},false);
	window.addEventListener("afterprint",function() {
		RenderSupport.forceOnAfterprint = false;
		if(RenderSupport.printMode) {
			DisplayObjectHelper.InvalidateRenderable = RenderSupport.prevInvalidateRenderable;
			RenderSupport.printMode = false;
			RenderSupport.emit("afterprint");
			RenderSupport.forceRender();
		}
	},false);
	if(Platform.isMobile) {
		RenderSupport.on("fullscreen",function(isFullScreen) {
			var size;
			if(isFullScreen) {
				if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
					var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
					size = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
				} else {
					size = { width : window.screen.width, height : window.screen.height};
				}
			} else {
				size = { width : window.innerWidth, height : window.innerHeight};
			}
			var e = { target : { innerWidth : size.width, innerHeight : size.height}};
			if(!RenderSupport.printMode) {
				var oldBrowserZoom = RenderSupport.browserZoom;
				RenderSupport.backingStoreRatio = RenderSupport.getBackingStoreRatio();
				if(RenderSupport.backingStoreRatio != RenderSupport.PixiRenderer.resolution) {
					RenderSupport.createPixiRenderer();
				} else {
					var win_width = Platform.isSamsung ? Math.min(e.target.innerWidth,e.target.outerWidth) : e.target.innerWidth;
					var win_height = e.target.innerHeight;
					if(RenderSupport.viewportScaleWorkaroundEnabled) {
						var viewportScale = RenderSupport.getViewportScale();
						var portraitOrientation = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
						if(!(!RenderSupport.viewportScaleWorkaroundEnabled && (portraitOrientation ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape) != -1)) {
							var screenSize;
							if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
								var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
								screenSize = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
							} else {
								screenSize = { width : window.screen.width, height : window.screen.height};
							}
							var innerHeightCompensation = RenderSupport.viewportScaleWorkaroundEnabled && window.innerHeight == RenderSupport.InnerHeightAtRenderTime && screenSize.height != window.innerHeight && screenSize.height - window.innerHeight * RenderSupport.getViewportScale() < 100 ? 95.0 / RenderSupport.getViewportScale() : 0.0;
							var topHeight = RenderSupport.viewportScaleWorkaroundEnabled ? screenSize.height - window.innerHeight + innerHeightCompensation : screenSize.height - window.innerHeight * RenderSupport.browserZoom;
							if(portraitOrientation) {
								if(RenderSupport.WindowTopHeightPortrait == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
									RenderSupport.WindowTopHeightPortrait = topHeight;
								}
							} else if(RenderSupport.WindowTopHeightLandscape == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
								RenderSupport.WindowTopHeightLandscape = topHeight;
							}
						}
						var screen_size;
						if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
							var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
							screen_size = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
						} else {
							screen_size = { width : window.screen.width, height : window.screen.height};
						}
						win_width = screen_size.width;
						win_height = (screen_size.height - (window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0 ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape)) * viewportScale;
						window.document.documentElement.style.width = "calc(100% * " + viewportScale + ")";
						window.document.documentElement.style.height = "calc(100% * " + viewportScale + ")";
						window.document.documentElement.style.transform = "scale(" + 1 / viewportScale + ")";
						window.document.documentElement.style.transformOrigin = "0 0";
					} else if(Platform.isAndroid || Platform.isIOS && (Platform.isChrome || ProgressiveWebTools.isRunningPWA())) {
						var portraitOrientation = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
						if(!(!RenderSupport.viewportScaleWorkaroundEnabled && (portraitOrientation ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape) != -1)) {
							var screenSize;
							if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
								var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
								screenSize = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
							} else {
								screenSize = { width : window.screen.width, height : window.screen.height};
							}
							var innerHeightCompensation = RenderSupport.viewportScaleWorkaroundEnabled && window.innerHeight == RenderSupport.InnerHeightAtRenderTime && screenSize.height != window.innerHeight && screenSize.height - window.innerHeight * RenderSupport.getViewportScale() < 100 ? 95.0 / RenderSupport.getViewportScale() : 0.0;
							var topHeight = RenderSupport.viewportScaleWorkaroundEnabled ? screenSize.height - window.innerHeight + innerHeightCompensation : screenSize.height - window.innerHeight * RenderSupport.browserZoom;
							if(portraitOrientation) {
								if(RenderSupport.WindowTopHeightPortrait == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
									RenderSupport.WindowTopHeightPortrait = topHeight;
								}
							} else if(RenderSupport.WindowTopHeightLandscape == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
								RenderSupport.WindowTopHeightLandscape = topHeight;
							}
						}
						if(oldBrowserZoom == RenderSupport.browserZoom) {
							var screen_size;
							if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
								var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
								screen_size = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
							} else {
								screen_size = { width : window.screen.width, height : window.screen.height};
							}
							if(!Platform.isAndroid) {
								win_width = screen_size.width;
							}
							win_height = Math.floor((screen_size.height - (RenderSupport.IsFullScreen ? 0.0 : window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0 ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape)) / RenderSupport.browserZoom);
						}
						if(Platform.isAndroid) {
							RenderSupport.PixiStage.y = 0.0;
							RenderSupport.ensureCurrentInputVisible();
						}
					}
					if(RenderSupport.RenderRoot != null) {
						var _g = 0;
						var _g1 = RenderSupport.FlowInstances;
						while(_g < _g1.length) {
							var instance = _g1[_g];
							++_g;
							var renderRoot = instance.stage.nativeWidget.host;
							var pixiView = instance.renderer.view;
							win_width = RenderSupport.getRenderRootWidth(renderRoot);
							win_height = RenderSupport.getRenderRootHeight(renderRoot);
							pixiView.width = win_width * RenderSupport.backingStoreRatio;
							pixiView.height = win_height * RenderSupport.backingStoreRatio;
							pixiView.style.width = win_width;
							pixiView.style.height = win_height;
							instance.renderer.resize(win_width,win_height);
						}
					} else {
						RenderSupport.PixiView.width = win_width * RenderSupport.backingStoreRatio;
						RenderSupport.PixiView.height = win_height * RenderSupport.backingStoreRatio;
						RenderSupport.PixiView.style.width = win_width;
						RenderSupport.PixiView.style.height = win_height;
						RenderSupport.PixiRenderer.resize(win_width,win_height);
					}
				}
				RenderSupport.broadcastResizeEvent();
				RenderSupport.InvalidateLocalStages();
				RenderSupport.animate();
			}
		});
	}
	var accessibilityZoomOnPinchStart = 1.;
	if(Platform.isMobile && Native.isNew) {
		GesturesDetector.addPinchListener(function(state,x,y,scale,b) {
			if(state == 0) {
				accessibilityZoomOnPinchStart = RenderSupport.getAccessibilityZoom();
			}
			var updateZoom = function() {
				RenderSupport.setAccessibilityZoom(Math.min(Math.max(0.25,accessibilityZoomOnPinchStart * scale),5.0));
			};
			if(state == 0 || state == 2) {
				updateZoom();
			} else if(state == 1) {
				RenderSupport.zoomFnUns();
				RenderSupport.zoomFnUns = RenderSupport.interruptibleDeferUntilRender(updateZoom);
			}
			return false;
		});
	}
	window.addEventListener("message",RenderSupport.receiveWindowMessage,false);
	if(window.document.body.requestFullscreen != null) {
		window.document.addEventListener("fullscreenchange",RenderSupport.fullScreenTrigger,false);
	} else if(window.document.body.mozRequestFullScreen != null) {
		window.document.addEventListener("mozfullscreenchange",RenderSupport.fullScreenTrigger,false);
	} else if(window.document.body.webkitRequestFullscreen != null) {
		window.document.addEventListener("webkitfullscreenchange",RenderSupport.fullScreenTrigger,false);
	} else if(window.document.body.msRequestFullscreen != null) {
		window.document.addEventListener("MSFullscreenChange",RenderSupport.fullScreenTrigger,false);
	} else if(window.document.body.webkitEnterFullScreen != null) {
		window.document.addEventListener("webkitfullscreenchange",RenderSupport.fullScreenTrigger,false);
	}
	RenderSupport.webFontsLoadingStartAt = NativeTime.timestamp();
	RenderSupport.WebFontsConfig = FontLoader.loadWebFonts(RenderSupport.mainNoDelay ? function() {
	} : RenderSupport.StartFlowMainWithTimeCheck);
	var handlePaste = function(e) {
		if(window.clipboardData && window.clipboardData.getData) {
			Native.clipboardData = window.clipboardData.getData("Text");
			Native.clipboardDataHtml = "";
		} else if(e.clipboardData && e.clipboardData.getData) {
			Native.clipboardData = e.clipboardData.getData("text/plain");
			Native.clipboardDataHtml = e.clipboardData.getData("text/html");
		} else {
			Native.clipboardData = "";
			Native.clipboardDataHtml = "";
		}
		var files = [];
		if(!Platform.isIE && !Platform.isEdge) {
			var _g = 0;
			var _g1 = e.clipboardData.files.length;
			while(_g < _g1) {
				var i = _g++;
				files[i] = e.clipboardData.files[i];
			}
		}
		RenderSupport.emit("paste",files);
	};
	var handler = handlePaste;
	window.document.addEventListener("paste",handler,false);
	var onmove = function(e) {
		var localStages = RenderSupport.PixiStage.children;
		var currentInteractiveLayerZorder = 0;
		var i = localStages.length - 1;
		while(i > 0) {
			if(localStages[i].view.style.pointerEvents == "all") {
				currentInteractiveLayerZorder = i;
			}
			--i;
		}
		if(currentInteractiveLayerZorder == 0) {
			return;
		}
		var pos = Util.getPointerEventPosition(e);
		i = localStages.length - 1;
		while(i > currentInteractiveLayerZorder) {
			if(RenderSupport.getClipAt(localStages[i],pos,true,0.0) != null && localStages[i].view.style.pointerEvents != "all") {
				localStages[i].view.style.pointerEvents = "all";
				localStages[currentInteractiveLayerZorder].view.style.pointerEvents = "none";
				RenderSupport.PixiRenderer.view = localStages[i].view;
				if(e.type == "touchstart") {
					RenderSupport.emitMouseEvent(RenderSupport.PixiStage,"mousedown",pos.x,pos.y);
					RenderSupport.emitMouseEvent(RenderSupport.PixiStage,"mouseup",pos.x,pos.y);
				}
				return;
			}
			--i;
		}
		if(RenderSupport.getClipAt(localStages[currentInteractiveLayerZorder],pos,true,0.0) == null) {
			localStages[currentInteractiveLayerZorder].view.style.pointerEvents = "none";
		}
	};
	window.document.addEventListener("mousemove",onmove,false);
	if(Native.isTouchScreen()) {
		window.document.addEventListener("touchstart",onmove,false);
	}
	RenderSupport.printOptionValues();
	RenderSupport.animate();
	RenderSupport.requestAnimationFrame();
};
RenderSupport.appendScrollCatcher = function() {
	var catcherWrapper = window.document.createElement("div");
	catcherWrapper.style.width = "100%";
	catcherWrapper.style.height = "100%";
	catcherWrapper.style.overflow = "scroll";
	var catcher = window.document.createElement("div");
	catcher.style.position = "relative";
	catcherWrapper.style.zIndex = "1000";
	catcher.style.height = "calc(100% + 1px)";
	catcherWrapper.appendChild(catcher);
	window.document.body.appendChild(catcherWrapper);
	var onpointermove = function(e) {
		var topClip = RenderSupport.getClipAt(RenderSupport.PixiStage,new PIXI.Point(e.pageX,e.pageY),true,0.16);
		if(topClip != null && (topClip.cursor != null && topClip.cursor != "")) {
			catcherWrapper.style.cursor = topClip.cursor;
		} else if(topClip != null && topClip.isInput) {
			catcherWrapper.style.cursor = "text";
		} else {
			catcherWrapper.style.cursor = null;
		}
	};
	var onpointerdown = function(e) {
		var topClip = RenderSupport.getClipAt(RenderSupport.PixiStage,new PIXI.Point(e.pageX,e.pageY),true,0.16);
		if(topClip != null && topClip.isInput) {
			topClip.nativeWidget.focus();
			catcherWrapper.style.pointerEvents = "none";
			topClip.nativeWidget.addEventListener("blur",function() {
				catcherWrapper.style.pointerEvents = "auto";
			},{ once : true});
		}
	};
	catcherWrapper.addEventListener("pointermove",onpointermove);
	catcherWrapper.addEventListener("pointerdown",onpointerdown);
};
RenderSupport.appendDebugClip = function() {
	var debugClip = window.document.createElement("p");
	window.document.body.appendChild(debugClip);
	debugClip.textContent = "DEBUG";
	debugClip.style.position = "fixed";
	debugClip.style.fontSize = "12px";
	debugClip.style.zIndex = "1000";
	debugClip.style.background = "#42424277";
	debugClip.style.color = "#FFFFFF";
	debugClip.style.padding = "8px";
	debugClip.style.paddingTop = "4px";
	debugClip.style.paddingBottom = "4px";
	debugClip.style.borderRadius = "4px";
	debugClip.style.left = "50%";
	debugClip.style.top = "8px";
	debugClip.style.transform = "translate(-50%, 0)";
	RenderSupport.DebugClip = debugClip;
};
RenderSupport.StartFlowMainWithTimeCheck = function() {
	Errors.print("Web fonts loaded in " + (NativeTime.timestamp() - RenderSupport.webFontsLoadingStartAt) + " ms");
	RenderSupport.StartFlowMain();
};
RenderSupport.zoomFnUns = function() {
};
RenderSupport.initBrowserWindowEventListeners = function() {
	var portraitOrientation = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
	if(!(!RenderSupport.viewportScaleWorkaroundEnabled && (portraitOrientation ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape) != -1)) {
		var screenSize;
		if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
			var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
			screenSize = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
		} else {
			screenSize = { width : window.screen.width, height : window.screen.height};
		}
		var innerHeightCompensation = RenderSupport.viewportScaleWorkaroundEnabled && window.innerHeight == RenderSupport.InnerHeightAtRenderTime && screenSize.height != window.innerHeight && screenSize.height - window.innerHeight * RenderSupport.getViewportScale() < 100 ? 95.0 / RenderSupport.getViewportScale() : 0.0;
		var topHeight = RenderSupport.viewportScaleWorkaroundEnabled ? screenSize.height - window.innerHeight + innerHeightCompensation : screenSize.height - window.innerHeight * RenderSupport.browserZoom;
		if(portraitOrientation) {
			if(RenderSupport.WindowTopHeightPortrait == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
				RenderSupport.WindowTopHeightPortrait = topHeight;
			}
		} else if(RenderSupport.WindowTopHeightLandscape == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
			RenderSupport.WindowTopHeightLandscape = topHeight;
		}
	}
	window.addEventListener("resize",Platform.isWKWebView || Platform.isIOS && ProgressiveWebTools.isRunningPWA() ? RenderSupport.onBrowserWindowResizeDelayed : RenderSupport.onBrowserWindowResize,false);
	window.addEventListener("blur",function() {
		RenderSupport.PageWasHidden = true;
		var key = RenderSupport.keysPending.iterator();
		while(key.hasNext()) {
			var key1 = key.next();
			key1.preventDefault = function() {
			};
			RenderSupport.emit("keyup",key1);
		}
	},false);
	window.addEventListener("focus",function() {
		RenderSupport.InvalidateLocalStages();
		RenderSupport.requestAnimationFrame();
	},false);
	window.addEventListener("focus",function() {
		var oldBrowserZoom = RenderSupport.browserZoom;
		window.resizeBy(-1,0);
		window.resizeBy(1,0);
		RenderSupport.backingStoreRatio = RenderSupport.getBackingStoreRatio();
		if(oldBrowserZoom != RenderSupport.browserZoom) {
			var e = { target : { innerWidth : window.innerWidth - 1, innerHeight : window.innerHeight}};
			if(!RenderSupport.printMode) {
				var oldBrowserZoom = RenderSupport.browserZoom;
				RenderSupport.backingStoreRatio = RenderSupport.getBackingStoreRatio();
				if(RenderSupport.backingStoreRatio != RenderSupport.PixiRenderer.resolution) {
					RenderSupport.createPixiRenderer();
				} else {
					var win_width = Platform.isSamsung ? Math.min(e.target.innerWidth,e.target.outerWidth) : e.target.innerWidth;
					var win_height = e.target.innerHeight;
					if(RenderSupport.viewportScaleWorkaroundEnabled) {
						var viewportScale = RenderSupport.getViewportScale();
						var portraitOrientation = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
						if(!(!RenderSupport.viewportScaleWorkaroundEnabled && (portraitOrientation ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape) != -1)) {
							var screenSize;
							if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
								var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
								screenSize = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
							} else {
								screenSize = { width : window.screen.width, height : window.screen.height};
							}
							var innerHeightCompensation = RenderSupport.viewportScaleWorkaroundEnabled && window.innerHeight == RenderSupport.InnerHeightAtRenderTime && screenSize.height != window.innerHeight && screenSize.height - window.innerHeight * RenderSupport.getViewportScale() < 100 ? 95.0 / RenderSupport.getViewportScale() : 0.0;
							var topHeight = RenderSupport.viewportScaleWorkaroundEnabled ? screenSize.height - window.innerHeight + innerHeightCompensation : screenSize.height - window.innerHeight * RenderSupport.browserZoom;
							if(portraitOrientation) {
								if(RenderSupport.WindowTopHeightPortrait == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
									RenderSupport.WindowTopHeightPortrait = topHeight;
								}
							} else if(RenderSupport.WindowTopHeightLandscape == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
								RenderSupport.WindowTopHeightLandscape = topHeight;
							}
						}
						var screen_size;
						if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
							var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
							screen_size = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
						} else {
							screen_size = { width : window.screen.width, height : window.screen.height};
						}
						win_width = screen_size.width;
						win_height = (screen_size.height - (window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0 ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape)) * viewportScale;
						window.document.documentElement.style.width = "calc(100% * " + viewportScale + ")";
						window.document.documentElement.style.height = "calc(100% * " + viewportScale + ")";
						window.document.documentElement.style.transform = "scale(" + 1 / viewportScale + ")";
						window.document.documentElement.style.transformOrigin = "0 0";
					} else if(Platform.isAndroid || Platform.isIOS && (Platform.isChrome || ProgressiveWebTools.isRunningPWA())) {
						var portraitOrientation = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
						if(!(!RenderSupport.viewportScaleWorkaroundEnabled && (portraitOrientation ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape) != -1)) {
							var screenSize;
							if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
								var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
								screenSize = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
							} else {
								screenSize = { width : window.screen.width, height : window.screen.height};
							}
							var innerHeightCompensation = RenderSupport.viewportScaleWorkaroundEnabled && window.innerHeight == RenderSupport.InnerHeightAtRenderTime && screenSize.height != window.innerHeight && screenSize.height - window.innerHeight * RenderSupport.getViewportScale() < 100 ? 95.0 / RenderSupport.getViewportScale() : 0.0;
							var topHeight = RenderSupport.viewportScaleWorkaroundEnabled ? screenSize.height - window.innerHeight + innerHeightCompensation : screenSize.height - window.innerHeight * RenderSupport.browserZoom;
							if(portraitOrientation) {
								if(RenderSupport.WindowTopHeightPortrait == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
									RenderSupport.WindowTopHeightPortrait = topHeight;
								}
							} else if(RenderSupport.WindowTopHeightLandscape == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
								RenderSupport.WindowTopHeightLandscape = topHeight;
							}
						}
						if(oldBrowserZoom == RenderSupport.browserZoom) {
							var screen_size;
							if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
								var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
								screen_size = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
							} else {
								screen_size = { width : window.screen.width, height : window.screen.height};
							}
							if(!Platform.isAndroid) {
								win_width = screen_size.width;
							}
							win_height = Math.floor((screen_size.height - (RenderSupport.IsFullScreen ? 0.0 : window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0 ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape)) / RenderSupport.browserZoom);
						}
						if(Platform.isAndroid) {
							RenderSupport.PixiStage.y = 0.0;
							RenderSupport.ensureCurrentInputVisible();
						}
					}
					if(RenderSupport.RenderRoot != null) {
						var _g = 0;
						var _g1 = RenderSupport.FlowInstances;
						while(_g < _g1.length) {
							var instance = _g1[_g];
							++_g;
							var renderRoot = instance.stage.nativeWidget.host;
							var pixiView = instance.renderer.view;
							win_width = RenderSupport.getRenderRootWidth(renderRoot);
							win_height = RenderSupport.getRenderRootHeight(renderRoot);
							pixiView.width = win_width * RenderSupport.backingStoreRatio;
							pixiView.height = win_height * RenderSupport.backingStoreRatio;
							pixiView.style.width = win_width;
							pixiView.style.height = win_height;
							instance.renderer.resize(win_width,win_height);
						}
					} else {
						RenderSupport.PixiView.width = win_width * RenderSupport.backingStoreRatio;
						RenderSupport.PixiView.height = win_height * RenderSupport.backingStoreRatio;
						RenderSupport.PixiView.style.width = win_width;
						RenderSupport.PixiView.style.height = win_height;
						RenderSupport.PixiRenderer.resize(win_width,win_height);
					}
				}
				RenderSupport.broadcastResizeEvent();
				RenderSupport.InvalidateLocalStages();
				RenderSupport.animate();
			}
			var e = { target : { innerWidth : window.innerWidth, innerHeight : window.innerHeight}};
			if(!RenderSupport.printMode) {
				var oldBrowserZoom = RenderSupport.browserZoom;
				RenderSupport.backingStoreRatio = RenderSupport.getBackingStoreRatio();
				if(RenderSupport.backingStoreRatio != RenderSupport.PixiRenderer.resolution) {
					RenderSupport.createPixiRenderer();
				} else {
					var win_width = Platform.isSamsung ? Math.min(e.target.innerWidth,e.target.outerWidth) : e.target.innerWidth;
					var win_height = e.target.innerHeight;
					if(RenderSupport.viewportScaleWorkaroundEnabled) {
						var viewportScale = RenderSupport.getViewportScale();
						var portraitOrientation = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
						if(!(!RenderSupport.viewportScaleWorkaroundEnabled && (portraitOrientation ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape) != -1)) {
							var screenSize;
							if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
								var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
								screenSize = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
							} else {
								screenSize = { width : window.screen.width, height : window.screen.height};
							}
							var innerHeightCompensation = RenderSupport.viewportScaleWorkaroundEnabled && window.innerHeight == RenderSupport.InnerHeightAtRenderTime && screenSize.height != window.innerHeight && screenSize.height - window.innerHeight * RenderSupport.getViewportScale() < 100 ? 95.0 / RenderSupport.getViewportScale() : 0.0;
							var topHeight = RenderSupport.viewportScaleWorkaroundEnabled ? screenSize.height - window.innerHeight + innerHeightCompensation : screenSize.height - window.innerHeight * RenderSupport.browserZoom;
							if(portraitOrientation) {
								if(RenderSupport.WindowTopHeightPortrait == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
									RenderSupport.WindowTopHeightPortrait = topHeight;
								}
							} else if(RenderSupport.WindowTopHeightLandscape == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
								RenderSupport.WindowTopHeightLandscape = topHeight;
							}
						}
						var screen_size;
						if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
							var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
							screen_size = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
						} else {
							screen_size = { width : window.screen.width, height : window.screen.height};
						}
						win_width = screen_size.width;
						win_height = (screen_size.height - (window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0 ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape)) * viewportScale;
						window.document.documentElement.style.width = "calc(100% * " + viewportScale + ")";
						window.document.documentElement.style.height = "calc(100% * " + viewportScale + ")";
						window.document.documentElement.style.transform = "scale(" + 1 / viewportScale + ")";
						window.document.documentElement.style.transformOrigin = "0 0";
					} else if(Platform.isAndroid || Platform.isIOS && (Platform.isChrome || ProgressiveWebTools.isRunningPWA())) {
						var portraitOrientation = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
						if(!(!RenderSupport.viewportScaleWorkaroundEnabled && (portraitOrientation ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape) != -1)) {
							var screenSize;
							if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
								var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
								screenSize = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
							} else {
								screenSize = { width : window.screen.width, height : window.screen.height};
							}
							var innerHeightCompensation = RenderSupport.viewportScaleWorkaroundEnabled && window.innerHeight == RenderSupport.InnerHeightAtRenderTime && screenSize.height != window.innerHeight && screenSize.height - window.innerHeight * RenderSupport.getViewportScale() < 100 ? 95.0 / RenderSupport.getViewportScale() : 0.0;
							var topHeight = RenderSupport.viewportScaleWorkaroundEnabled ? screenSize.height - window.innerHeight + innerHeightCompensation : screenSize.height - window.innerHeight * RenderSupport.browserZoom;
							if(portraitOrientation) {
								if(RenderSupport.WindowTopHeightPortrait == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
									RenderSupport.WindowTopHeightPortrait = topHeight;
								}
							} else if(RenderSupport.WindowTopHeightLandscape == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
								RenderSupport.WindowTopHeightLandscape = topHeight;
							}
						}
						if(oldBrowserZoom == RenderSupport.browserZoom) {
							var screen_size;
							if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
								var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
								screen_size = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
							} else {
								screen_size = { width : window.screen.width, height : window.screen.height};
							}
							if(!Platform.isAndroid) {
								win_width = screen_size.width;
							}
							win_height = Math.floor((screen_size.height - (RenderSupport.IsFullScreen ? 0.0 : window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0 ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape)) / RenderSupport.browserZoom);
						}
						if(Platform.isAndroid) {
							RenderSupport.PixiStage.y = 0.0;
							RenderSupport.ensureCurrentInputVisible();
						}
					}
					if(RenderSupport.RenderRoot != null) {
						var _g = 0;
						var _g1 = RenderSupport.FlowInstances;
						while(_g < _g1.length) {
							var instance = _g1[_g];
							++_g;
							var renderRoot = instance.stage.nativeWidget.host;
							var pixiView = instance.renderer.view;
							win_width = RenderSupport.getRenderRootWidth(renderRoot);
							win_height = RenderSupport.getRenderRootHeight(renderRoot);
							pixiView.width = win_width * RenderSupport.backingStoreRatio;
							pixiView.height = win_height * RenderSupport.backingStoreRatio;
							pixiView.style.width = win_width;
							pixiView.style.height = win_height;
							instance.renderer.resize(win_width,win_height);
						}
					} else {
						RenderSupport.PixiView.width = win_width * RenderSupport.backingStoreRatio;
						RenderSupport.PixiView.height = win_height * RenderSupport.backingStoreRatio;
						RenderSupport.PixiView.style.width = win_width;
						RenderSupport.PixiView.style.height = win_height;
						RenderSupport.PixiRenderer.resize(win_width,win_height);
					}
				}
				RenderSupport.broadcastResizeEvent();
				RenderSupport.InvalidateLocalStages();
				RenderSupport.animate();
			}
		}
	});
	window.addEventListener("beforeprint",function() {
		if(!RenderSupport.printMode) {
			RenderSupport.printMode = true;
			RenderSupport.prevInvalidateRenderable = DisplayObjectHelper.InvalidateRenderable;
			DisplayObjectHelper.InvalidateRenderable = false;
			var clip = RenderSupport.PixiStage;
			if(clip.renderable != true) {
				clip.renderable = true;
				DisplayObjectHelper.invalidateVisible(clip);
				if(!clip.keepNativeWidget) {
					DisplayObjectHelper.invalidateTransform(clip,"setClipRenderable");
				}
			}
			var _g = 0;
			var _g1 = clip.children || [];
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				if(child.clipVisible && !child.isMask) {
					var renderable = true;
					if(renderable == null) {
						renderable = true;
					}
					if(child.renderable != renderable) {
						child.renderable = renderable;
						DisplayObjectHelper.invalidateVisible(child);
						if(!child.keepNativeWidget) {
							DisplayObjectHelper.invalidateTransform(child,"setClipRenderable");
						}
					}
					var _g2 = 0;
					var _g3 = child.children || [];
					while(_g2 < _g3.length) {
						var child1 = _g3[_g2];
						++_g2;
						if(child1.clipVisible && !child1.isMask) {
							DisplayObjectHelper.forceClipRenderable(child1,renderable);
						}
					}
				}
			}
			RenderSupport.emit("beforeprint");
			RenderSupport.forceRender();
		}
	},false);
	window.addEventListener("afterprint",function() {
		RenderSupport.forceOnAfterprint = false;
		if(RenderSupport.printMode) {
			DisplayObjectHelper.InvalidateRenderable = RenderSupport.prevInvalidateRenderable;
			RenderSupport.printMode = false;
			RenderSupport.emit("afterprint");
			RenderSupport.forceRender();
		}
	},false);
	if(Platform.isMobile) {
		RenderSupport.on("fullscreen",function(isFullScreen) {
			var size;
			if(isFullScreen) {
				if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
					var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
					size = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
				} else {
					size = { width : window.screen.width, height : window.screen.height};
				}
			} else {
				size = { width : window.innerWidth, height : window.innerHeight};
			}
			var e = { target : { innerWidth : size.width, innerHeight : size.height}};
			if(!RenderSupport.printMode) {
				var oldBrowserZoom = RenderSupport.browserZoom;
				RenderSupport.backingStoreRatio = RenderSupport.getBackingStoreRatio();
				if(RenderSupport.backingStoreRatio != RenderSupport.PixiRenderer.resolution) {
					RenderSupport.createPixiRenderer();
				} else {
					var win_width = Platform.isSamsung ? Math.min(e.target.innerWidth,e.target.outerWidth) : e.target.innerWidth;
					var win_height = e.target.innerHeight;
					if(RenderSupport.viewportScaleWorkaroundEnabled) {
						var viewportScale = RenderSupport.getViewportScale();
						var portraitOrientation = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
						if(!(!RenderSupport.viewportScaleWorkaroundEnabled && (portraitOrientation ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape) != -1)) {
							var screenSize;
							if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
								var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
								screenSize = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
							} else {
								screenSize = { width : window.screen.width, height : window.screen.height};
							}
							var innerHeightCompensation = RenderSupport.viewportScaleWorkaroundEnabled && window.innerHeight == RenderSupport.InnerHeightAtRenderTime && screenSize.height != window.innerHeight && screenSize.height - window.innerHeight * RenderSupport.getViewportScale() < 100 ? 95.0 / RenderSupport.getViewportScale() : 0.0;
							var topHeight = RenderSupport.viewportScaleWorkaroundEnabled ? screenSize.height - window.innerHeight + innerHeightCompensation : screenSize.height - window.innerHeight * RenderSupport.browserZoom;
							if(portraitOrientation) {
								if(RenderSupport.WindowTopHeightPortrait == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
									RenderSupport.WindowTopHeightPortrait = topHeight;
								}
							} else if(RenderSupport.WindowTopHeightLandscape == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
								RenderSupport.WindowTopHeightLandscape = topHeight;
							}
						}
						var screen_size;
						if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
							var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
							screen_size = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
						} else {
							screen_size = { width : window.screen.width, height : window.screen.height};
						}
						win_width = screen_size.width;
						win_height = (screen_size.height - (window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0 ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape)) * viewportScale;
						window.document.documentElement.style.width = "calc(100% * " + viewportScale + ")";
						window.document.documentElement.style.height = "calc(100% * " + viewportScale + ")";
						window.document.documentElement.style.transform = "scale(" + 1 / viewportScale + ")";
						window.document.documentElement.style.transformOrigin = "0 0";
					} else if(Platform.isAndroid || Platform.isIOS && (Platform.isChrome || ProgressiveWebTools.isRunningPWA())) {
						var portraitOrientation = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
						if(!(!RenderSupport.viewportScaleWorkaroundEnabled && (portraitOrientation ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape) != -1)) {
							var screenSize;
							if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
								var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
								screenSize = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
							} else {
								screenSize = { width : window.screen.width, height : window.screen.height};
							}
							var innerHeightCompensation = RenderSupport.viewportScaleWorkaroundEnabled && window.innerHeight == RenderSupport.InnerHeightAtRenderTime && screenSize.height != window.innerHeight && screenSize.height - window.innerHeight * RenderSupport.getViewportScale() < 100 ? 95.0 / RenderSupport.getViewportScale() : 0.0;
							var topHeight = RenderSupport.viewportScaleWorkaroundEnabled ? screenSize.height - window.innerHeight + innerHeightCompensation : screenSize.height - window.innerHeight * RenderSupport.browserZoom;
							if(portraitOrientation) {
								if(RenderSupport.WindowTopHeightPortrait == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
									RenderSupport.WindowTopHeightPortrait = topHeight;
								}
							} else if(RenderSupport.WindowTopHeightLandscape == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
								RenderSupport.WindowTopHeightLandscape = topHeight;
							}
						}
						if(oldBrowserZoom == RenderSupport.browserZoom) {
							var screen_size;
							if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
								var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
								screen_size = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
							} else {
								screen_size = { width : window.screen.width, height : window.screen.height};
							}
							if(!Platform.isAndroid) {
								win_width = screen_size.width;
							}
							win_height = Math.floor((screen_size.height - (RenderSupport.IsFullScreen ? 0.0 : window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0 ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape)) / RenderSupport.browserZoom);
						}
						if(Platform.isAndroid) {
							RenderSupport.PixiStage.y = 0.0;
							RenderSupport.ensureCurrentInputVisible();
						}
					}
					if(RenderSupport.RenderRoot != null) {
						var _g = 0;
						var _g1 = RenderSupport.FlowInstances;
						while(_g < _g1.length) {
							var instance = _g1[_g];
							++_g;
							var renderRoot = instance.stage.nativeWidget.host;
							var pixiView = instance.renderer.view;
							win_width = RenderSupport.getRenderRootWidth(renderRoot);
							win_height = RenderSupport.getRenderRootHeight(renderRoot);
							pixiView.width = win_width * RenderSupport.backingStoreRatio;
							pixiView.height = win_height * RenderSupport.backingStoreRatio;
							pixiView.style.width = win_width;
							pixiView.style.height = win_height;
							instance.renderer.resize(win_width,win_height);
						}
					} else {
						RenderSupport.PixiView.width = win_width * RenderSupport.backingStoreRatio;
						RenderSupport.PixiView.height = win_height * RenderSupport.backingStoreRatio;
						RenderSupport.PixiView.style.width = win_width;
						RenderSupport.PixiView.style.height = win_height;
						RenderSupport.PixiRenderer.resize(win_width,win_height);
					}
				}
				RenderSupport.broadcastResizeEvent();
				RenderSupport.InvalidateLocalStages();
				RenderSupport.animate();
			}
		});
	}
	var accessibilityZoomOnPinchStart = 1.;
	if(Platform.isMobile && Native.isNew) {
		GesturesDetector.addPinchListener(function(state,x,y,scale,b) {
			if(state == 0) {
				accessibilityZoomOnPinchStart = RenderSupport.getAccessibilityZoom();
			}
			var updateZoom = function() {
				RenderSupport.setAccessibilityZoom(Math.min(Math.max(0.25,accessibilityZoomOnPinchStart * scale),5.0));
			};
			if(state == 0 || state == 2) {
				updateZoom();
			} else if(state == 1) {
				RenderSupport.zoomFnUns();
				RenderSupport.zoomFnUns = RenderSupport.interruptibleDeferUntilRender(updateZoom);
			}
			return false;
		});
	}
};
RenderSupport.isPortaitOrientation = function() {
	if(!window.matchMedia("(orientation: portrait)").matches) {
		if(Platform.isAndroid) {
			return window.orientation == 0;
		} else {
			return false;
		}
	} else {
		return true;
	}
};
RenderSupport.calculateMobileTopHeight = function() {
	var portraitOrientation = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
	if(!RenderSupport.viewportScaleWorkaroundEnabled && (portraitOrientation ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape) != -1) {
		return;
	}
	var screenSize;
	if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
		var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
		screenSize = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
	} else {
		screenSize = { width : window.screen.width, height : window.screen.height};
	}
	var innerHeightCompensation = RenderSupport.viewportScaleWorkaroundEnabled && window.innerHeight == RenderSupport.InnerHeightAtRenderTime && screenSize.height != window.innerHeight && screenSize.height - window.innerHeight * RenderSupport.getViewportScale() < 100 ? 95.0 / RenderSupport.getViewportScale() : 0.0;
	var topHeight = RenderSupport.viewportScaleWorkaroundEnabled ? screenSize.height - window.innerHeight + innerHeightCompensation : screenSize.height - window.innerHeight * RenderSupport.browserZoom;
	if(portraitOrientation) {
		if(RenderSupport.WindowTopHeightPortrait == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
			RenderSupport.WindowTopHeightPortrait = topHeight;
		}
	} else if(RenderSupport.WindowTopHeightLandscape == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
		RenderSupport.WindowTopHeightLandscape = topHeight;
	}
};
RenderSupport.setStatusBarColor = function(color) {
	var head = window.document.getElementsByTagName("head")[0];
	var oldThemeMeta = window.document.querySelector("meta[name=\"theme-color\"]");
	if(oldThemeMeta != null) {
		head.removeChild(oldThemeMeta);
	}
	var node = window.document.createElement("meta");
	node.setAttribute("name","theme-color");
	node.setAttribute("content",RenderSupport.makeCSSColor(color,1.0));
	head.appendChild(node);
};
RenderSupport.setApplicationLanguage = function(languageCode) {
	window.document.documentElement.setAttribute("lang",languageCode);
	window.document.documentElement.setAttribute("xml:lang",languageCode);
};
RenderSupport.getSafeArea = function() {
	var viewport = window.document.querySelector("meta[name=\"viewport\"]");
	if(viewport != null && viewport.getAttribute("content").indexOf("viewport-fit=cover") >= 0) {
		var l = parseFloat(window.getComputedStyle(window.document.documentElement).getPropertyValue("--sal"));
		var t = parseFloat(window.getComputedStyle(window.document.documentElement).getPropertyValue("--sat"));
		var r = parseFloat(window.getComputedStyle(window.document.documentElement).getPropertyValue("--sar"));
		var b = parseFloat(window.getComputedStyle(window.document.documentElement).getPropertyValue("--sab"));
		return [isNaN(l) ? 0.0 : l,isNaN(t) ? 0.0 : t,isNaN(r) ? 0.0 : r,isNaN(b) ? 0.0 : b];
	} else {
		return [0.0,0.0,0.0,0.0];
	}
};
RenderSupport.initCanvasStackInteractions = function() {
	var onmove = function(e) {
		var localStages = RenderSupport.PixiStage.children;
		var currentInteractiveLayerZorder = 0;
		var i = localStages.length - 1;
		while(i > 0) {
			if(localStages[i].view.style.pointerEvents == "all") {
				currentInteractiveLayerZorder = i;
			}
			--i;
		}
		if(currentInteractiveLayerZorder == 0) {
			return;
		}
		var pos = Util.getPointerEventPosition(e);
		i = localStages.length - 1;
		while(i > currentInteractiveLayerZorder) {
			if(RenderSupport.getClipAt(localStages[i],pos,true,0.0) != null && localStages[i].view.style.pointerEvents != "all") {
				localStages[i].view.style.pointerEvents = "all";
				localStages[currentInteractiveLayerZorder].view.style.pointerEvents = "none";
				RenderSupport.PixiRenderer.view = localStages[i].view;
				if(e.type == "touchstart") {
					RenderSupport.emitMouseEvent(RenderSupport.PixiStage,"mousedown",pos.x,pos.y);
					RenderSupport.emitMouseEvent(RenderSupport.PixiStage,"mouseup",pos.x,pos.y);
				}
				return;
			}
			--i;
		}
		if(RenderSupport.getClipAt(localStages[currentInteractiveLayerZorder],pos,true,0.0) == null) {
			localStages[currentInteractiveLayerZorder].view.style.pointerEvents = "none";
		}
	};
	window.document.addEventListener("mousemove",onmove,false);
	if(Native.isTouchScreen()) {
		window.document.addEventListener("touchstart",onmove,false);
	}
};
RenderSupport.getMobileTopHeight = function() {
	if(window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0) {
		return RenderSupport.WindowTopHeightPortrait;
	} else {
		return RenderSupport.WindowTopHeightLandscape;
	}
};
RenderSupport.initClipboardListeners = function() {
	var handlePaste = function(e) {
		if(window.clipboardData && window.clipboardData.getData) {
			Native.clipboardData = window.clipboardData.getData("Text");
			Native.clipboardDataHtml = "";
		} else if(e.clipboardData && e.clipboardData.getData) {
			Native.clipboardData = e.clipboardData.getData("text/plain");
			Native.clipboardDataHtml = e.clipboardData.getData("text/html");
		} else {
			Native.clipboardData = "";
			Native.clipboardDataHtml = "";
		}
		var files = [];
		if(!Platform.isIE && !Platform.isEdge) {
			var _g = 0;
			var _g1 = e.clipboardData.files.length;
			while(_g < _g1) {
				var i = _g++;
				files[i] = e.clipboardData.files[i];
			}
		}
		RenderSupport.emit("paste",files);
	};
	var handler = handlePaste;
	window.document.addEventListener("paste",handler,false);
};
RenderSupport.initMessageListener = function() {
	window.addEventListener("message",RenderSupport.receiveWindowMessage,false);
};
RenderSupport.initFullScreenEventListeners = function() {
	if(window.document.body.requestFullscreen != null) {
		window.document.addEventListener("fullscreenchange",RenderSupport.fullScreenTrigger,false);
	} else if(window.document.body.mozRequestFullScreen != null) {
		window.document.addEventListener("mozfullscreenchange",RenderSupport.fullScreenTrigger,false);
	} else if(window.document.body.webkitRequestFullscreen != null) {
		window.document.addEventListener("webkitfullscreenchange",RenderSupport.fullScreenTrigger,false);
	} else if(window.document.body.msRequestFullscreen != null) {
		window.document.addEventListener("MSFullscreenChange",RenderSupport.fullScreenTrigger,false);
	} else if(window.document.body.webkitEnterFullScreen != null) {
		window.document.addEventListener("webkitfullscreenchange",RenderSupport.fullScreenTrigger,false);
	}
};
RenderSupport.receiveWindowMessage = function(e) {
	RenderSupport.emit("message",e);
	var hasNestedWindow = null;
	hasNestedWindow = function(iframe,win) {
		try {
			if(iframe.contentWindow == win) {
				return true;
			}
			var iframes = iframe.contentWindow.document.getElementsByTagName("iframe");
			var _g = 0;
			var _g1 = iframes.length;
			while(_g < _g1) {
				var i = _g++;
				if(hasNestedWindow(iframes[i],win)) {
					return true;
				}
			}
		} catch( _g ) {
			haxe_NativeStackTrace.lastError = _g;
			var e = haxe_Exception.caught(_g).unwrap();
			Errors.print(e);
		}
		return false;
	};
	var content_win = e.source;
	var all_iframes = window.document.getElementsByTagName("iframe");
	var _g = 0;
	var _g1 = all_iframes.length;
	while(_g < _g1) {
		var i = _g++;
		var f = all_iframes[i];
		if(hasNestedWindow(f,content_win)) {
			f.callflow(["postMessage",e.data]);
			return;
		}
	}
};
RenderSupport.getScreenSize = function() {
	if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
		var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
		if(is_portrait) {
			return { width : window.screen.width, height : window.screen.height};
		} else {
			return { height : window.screen.width, width : window.screen.height};
		}
	} else {
		return { width : window.screen.width, height : window.screen.height};
	}
};
RenderSupport.onBrowserWindowResizeDelayed = function(e,delay) {
	if(delay == null) {
		delay = 100;
	}
	Native.timer(delay,function() {
		if(!RenderSupport.printMode) {
			var oldBrowserZoom = RenderSupport.browserZoom;
			RenderSupport.backingStoreRatio = RenderSupport.getBackingStoreRatio();
			if(RenderSupport.backingStoreRatio != RenderSupport.PixiRenderer.resolution) {
				RenderSupport.createPixiRenderer();
			} else {
				var win_width = Platform.isSamsung ? Math.min(e.target.innerWidth,e.target.outerWidth) : e.target.innerWidth;
				var win_height = e.target.innerHeight;
				if(RenderSupport.viewportScaleWorkaroundEnabled) {
					var viewportScale = RenderSupport.getViewportScale();
					var portraitOrientation = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
					if(!(!RenderSupport.viewportScaleWorkaroundEnabled && (portraitOrientation ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape) != -1)) {
						var screenSize;
						if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
							var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
							screenSize = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
						} else {
							screenSize = { width : window.screen.width, height : window.screen.height};
						}
						var innerHeightCompensation = RenderSupport.viewportScaleWorkaroundEnabled && window.innerHeight == RenderSupport.InnerHeightAtRenderTime && screenSize.height != window.innerHeight && screenSize.height - window.innerHeight * RenderSupport.getViewportScale() < 100 ? 95.0 / RenderSupport.getViewportScale() : 0.0;
						var topHeight = RenderSupport.viewportScaleWorkaroundEnabled ? screenSize.height - window.innerHeight + innerHeightCompensation : screenSize.height - window.innerHeight * RenderSupport.browserZoom;
						if(portraitOrientation) {
							if(RenderSupport.WindowTopHeightPortrait == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
								RenderSupport.WindowTopHeightPortrait = topHeight;
							}
						} else if(RenderSupport.WindowTopHeightLandscape == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
							RenderSupport.WindowTopHeightLandscape = topHeight;
						}
					}
					var screen_size;
					if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
						var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
						screen_size = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
					} else {
						screen_size = { width : window.screen.width, height : window.screen.height};
					}
					win_width = screen_size.width;
					win_height = (screen_size.height - (window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0 ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape)) * viewportScale;
					window.document.documentElement.style.width = "calc(100% * " + viewportScale + ")";
					window.document.documentElement.style.height = "calc(100% * " + viewportScale + ")";
					window.document.documentElement.style.transform = "scale(" + 1 / viewportScale + ")";
					window.document.documentElement.style.transformOrigin = "0 0";
				} else if(Platform.isAndroid || Platform.isIOS && (Platform.isChrome || ProgressiveWebTools.isRunningPWA())) {
					var portraitOrientation = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
					if(!(!RenderSupport.viewportScaleWorkaroundEnabled && (portraitOrientation ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape) != -1)) {
						var screenSize;
						if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
							var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
							screenSize = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
						} else {
							screenSize = { width : window.screen.width, height : window.screen.height};
						}
						var innerHeightCompensation = RenderSupport.viewportScaleWorkaroundEnabled && window.innerHeight == RenderSupport.InnerHeightAtRenderTime && screenSize.height != window.innerHeight && screenSize.height - window.innerHeight * RenderSupport.getViewportScale() < 100 ? 95.0 / RenderSupport.getViewportScale() : 0.0;
						var topHeight = RenderSupport.viewportScaleWorkaroundEnabled ? screenSize.height - window.innerHeight + innerHeightCompensation : screenSize.height - window.innerHeight * RenderSupport.browserZoom;
						if(portraitOrientation) {
							if(RenderSupport.WindowTopHeightPortrait == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
								RenderSupport.WindowTopHeightPortrait = topHeight;
							}
						} else if(RenderSupport.WindowTopHeightLandscape == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
							RenderSupport.WindowTopHeightLandscape = topHeight;
						}
					}
					if(oldBrowserZoom == RenderSupport.browserZoom) {
						var screen_size;
						if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
							var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
							screen_size = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
						} else {
							screen_size = { width : window.screen.width, height : window.screen.height};
						}
						if(!Platform.isAndroid) {
							win_width = screen_size.width;
						}
						win_height = Math.floor((screen_size.height - (RenderSupport.IsFullScreen ? 0.0 : window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0 ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape)) / RenderSupport.browserZoom);
					}
					if(Platform.isAndroid) {
						RenderSupport.PixiStage.y = 0.0;
						RenderSupport.ensureCurrentInputVisible();
					}
				}
				if(RenderSupport.RenderRoot != null) {
					var _g = 0;
					var _g1 = RenderSupport.FlowInstances;
					while(_g < _g1.length) {
						var instance = _g1[_g];
						++_g;
						var renderRoot = instance.stage.nativeWidget.host;
						var pixiView = instance.renderer.view;
						win_width = RenderSupport.getRenderRootWidth(renderRoot);
						win_height = RenderSupport.getRenderRootHeight(renderRoot);
						pixiView.width = win_width * RenderSupport.backingStoreRatio;
						pixiView.height = win_height * RenderSupport.backingStoreRatio;
						pixiView.style.width = win_width;
						pixiView.style.height = win_height;
						instance.renderer.resize(win_width,win_height);
					}
				} else {
					RenderSupport.PixiView.width = win_width * RenderSupport.backingStoreRatio;
					RenderSupport.PixiView.height = win_height * RenderSupport.backingStoreRatio;
					RenderSupport.PixiView.style.width = win_width;
					RenderSupport.PixiView.style.height = win_height;
					RenderSupport.PixiRenderer.resize(win_width,win_height);
				}
			}
			RenderSupport.broadcastResizeEvent();
			RenderSupport.InvalidateLocalStages();
			RenderSupport.animate();
		}
	});
};
RenderSupport.onBrowserWindowResize = function(e) {
	if(RenderSupport.printMode) {
		return;
	}
	var oldBrowserZoom = RenderSupport.browserZoom;
	RenderSupport.backingStoreRatio = RenderSupport.getBackingStoreRatio();
	if(RenderSupport.backingStoreRatio != RenderSupport.PixiRenderer.resolution) {
		RenderSupport.createPixiRenderer();
	} else {
		var win_width = Platform.isSamsung ? Math.min(e.target.innerWidth,e.target.outerWidth) : e.target.innerWidth;
		var win_height = e.target.innerHeight;
		if(RenderSupport.viewportScaleWorkaroundEnabled) {
			var viewportScale = RenderSupport.getViewportScale();
			var portraitOrientation = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
			if(!(!RenderSupport.viewportScaleWorkaroundEnabled && (portraitOrientation ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape) != -1)) {
				var screenSize;
				if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
					var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
					screenSize = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
				} else {
					screenSize = { width : window.screen.width, height : window.screen.height};
				}
				var innerHeightCompensation = RenderSupport.viewportScaleWorkaroundEnabled && window.innerHeight == RenderSupport.InnerHeightAtRenderTime && screenSize.height != window.innerHeight && screenSize.height - window.innerHeight * RenderSupport.getViewportScale() < 100 ? 95.0 / RenderSupport.getViewportScale() : 0.0;
				var topHeight = RenderSupport.viewportScaleWorkaroundEnabled ? screenSize.height - window.innerHeight + innerHeightCompensation : screenSize.height - window.innerHeight * RenderSupport.browserZoom;
				if(portraitOrientation) {
					if(RenderSupport.WindowTopHeightPortrait == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
						RenderSupport.WindowTopHeightPortrait = topHeight;
					}
				} else if(RenderSupport.WindowTopHeightLandscape == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
					RenderSupport.WindowTopHeightLandscape = topHeight;
				}
			}
			var screen_size;
			if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
				var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
				screen_size = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
			} else {
				screen_size = { width : window.screen.width, height : window.screen.height};
			}
			win_width = screen_size.width;
			win_height = (screen_size.height - (window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0 ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape)) * viewportScale;
			window.document.documentElement.style.width = "calc(100% * " + viewportScale + ")";
			window.document.documentElement.style.height = "calc(100% * " + viewportScale + ")";
			window.document.documentElement.style.transform = "scale(" + 1 / viewportScale + ")";
			window.document.documentElement.style.transformOrigin = "0 0";
		} else if(Platform.isAndroid || Platform.isIOS && (Platform.isChrome || ProgressiveWebTools.isRunningPWA())) {
			var portraitOrientation = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
			if(!(!RenderSupport.viewportScaleWorkaroundEnabled && (portraitOrientation ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape) != -1)) {
				var screenSize;
				if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
					var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
					screenSize = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
				} else {
					screenSize = { width : window.screen.width, height : window.screen.height};
				}
				var innerHeightCompensation = RenderSupport.viewportScaleWorkaroundEnabled && window.innerHeight == RenderSupport.InnerHeightAtRenderTime && screenSize.height != window.innerHeight && screenSize.height - window.innerHeight * RenderSupport.getViewportScale() < 100 ? 95.0 / RenderSupport.getViewportScale() : 0.0;
				var topHeight = RenderSupport.viewportScaleWorkaroundEnabled ? screenSize.height - window.innerHeight + innerHeightCompensation : screenSize.height - window.innerHeight * RenderSupport.browserZoom;
				if(portraitOrientation) {
					if(RenderSupport.WindowTopHeightPortrait == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
						RenderSupport.WindowTopHeightPortrait = topHeight;
					}
				} else if(RenderSupport.WindowTopHeightLandscape == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
					RenderSupport.WindowTopHeightLandscape = topHeight;
				}
			}
			if(oldBrowserZoom == RenderSupport.browserZoom) {
				var screen_size;
				if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
					var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
					screen_size = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
				} else {
					screen_size = { width : window.screen.width, height : window.screen.height};
				}
				if(!Platform.isAndroid) {
					win_width = screen_size.width;
				}
				win_height = Math.floor((screen_size.height - (RenderSupport.IsFullScreen ? 0.0 : window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0 ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape)) / RenderSupport.browserZoom);
			}
			if(Platform.isAndroid) {
				RenderSupport.PixiStage.y = 0.0;
				RenderSupport.ensureCurrentInputVisible();
			}
		}
		if(RenderSupport.RenderRoot != null) {
			var _g = 0;
			var _g1 = RenderSupport.FlowInstances;
			while(_g < _g1.length) {
				var instance = _g1[_g];
				++_g;
				var renderRoot = instance.stage.nativeWidget.host;
				var pixiView = instance.renderer.view;
				win_width = RenderSupport.getRenderRootWidth(renderRoot);
				win_height = RenderSupport.getRenderRootHeight(renderRoot);
				pixiView.width = win_width * RenderSupport.backingStoreRatio;
				pixiView.height = win_height * RenderSupport.backingStoreRatio;
				pixiView.style.width = win_width;
				pixiView.style.height = win_height;
				instance.renderer.resize(win_width,win_height);
			}
		} else {
			RenderSupport.PixiView.width = win_width * RenderSupport.backingStoreRatio;
			RenderSupport.PixiView.height = win_height * RenderSupport.backingStoreRatio;
			RenderSupport.PixiView.style.width = win_width;
			RenderSupport.PixiView.style.height = win_height;
			RenderSupport.PixiRenderer.resize(win_width,win_height);
		}
	}
	RenderSupport.broadcastResizeEvent();
	RenderSupport.InvalidateLocalStages();
	RenderSupport.animate();
};
RenderSupport.broadcastResizeEvent = function() {
	var _g = 0;
	var _g1 = RenderSupport.FlowInstances;
	while(_g < _g1.length) {
		var instance = _g1[_g];
		++_g;
		DisplayObjectHelper.broadcastEvent(instance.stage,"resize",RenderSupport.backingStoreRatio);
	}
};
RenderSupport.getViewportScale = function() {
	try {
		if(RenderSupport.viewportScaleWorkaroundEnabled) {
			return window.outerWidth / window.innerWidth;
		} else {
			return 1.0;
		}
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		var e = haxe_Exception.caught(_g).unwrap();
		console.log("getViewportScale error : ");
		console.log(e);
		return 1.0;
	}
};
RenderSupport.dropCurrentFocus = function() {
	if(window.document.activeElement != null && !RenderSupport.isEmulating) {
		window.document.activeElement.blur();
	}
};
RenderSupport.setDropCurrentFocusOnMouse = function(drop) {
	if(RenderSupport.DropCurrentFocusOnMouse != drop) {
		RenderSupport.DropCurrentFocusOnMouse = drop;
		var event_name = Platform.isMobile ? "touchend" : "mousedown";
		if(drop) {
			RenderSupport.on(event_name,RenderSupport.dropCurrentFocus);
		} else {
			RenderSupport.off(event_name,RenderSupport.dropCurrentFocus);
		}
	}
};
RenderSupport.pixiStageOnMouseMove = function() {
	if(!RenderSupport.isEmulating) {
		RenderSupport.switchFocusFramesShow(false);
	}
};
RenderSupport.addNonPassiveEventListener = function(element,event,fn) {
	element.addEventListener(event, fn, { passive : false });
};
RenderSupport.removeNonPassiveEventListener = function(element,event,fn) {
	element.removeEventListener(event, fn, { passive : false });
};
RenderSupport.addPassiveEventListener = function(element,event,fn) {
	element.addEventListener(event, fn, { passive : true });
};
RenderSupport.removePassiveEventListener = function(element,event,fn) {
	element.removeEventListener(event, fn, { passive : true });
};
RenderSupport.updateNonPassiveEventListener = function(element,event,fn) {
	if(RenderSupport.previousInstance != null && RenderSupport.previousInstance.stage.nativeWidget == window.document.body) {
		var listenerFn = RenderSupport.previousInstance.unregisterListener(event);
		RenderSupport.removeNonPassiveEventListener(RenderSupport.previousRoot,event,listenerFn);
	}
	var stage = RenderSupport.PixiStage;
	var fn2 = function(e) {
		fn(e,stage);
	};
	RenderSupport.addNonPassiveEventListener(element,event,fn2);
	stage.flowInstance.registerListener(event,fn2);
};
RenderSupport.emitKey = function(stage,eventName,ke) {
	if(stage.nativeWidget == window.document.body) {
		RenderSupport.emitForAll(eventName,RenderSupport.parseKeyEvent(ke));
	} else {
		stage.emit(eventName,RenderSupport.parseKeyEvent(ke));
	}
};
RenderSupport.onpointerdown = function(e,stage) {
	try {
		if(Util.getParameter("debug_click") == "1") {
			console.log("onpointerdown");
		}
		if(Platform.isIOS && RenderSupport.isInsideFrame() && window.document.activeElement != null && window.document.activeElement.tagName.toLowerCase() == "button") {
			return;
		}
		if(RenderSupport.PreventDefault && (!(Platform.isIOS && Platform.isChrome) || e.pointerType != "touch")) {
			e.preventDefault();
		}
		var rootPos = RenderSupport.getRenderRootPos(stage);
		var mousePos = RenderSupport.getMouseEventPosition(e,rootPos);
		if(e.touches != null) {
			RenderSupport.TouchPoints = e.touches;
			stage.emit("touchstart");
			if(e.touches.length == 1) {
				var touchPos = RenderSupport.getMouseEventPosition(e.touches[0],rootPos);
				RenderSupport.setMousePosition(touchPos);
				if(RenderSupport.MouseUpReceived) {
					stage.emit("mousedown");
				}
			} else if(e.touches.length > 1) {
				var touchPos1 = RenderSupport.getMouseEventPosition(e.touches[0],rootPos);
				var touchPos2 = RenderSupport.getMouseEventPosition(e.touches[1],rootPos);
				GesturesDetector.processPinch(touchPos1,touchPos2);
			}
		} else if(RenderSupport.HandlePointerTouchEvent || !Platform.isMobile || e.pointerType == null || e.pointerType != "touch" || !RenderSupport.isMousePositionEqual(mousePos)) {
			RenderSupport.setMousePosition(mousePos);
			if(e.which == 3 || e.button == 2) {
				stage.emit("mouserightdown");
			} else if(e.which == 2 || e.button == 1) {
				stage.emit("mousemiddledown");
			} else if(e.which == 1 || e.button == 0) {
				if(RenderSupport.MouseUpReceived) {
					stage.emit("mousedown");
				}
			}
		}
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		var e = haxe_Exception.caught(_g).unwrap();
		console.log("onpointerdown error : ");
		console.log(e);
	}
};
RenderSupport.onpointerup = function(e,stage) {
	try {
		if(Util.getParameter("debug_click") == "1") {
			console.log("onpointerup");
		}
		var rootPos = RenderSupport.getRenderRootPos(stage);
		var mousePos = RenderSupport.getMouseEventPosition(e,rootPos);
		if(e.touches != null) {
			RenderSupport.TouchPoints = e.touches;
			stage.emit("touchend");
			GesturesDetector.endPinch();
			if(e.touches.length == 0) {
				if(!RenderSupport.MouseUpReceived) {
					stage.emit("mouseup");
				}
			}
		} else if(RenderSupport.HandlePointerTouchEvent || !Platform.isMobile || e.pointerType == null || e.pointerType != "touch" || !RenderSupport.isMousePositionEqual(mousePos)) {
			RenderSupport.setMousePosition(mousePos);
			if(e.which == 3 || e.button == 2) {
				stage.emit("mouserightup");
			} else if(e.which == 2 || e.button == 1) {
				stage.emit("mousemiddleup");
			} else if(e.which == 1 || e.button == 0) {
				if(!RenderSupport.MouseUpReceived) {
					stage.emit("mouseup");
				}
			}
		}
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		var e = haxe_Exception.caught(_g).unwrap();
		console.log("onpointerup error : ");
		console.log(e);
	}
};
RenderSupport.onpointermove = function(e,stage) {
	try {
		var rootPos = RenderSupport.getRenderRootPos(stage);
		var mousePos = RenderSupport.getMouseEventPosition(e,rootPos);
		if(e.touches != null) {
			e.preventDefault();
			RenderSupport.TouchPoints = e.touches;
			stage.emit("touchmove");
			if(e.touches.length == 1) {
				var touchPos = RenderSupport.getMouseEventPosition(e.touches[0],rootPos);
				RenderSupport.setMousePosition(touchPos);
				stage.emit("mousemove");
			} else if(e.touches.length > 1) {
				var touchPos1 = RenderSupport.getMouseEventPosition(e.touches[0],rootPos);
				var touchPos2 = RenderSupport.getMouseEventPosition(e.touches[1],rootPos);
				GesturesDetector.processPinch(touchPos1,touchPos2);
			}
		} else if(RenderSupport.HandlePointerTouchEvent || !Platform.isMobile || e.pointerType == null || e.pointerType != "touch" || !RenderSupport.isMousePositionEqual(mousePos)) {
			RenderSupport.setMousePosition(mousePos);
			stage.emit("mousemove");
		}
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		var e = haxe_Exception.caught(_g).unwrap();
		console.log("onpointermove error : ");
		console.log(e);
	}
};
RenderSupport.onpointerout = function(e,stage) {
	try {
		if(e.relatedTarget == window.document.documentElement) {
			if(!RenderSupport.MouseUpReceived) {
				stage.emit("mouseup");
			}
		}
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		var e = haxe_Exception.caught(_g).unwrap();
		console.log("onpointerout error : ");
		console.log(e);
	}
};
RenderSupport.blockEvent = function(e,stage) {
	e.preventDefault();
};
RenderSupport.initPixiStageEventListeners = function() {
	var root = RenderSupport.PixiStage.nativeWidget;
	if(Platform.isMobile) {
		if(Platform.isAndroid || Platform.isChrome || Platform.isSafari && Platform.browserMajorVersion >= 13) {
			RenderSupport.updateNonPassiveEventListener(root,"pointerdown",RenderSupport.onpointerdown);
			RenderSupport.updateNonPassiveEventListener(root,"pointerup",RenderSupport.onpointerup);
			RenderSupport.updateNonPassiveEventListener(root,"pointermove",RenderSupport.onpointermove);
			RenderSupport.updateNonPassiveEventListener(root,"pointerout",RenderSupport.onpointerout);
		}
		RenderSupport.updateNonPassiveEventListener(root,"touchstart",RenderSupport.onpointerdown);
		RenderSupport.updateNonPassiveEventListener(root,"touchend",RenderSupport.onpointerup);
		RenderSupport.updateNonPassiveEventListener(root,"touchmove",RenderSupport.onpointermove);
	} else if(Platform.isSafari) {
		RenderSupport.updateNonPassiveEventListener(root,"mousedown",RenderSupport.onpointerdown);
		RenderSupport.updateNonPassiveEventListener(root,"mouseup",RenderSupport.onpointerup);
		RenderSupport.updateNonPassiveEventListener(root,"mousemove",RenderSupport.onpointermove);
		RenderSupport.updateNonPassiveEventListener(root,"mouseout",RenderSupport.onpointerout);
	} else if(Platform.isIE || Util.getParameter("debug_click_listener") == "1") {
		var stage = RenderSupport.PixiStage;
		root.onpointerdown = function(e) {
			RenderSupport.onpointerdown(e,stage);
		};
		root.onpointerup = function(e) {
			RenderSupport.onpointerup(e,stage);
		};
		root.onpointermove = function(e) {
			RenderSupport.onpointermove(e,stage);
		};
		root.onpointerout = function(e) {
			RenderSupport.onpointerout(e,stage);
		};
	} else {
		RenderSupport.updateNonPassiveEventListener(root,"pointerdown",RenderSupport.onpointerdown);
		RenderSupport.updateNonPassiveEventListener(root,"pointerup",RenderSupport.onpointerup);
		RenderSupport.updateNonPassiveEventListener(root,"pointermove",RenderSupport.onpointermove);
		RenderSupport.updateNonPassiveEventListener(root,"pointerout",RenderSupport.onpointerout);
		RenderSupport.updateNonPassiveEventListener(root,"touchstart",RenderSupport.blockEvent);
		RenderSupport.updateNonPassiveEventListener(root,"touchend",RenderSupport.blockEvent);
		RenderSupport.updateNonPassiveEventListener(root,"touchmove",RenderSupport.blockEvent);
	}
	RenderSupport.updateNonPassiveEventListener(root,"keydown",function(e,stage) {
		e.stopPropagation();
		if(RenderSupport.RendererType == "html") {
			RenderSupport.onKeyDownAccessibilityZoom(e);
		}
		RenderSupport.MousePos.x = e.clientX;
		RenderSupport.MousePos.y = e.clientY;
		RenderSupport.emitKey(stage,"keydown",e);
	});
	RenderSupport.updateNonPassiveEventListener(root,"keyup",function(e,stage) {
		e.stopPropagation();
		RenderSupport.MousePos.x = e.clientX;
		RenderSupport.MousePos.y = e.clientY;
		RenderSupport.emitKey(stage,"keyup",e);
	});
	var stage1 = RenderSupport.PixiStage;
	RenderSupport.setStageWheelHandler(function(p) {
		stage1.emit("mousewheel",p);
		RenderSupport.emitMouseEvent(stage1,"mousemove",RenderSupport.MousePos.x,RenderSupport.MousePos.y);
	});
	RenderSupport.on("mousedown",function(e) {
		RenderSupport.hadUserInteracted = true;
		RenderSupport.MouseUpReceived = false;
	});
	RenderSupport.on("mouseup",function(e) {
		RenderSupport.MouseUpReceived = true;
	});
	if(root != window.document.body) {
		RenderSupport.on("fullscreen",function() {
			var e = { target : window};
			if(!RenderSupport.printMode) {
				var oldBrowserZoom = RenderSupport.browserZoom;
				RenderSupport.backingStoreRatio = RenderSupport.getBackingStoreRatio();
				if(RenderSupport.backingStoreRatio != RenderSupport.PixiRenderer.resolution) {
					RenderSupport.createPixiRenderer();
				} else {
					var win_width = Platform.isSamsung ? Math.min(e.target.innerWidth,e.target.outerWidth) : e.target.innerWidth;
					var win_height = e.target.innerHeight;
					if(RenderSupport.viewportScaleWorkaroundEnabled) {
						var viewportScale = RenderSupport.getViewportScale();
						var portraitOrientation = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
						if(!(!RenderSupport.viewportScaleWorkaroundEnabled && (portraitOrientation ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape) != -1)) {
							var screenSize;
							if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
								var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
								screenSize = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
							} else {
								screenSize = { width : window.screen.width, height : window.screen.height};
							}
							var innerHeightCompensation = RenderSupport.viewportScaleWorkaroundEnabled && window.innerHeight == RenderSupport.InnerHeightAtRenderTime && screenSize.height != window.innerHeight && screenSize.height - window.innerHeight * RenderSupport.getViewportScale() < 100 ? 95.0 / RenderSupport.getViewportScale() : 0.0;
							var topHeight = RenderSupport.viewportScaleWorkaroundEnabled ? screenSize.height - window.innerHeight + innerHeightCompensation : screenSize.height - window.innerHeight * RenderSupport.browserZoom;
							if(portraitOrientation) {
								if(RenderSupport.WindowTopHeightPortrait == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
									RenderSupport.WindowTopHeightPortrait = topHeight;
								}
							} else if(RenderSupport.WindowTopHeightLandscape == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
								RenderSupport.WindowTopHeightLandscape = topHeight;
							}
						}
						var screen_size;
						if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
							var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
							screen_size = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
						} else {
							screen_size = { width : window.screen.width, height : window.screen.height};
						}
						win_width = screen_size.width;
						win_height = (screen_size.height - (window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0 ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape)) * viewportScale;
						window.document.documentElement.style.width = "calc(100% * " + viewportScale + ")";
						window.document.documentElement.style.height = "calc(100% * " + viewportScale + ")";
						window.document.documentElement.style.transform = "scale(" + 1 / viewportScale + ")";
						window.document.documentElement.style.transformOrigin = "0 0";
					} else if(Platform.isAndroid || Platform.isIOS && (Platform.isChrome || ProgressiveWebTools.isRunningPWA())) {
						var portraitOrientation = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
						if(!(!RenderSupport.viewportScaleWorkaroundEnabled && (portraitOrientation ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape) != -1)) {
							var screenSize;
							if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
								var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
								screenSize = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
							} else {
								screenSize = { width : window.screen.width, height : window.screen.height};
							}
							var innerHeightCompensation = RenderSupport.viewportScaleWorkaroundEnabled && window.innerHeight == RenderSupport.InnerHeightAtRenderTime && screenSize.height != window.innerHeight && screenSize.height - window.innerHeight * RenderSupport.getViewportScale() < 100 ? 95.0 / RenderSupport.getViewportScale() : 0.0;
							var topHeight = RenderSupport.viewportScaleWorkaroundEnabled ? screenSize.height - window.innerHeight + innerHeightCompensation : screenSize.height - window.innerHeight * RenderSupport.browserZoom;
							if(portraitOrientation) {
								if(RenderSupport.WindowTopHeightPortrait == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
									RenderSupport.WindowTopHeightPortrait = topHeight;
								}
							} else if(RenderSupport.WindowTopHeightLandscape == -1 || RenderSupport.viewportScaleWorkaroundEnabled) {
								RenderSupport.WindowTopHeightLandscape = topHeight;
							}
						}
						if(oldBrowserZoom == RenderSupport.browserZoom) {
							var screen_size;
							if(Platform.isIOS && (Platform.isChrome || Platform.isSafari || ProgressiveWebTools.isRunningPWA())) {
								var is_portrait = window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0;
								screen_size = is_portrait ? { width : window.screen.width, height : window.screen.height} : { height : window.screen.width, width : window.screen.height};
							} else {
								screen_size = { width : window.screen.width, height : window.screen.height};
							}
							if(!Platform.isAndroid) {
								win_width = screen_size.width;
							}
							win_height = Math.floor((screen_size.height - (RenderSupport.IsFullScreen ? 0.0 : window.matchMedia("(orientation: portrait)").matches || Platform.isAndroid && window.orientation == 0 ? RenderSupport.WindowTopHeightPortrait : RenderSupport.WindowTopHeightLandscape)) / RenderSupport.browserZoom);
						}
						if(Platform.isAndroid) {
							RenderSupport.PixiStage.y = 0.0;
							RenderSupport.ensureCurrentInputVisible();
						}
					}
					if(RenderSupport.RenderRoot != null) {
						var _g = 0;
						var _g1 = RenderSupport.FlowInstances;
						while(_g < _g1.length) {
							var instance = _g1[_g];
							++_g;
							var renderRoot = instance.stage.nativeWidget.host;
							var pixiView = instance.renderer.view;
							win_width = RenderSupport.getRenderRootWidth(renderRoot);
							win_height = RenderSupport.getRenderRootHeight(renderRoot);
							pixiView.width = win_width * RenderSupport.backingStoreRatio;
							pixiView.height = win_height * RenderSupport.backingStoreRatio;
							pixiView.style.width = win_width;
							pixiView.style.height = win_height;
							instance.renderer.resize(win_width,win_height);
						}
					} else {
						RenderSupport.PixiView.width = win_width * RenderSupport.backingStoreRatio;
						RenderSupport.PixiView.height = win_height * RenderSupport.backingStoreRatio;
						RenderSupport.PixiView.style.width = win_width;
						RenderSupport.PixiView.style.height = win_height;
						RenderSupport.PixiRenderer.resize(win_width,win_height);
					}
				}
				RenderSupport.broadcastResizeEvent();
				RenderSupport.InvalidateLocalStages();
				RenderSupport.animate();
			}
		});
	}
	RenderSupport.switchFocusFramesShow(false);
	RenderSupport.setDropCurrentFocusOnMouse(true);
};
RenderSupport.setStageWheelHandler = function(listener) {
	var event_name = 'onwheel' in document.createElement('div') ? 'wheel' : // Modern browsers support 'wheel'
			document.onmousewheel !== undefined ? 'mousewheel' : // Webkit and IE support at least 'mousewheel'
			'DOMMouseScroll'; // let's assume that remaining browsers are older Firefox;
	var isRenderRoot = RenderSupport.PixiStage.nativeWidget != window.document.body;
	var wheel_cb = function(event) {
		var sX = 0.0;
		var sY = 0.0;
		var pX = 0.0;
		var pY = 0.0;
		if(isRenderRoot || Platform.isSafari && event.deltaX < 0 && Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
			event.preventDefault();
		}
		if(isRenderRoot) {
			event.stopPropagation();
		}
		if(event.detail != null) {
			sY = event.detail;
		}
		if(event.wheelDelta != null) {
			sY = -event.wheelDelta / 120;
		}
		if(event.wheelDeltaY != null) {
			sY = -event.wheelDeltaY / 120;
		}
		if(event.wheelDeltaX != null) {
			sX = -event.wheelDeltaX / 120;
		}
		if(event.axis != null && HaxeRuntime.strictEq(event.axis,event.HORIZONTAL_AXIS)) {
			sX = sY;
			sY = 0.0;
		}
		pX = sX * RenderSupport.PIXEL_STEP;
		pY = sY * RenderSupport.PIXEL_STEP;
		if(event.deltaY != null) {
			pY = event.deltaY;
		}
		if(event.deltaX != null) {
			pX = event.deltaX;
		}
		if((pX != 0.0 || pY != 0.0) && event.deltaMode != null) {
			if(event.deltaMode == 1) {
				pX *= RenderSupport.LINE_HEIGHT;
				pY *= RenderSupport.LINE_HEIGHT;
			} else if(event.deltaMode == 2) {
				pX *= RenderSupport.PAGE_HEIGHT;
				pY *= RenderSupport.PAGE_HEIGHT;
			}
		}
		if(!RenderSupport.ScrollCatcherEnabled) {
			if(pX != 0.0 && sX == 0.0) {
				sX = pX < 1.0 ? -1.0 : 1.0;
			}
			if(pY != 0.0 && sY == 0.0) {
				sY = pY < 1.0 ? -1.0 : 1.0;
			}
		}
		if(event.shiftKey != null && event.shiftKey && sX == 0.0) {
			sX = sY;
			sY = 0.0;
		}
		if(RenderSupport.RendererType != "html" || !RenderSupport.onMouseWheelAccessibilityZoom(event,-sX,-sY)) {
			listener(new PIXI.Point(-sX,-sY));
		}
		return false;
	};
	var node = isRenderRoot ? RenderSupport.PixiStage.nativeWidget : window;
	node.addEventListener(event_name, wheel_cb, {passive : false, capture : false});
	if(event_name == "DOMMouseScroll") {
		node.addEventListener('MozMousePixelScroll', wheel_cb, {passive : false, capture : false});
	}
};
RenderSupport.provideEvent = function(e) {
	try {
		if(Platform.isIE) {
			RenderSupport.PixiView.dispatchEvent(new CustomEvent(e.type, e));
		} else {
			RenderSupport.PixiView.dispatchEvent(new e.constructor(e.type, e));
		}
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		var er = haxe_Exception.caught(_g).unwrap();
		Errors.report("Error in provideEvent: " + Std.string(er));
	}
};
RenderSupport.forceRollOverRollOutUpdate = function() {
	if(RenderSupport.RendererType != "html") {
		RenderSupport.PixiRenderer.plugins.interaction.mouseOverRenderer = true;
		RenderSupport.PixiRenderer.plugins.interaction.update(window.performance.now());
	}
};
RenderSupport.emitMouseEvent = function(clip,event,x,y) {
	RenderSupport.MousePos.x = x;
	RenderSupport.MousePos.y = y;
	if(event == "mousemove") {
		var me = { clientX : x | 0, clientY : y | 0};
		var e = Platform.isIE || Platform.isSafari ? new CustomEvent('pointermove', me) : new PointerEvent("pointermove",me);
		window.document.dispatchEvent(e);
		RenderSupport.forceRollOverRollOutUpdate();
	} else if(event == "pointerdown" || event == "pointerup" || event == "pointermove") {
		var me = { clientX : x | 0, clientY : y | 0};
		var e = Platform.isIE || Platform.isSafari ? event == "pointerdown" ? new CustomEvent('pointerdown', me) : event == "pointerup" ? new CustomEvent('pointerup', me) : new CustomEvent('pointermove', me) : new PointerEvent(event,me);
		clip.nativeWidget.dispatchEvent(e);
	}
	if(!Util.isMouseEventName(event) || RenderSupport.isStage(clip)) {
		clip.emit(event);
	} else {
		RenderSupport.emit(event);
	}
};
RenderSupport.emitKeyEvent = function(clip,event,key,ctrl,shift,alt,meta,keyCode) {
	var activeElement = window.document.activeElement;
	var ke = { key : key, ctrl : ctrl, shift : shift, alt : alt, meta : meta, keyCode : keyCode, preventDefault : function() {
	}};
	RenderSupport.emit(event,ke);
	if(activeElement.tagName.toLowerCase() == "input" || activeElement.tagName.toLowerCase() == "textarea") {
		var ke = { key : key, ctrlKey : ctrl, shiftKey : shift, altKey : alt, metaKey : meta, keyCode : keyCode};
		if((event == "keydown" || event == "keypress") && (key.length == 1 || keyCode == 8 || keyCode == 46)) {
			var selectionStart = activeElement.selectionStart != null ? activeElement.selectionStart : activeElement.value.length;
			var selectionEnd = activeElement.selectionEnd != null ? activeElement.selectionEnd : activeElement.value.length;
			activeElement.dispatchEvent(Platform.isIE ? new CustomEvent(event, ke) : new KeyboardEvent(event,ke));
			if(selectionStart == selectionEnd) {
				activeElement.value = keyCode == 8 ? activeElement.value.substr(0,selectionStart - 1) + activeElement.value.substr(selectionStart) : keyCode == 46 ? activeElement.value.substr(0,selectionStart) + activeElement.value.substr(selectionStart + 1) : activeElement.value.substr(0,selectionStart) + key + activeElement.value.substr(selectionStart);
			} else {
				activeElement.value = keyCode == 8 || keyCode == 46 ? activeElement.value.substr(0,selectionStart) + activeElement.value.substr(selectionEnd) : activeElement.value.substr(0,selectionStart) + key + activeElement.value.substr(selectionEnd);
			}
			var ie = {
					data : activeElement.value,
					inputType : 'insertText',
					isComposing : false,
					bubbles : true,
					composed : true,
					isTrusted : true
				}
			activeElement.dispatchEvent(Platform.isIE || Platform.isEdge ? new CustomEvent('input', ie) : new InputEvent('input', ie));
		} else {
			activeElement.dispatchEvent(Platform.isIE ? new CustomEvent(event, ke) : new KeyboardEvent(event,ke));
		}
	}
};
RenderSupport.ensureCurrentInputVisible = function() {
	var focused_node = window.document.activeElement;
	if(focused_node != null) {
		var node_name = focused_node.nodeName;
		node_name = node_name.toLowerCase();
		if(node_name == "input" || node_name == "textarea") {
			var visibleAreaHeight = Platform.isIOS ? window.innerHeight / 4 : window.innerHeight;
			var rect = focused_node.getBoundingClientRect();
			if(rect.bottom > visibleAreaHeight) {
				if(Platform.isIOS) {
					window.scrollTo(0,rect.bottom - visibleAreaHeight);
					var onblur = function() {
					};
					onblur = function() {
						window.scrollTo(0,0);
						focused_node.removeEventListener("blur",onblur);
					};
					focused_node.addEventListener("blur",onblur);
				} else {
					var mainStage = RenderSupport.PixiStage.children[0];
					var setMainStageY = function(y) {
						if(mainStage.y != y) {
							mainStage.y = y;
							RenderSupport.InvalidateLocalStages();
						}
					};
					setMainStageY(mainStage.y + visibleAreaHeight - rect.bottom);
					var onblur1 = function() {
					};
					onblur1 = function() {
						setMainStageY(0);
						focused_node.removeEventListener("blur",onblur1);
					};
					focused_node.addEventListener("blur",onblur1);
					var onresize = function() {
					};
					onresize = function() {
						setMainStageY(0);
						window.removeEventListener("resize",onresize);
					};
					window.addEventListener("resize",onresize);
				}
			}
		}
	}
};
RenderSupport.switchFocusFramesShow = function(toShowFrames) {
	if(RenderSupport.FocusFramesShown != toShowFrames) {
		RenderSupport.FocusFramesShown = toShowFrames;
		var onFound = function(pixijscss) {
			var newRuleIndex = 0;
			if(!toShowFrames) {
				pixijscss.insertRule(".focused { outline: none !important; box-shadow: none !important; }",newRuleIndex);
				RenderSupport.off("mousemove",RenderSupport.pixiStageOnMouseMove);
			} else {
				pixijscss.deleteRule(newRuleIndex);
				RenderSupport.on("mousemove",RenderSupport.pixiStageOnMouseMove);
			}
		};
		RenderSupport.findFlowjspixiCss(onFound);
	}
};
RenderSupport.findFlowjspixiCss = function(onFound) {
	var pixijscss = null;
	var _g = 0;
	var _g1 = window.document.styleSheets;
	while(_g < _g1.length) {
		var css = _g1[_g];
		++_g;
		if(css.href != null && css.href.indexOf("flowjspixi.css") >= 0) {
			pixijscss = css;
		}
	}
	if(pixijscss != null) {
		onFound(pixijscss);
	}
};
RenderSupport.StartFlowMain = function() {
	Errors.print("Starting flow main.");
	window["$8Y"]();
};
RenderSupport.requestAnimationFrame = function() {
	window.cancelAnimationFrame(RenderSupport.AnimationFrameId);
	RenderSupport.AnimationFrameId = window.requestAnimationFrame(RenderSupport.animate);
};
RenderSupport.animate = function(timestamp) {
	if(timestamp != null) {
		RenderSupport.emit("drawframe",timestamp);
	}
	if(RenderSupport.PageWasHidden && !window.document.hidden) {
		RenderSupport.PageWasHidden = false;
		RenderSupport.InvalidateLocalStages();
	} else if(window.document.hidden) {
		RenderSupport.PageWasHidden = true;
	}
	var _g = [];
	var _g1 = 0;
	var _g2 = VideoClip.playingVideos;
	while(_g1 < _g2.length) {
		var v = _g2[_g1];
		++_g1;
		var videoWidget = v.videoWidget;
		var tmp;
		if(videoWidget == null) {
			tmp = false;
		} else {
			var checkingGap = Platform.isIOS ? 0.5 : 0.0;
			v.checkTimeRange(videoWidget.currentTime,true,checkingGap);
			if(!((RenderSupport.RendererType == "html" || v.isHTML) && !v.isCanvas)) {
				if(videoWidget.width != videoWidget.videoWidth || videoWidget.height != videoWidget.videoHeight) {
					videoWidget.dispatchEvent(new Event("resize"));
				}
			}
			tmp = v.visible;
		}
		if(tmp) {
			_g.push(v);
		}
	}
	var playingVideosFiltered = _g;
	var tmp;
	if(playingVideosFiltered.length > 0) {
		window.dispatchEvent(Platform.isIE ? new CustomEvent('videoplaying') : new Event("videoplaying"));
		var _g = 0;
		while(_g < playingVideosFiltered.length) {
			var v = playingVideosFiltered[_g];
			++_g;
			DisplayObjectHelper.invalidateTransform(v);
		}
		tmp = true;
	} else {
		tmp = false;
	}
	if(tmp || RenderSupport.PixiStageChanged) {
		RenderSupport.Animating = true;
		RenderSupport.PixiStageChanged = false;
		if(RenderSupport.RendererType == "html") {
			RenderSupport.TransformChanged = false;
			AccessWidget.updateAccessTree();
			var _g = 0;
			var _g1 = RenderSupport.FlowInstances;
			while(_g < _g1.length) {
				var instance = _g1[_g];
				++_g;
				var stage = instance.stage;
				var renderer = instance.renderer;
				try {
					var _g2 = 0;
					var _g3 = stage.children;
					while(_g2 < _g3.length) {
						var child = _g3[_g2];
						++_g2;
						child.render(renderer);
					}
				} catch( _g4 ) {
					haxe_NativeStackTrace.lastError = _g4;
					var e = haxe_Exception.caught(_g4).unwrap();
					console.log("Error in render children",e);
				}
			}
		} else {
			RenderSupport.TransformChanged = false;
			if(RenderSupport.RendererType == "canvas") {
				var _g = 0;
				var _g1 = RenderSupport.PixiStage.children;
				while(_g < _g1.length) {
					var child = _g1[_g];
					++_g;
					child.updateView();
				}
			}
			AccessWidget.updateAccessTree();
			var _g = 0;
			var _g1 = RenderSupport.PixiStage.children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				child.render(RenderSupport.PixiRenderer);
			}
		}
		RenderSupport.PixiRenderer._lastObjectRendered = RenderSupport.PixiStage;
		RenderSupport.PixiStageChanged = false;
		RenderSupport.Animating = false;
		RenderSupport.emit("stagechanged",timestamp);
	} else {
		AccessWidget.updateAccessTree();
	}
	RenderSupport.requestAnimationFrame();
};
RenderSupport.render = function() {
	RenderSupport.animate();
};
RenderSupport.forceRender = function() {
	var _g = 0;
	var _g1 = RenderSupport.PixiStage.children || [];
	while(_g < _g1.length) {
		var child = _g1[_g];
		++_g;
		DisplayObjectHelper.invalidateTransform(child,"forceRender",true);
	}
	RenderSupport.animate();
};
RenderSupport.enablePasteEventListener = function() {
	RenderSupport.onPasteEnabled = true;
};
RenderSupport.disablePasteEventListener = function() {
	RenderSupport.onPasteEnabled = false;
};
RenderSupport.addPasteEventListener = function(fn) {
	var filteredFn = function(arg) {
		if(RenderSupport.onPasteEnabled) {
			fn(arg);
		}
	};
	RenderSupport.on("paste",filteredFn);
	return function() {
		RenderSupport.off("paste",filteredFn);
	};
};
RenderSupport.addMessageEventListener = function(fn) {
	var handler = function(e) {
		if(typeof e.data == "string") {
			fn(e.data,e.origin);
		}
	};
	RenderSupport.on("message",handler);
	return function() {
		RenderSupport.off("message",handler);
	};
};
RenderSupport.InvalidateLocalStages = function() {
	var _g = 0;
	var _g1 = RenderSupport.PixiStage.children;
	while(_g < _g1.length) {
		var child = _g1[_g];
		++_g;
		DisplayObjectHelper.invalidateTransform(child,"InvalidateLocalStages",true);
	}
	RenderSupport.animate();
};
RenderSupport.getPixelsPerCm = function() {
	return 37.795275590551178;
};
RenderSupport.getBrowserZoom = function() {
	return RenderSupport.browserZoom;
};
RenderSupport.isDarkMode = function() {
	return Platform.isDarkMode;
};
RenderSupport.setHitboxRadius = function(radius) {
	return false;
};
RenderSupport.setAccessibilityEnabled = function(enabled) {
	RenderSupport.AccessibilityEnabled = enabled && Platform.AccessiblityAllowed;
};
RenderSupport.setEnableFocusFrame = function(show) {
	RenderSupport.EnableFocusFrame = show;
};
RenderSupport.setAccessAttributes = function(clip,attributes) {
	var attributesMap = new haxe_ds_StringMap();
	var _g = 0;
	while(_g < attributes.length) {
		var kv = attributes[_g];
		++_g;
		attributesMap.h[kv[0]] = kv[1];
	}
	var accessWidget = clip.accessWidget;
	if(accessWidget == null) {
		if(RenderSupport.AccessibilityEnabled || attributesMap.h["tag"] == "form" || clip.iframe != null) {
			if((RenderSupport.RendererType == "html" || clip.isHTML) && !clip.isCanvas) {
				DisplayObjectHelper.initNativeWidget(clip);
			}
			var nativeWidget = clip.nativeWidget;
			if(clip.iframe != null) {
				nativeWidget = clip.iframe;
			}
			if(nativeWidget != null) {
				accessWidget = new AccessWidget(clip,nativeWidget);
				clip.accessWidget = accessWidget;
				accessWidget.addAccessAttributes(attributesMap);
			} else if(!((RenderSupport.RendererType == "html" || clip.isHTML) && !clip.isCanvas)) {
				if(clip.accessWidget != null) {
					AccessWidget.removeAccessWidget(clip.accessWidget);
				}
				var tagName = attributesMap.h["tag"];
				if(tagName == null) {
					tagName = AccessWidget.accessRoleMap.h[attributesMap.h["role"]];
				}
				if(tagName == null) {
					tagName = "div";
				}
				clip.accessWidget = new AccessWidget(clip,window.document.createElement(tagName));
				clip.accessWidget.addAccessAttributes(attributesMap);
			}
		}
	} else {
		accessWidget.addAccessAttributes(attributesMap);
	}
};
RenderSupport.setClipStyle = function(clip,name,value) {
	var accessWidget = clip.accessWidget;
	if(accessWidget == null) {
		if(RenderSupport.AccessibilityEnabled || (RenderSupport.RendererType == "html" || clip.isHTML) && !clip.isCanvas) {
			if((RenderSupport.RendererType == "html" || clip.isHTML) && !clip.isCanvas) {
				DisplayObjectHelper.initNativeWidget(clip);
			}
			var nativeWidget = clip.nativeWidget;
			if(nativeWidget != null) {
				accessWidget = new AccessWidget(clip,nativeWidget);
				clip.accessWidget = accessWidget;
				accessWidget.get_element().style[name] = value;
			}
		}
	} else {
		accessWidget.get_element().style[name] = value;
	}
};
RenderSupport.removeAccessAttributes = function(clip) {
	if(clip.accessWidget != null) {
		AccessWidget.removeAccessWidget(clip.accessWidget);
	}
};
RenderSupport.setAccessCallback = function(clip,callback) {
	clip.accessCallback = callback;
};
RenderSupport.setClipTagName = function(clip,tagName) {
	if(clip.nativeWidget != null) {
		clip.nativeWidget = null;
		clip.tagName = tagName;
		clip.createNativeWidget(tagName);
		if(clip.updateNativeWidgetStyle != null) {
			clip.updateNativeWidgetStyle();
		}
		DisplayObjectHelper.invalidateTransform(clip);
	} else {
		clip.tagName = tagName;
	}
};
RenderSupport.setClipClassName = function(clip,className) {
	clip.className = className;
	if(clip.nativeWidget == null) {
		DisplayObjectHelper.initNativeWidget(clip);
	} else {
		clip.nativeWidget.classList.add(className);
	}
};
RenderSupport.setShouldPreventFromBlur = function(clip) {
	if(clip.nativeWidget != null && clip.shouldPreventFromBlur != null) {
		clip.shouldPreventFromBlur = true;
	}
	var children = clip.children;
	if(children != null) {
		var _g = 0;
		while(_g < children.length) {
			var child = children[_g];
			++_g;
			RenderSupport.setShouldPreventFromBlur(child);
		}
	}
};
RenderSupport.currentClip = function() {
	return RenderSupport.PixiStage;
};
RenderSupport.mainRenderClip = function() {
	if(RenderSupport.PixiStage.children.length == 0) {
		var stage = new FlowContainer();
		RenderSupport.addChild(RenderSupport.PixiStage,stage);
		return stage;
	} else if(RenderSupport.FullScreenClip != null) {
		return RenderSupport.FullScreenClip;
	} else {
		return js_Boot.__cast(RenderSupport.PixiStage.children[0] , FlowContainer);
	}
};
RenderSupport.enableResize = function() {
	RenderSupport.IsLoading = false;
	if(RenderSupport.PixiView != null) {
		RenderSupport.PixiView.style.display = "block";
	}
	if(RenderSupport.previousRoot != null && RenderSupport.previousRoot.style != null) {
		RenderSupport.previousRoot.style.backgroundImage = null;
	}
	if(RenderSupport.PixiStage.nativeWidget.style != null) {
		RenderSupport.PixiStage.nativeWidget.style.backgroundImage = "none";
	}
	var indicator = window.document.getElementById("loading_js_indicator");
	if(indicator != null) {
		window.document.body.removeChild(indicator);
	}
};
RenderSupport.getStageWidth = function() {
	return RenderSupport.PixiRenderer.width / RenderSupport.backingStoreRatio / RenderSupport.getAccessibilityZoom();
};
RenderSupport.getStageHeight = function() {
	return RenderSupport.PixiRenderer.height / RenderSupport.backingStoreRatio / RenderSupport.getAccessibilityZoom();
};
RenderSupport.getStageWidthOf = function(renderRootId) {
	if(renderRootId == "") {
		return RenderSupport.getStageWidth();
	}
	var existingInstance = RenderSupport.getInstanceByRootId(renderRootId);
	if(existingInstance == null) {
		console.warn("WARNING! Existing instance has not been found into FlowInstances");
		return RenderSupport.getStageWidth();
	} else {
		return existingInstance.renderer.width / RenderSupport.backingStoreRatio / RenderSupport.getAccessibilityZoom();
	}
};
RenderSupport.getStageHeightOf = function(renderRootId) {
	if(renderRootId == "") {
		return RenderSupport.getStageHeight();
	}
	var existingInstance = RenderSupport.getInstanceByRootId(renderRootId);
	if(existingInstance == null) {
		console.warn("WARNING! Existing instance has not been found into FlowInstances");
		return RenderSupport.getStageHeight();
	} else {
		return existingInstance.renderer.height / RenderSupport.backingStoreRatio / RenderSupport.getAccessibilityZoom();
	}
};
RenderSupport.loadPreconfiguredFonts = function(families,onDone) {
	FontLoader.loadPreconfiguredWebFonts(families,onDone);
};
RenderSupport.loadFSFont = function(family,url) {
	FontLoader.loadFSFont(family,url);
};
RenderSupport.getFontStylesConfigString = function() {
	return haxe_Resource.getString("fontstyles");
};
RenderSupport.makeTextField = function(fontFamily) {
	return new TextClip();
};
RenderSupport.setTextAndStyle = function(clip,text,fontFamily,fontSize,fontWeight,fontSlope,fillColor,fillOpacity,letterSpacing,backgroundColor,backgroundOpacity) {
	clip.setTextAndStyle(text,fontFamily,fontSize,fontWeight,fontSlope,fillColor,fillOpacity,letterSpacing,backgroundColor,backgroundOpacity);
};
RenderSupport.setLineHeightPercent = function(clip,lineHeightPercent) {
	clip.setLineHeightPercent(lineHeightPercent);
};
RenderSupport.setTextNeedBaseline = function(clip,needBaseline) {
	clip.setNeedBaseline(needBaseline);
};
RenderSupport.setTextPreventCheckTextNodeWidth = function(clip,prevent) {
	clip.setPreventCheckTextNodeWidth(prevent);
};
RenderSupport.setEscapeHTML = function(clip,escapeHTML) {
	clip.setEscapeHTML(escapeHTML);
};
RenderSupport.setTextWordSpacing = function(clip,spacing) {
	clip.setTextWordSpacing(spacing);
};
RenderSupport.setAdvancedText = function(clip,sharpness,antialiastype,gridfittype) {
};
RenderSupport.makeVideo = function(metricsFn,playFn,durationFn,positionFn) {
	return new VideoClip(metricsFn,playFn,durationFn,positionFn);
};
RenderSupport.setVideoVolume = function(clip,volume) {
	clip.setVolume(volume);
};
RenderSupport.setVideoLooping = function(clip,loop) {
	clip.setLooping(loop);
};
RenderSupport.setVideoControls = function(clip,controls) {
};
RenderSupport.setVideoIsAudio = function(clip) {
	clip.setIsAudio();
};
RenderSupport.setVideoSubtitle = function(clip,text,fontfamily,fontsize,fontweight,fontslope,fillcolor,fillopacity,letterspacing,backgroundcolour,backgroundopacity,alignBottom,bottomBorder,scaleMode,scaleModeMin,scaleModeMax,escapeHTML) {
	clip.setVideoSubtitle(text,fontfamily,fontsize,fontweight,fontslope,fillcolor,fillopacity,letterspacing,backgroundcolour,backgroundopacity,alignBottom,bottomBorder,scaleMode,scaleModeMin,scaleModeMax,escapeHTML);
};
RenderSupport.setVideoPlaybackRate = function(clip,rate) {
	clip.setPlaybackRate(rate);
};
RenderSupport.setVideoTimeRange = function(clip,start,end) {
	clip.setTimeRange(start,end);
};
RenderSupport.playVideo = function(vc,filename,startPaused,headers) {
	vc.playVideo(filename,startPaused,headers);
};
RenderSupport.playVideoFromMediaStream = function(vc,mediaStream,startPaused) {
	vc.playVideoFromMediaStream(mediaStream,startPaused);
};
RenderSupport.seekVideo = function(clip,seek) {
	clip.setCurrentTime(seek);
};
RenderSupport.getVideoPosition = function(clip) {
	return clip.getCurrentTime();
};
RenderSupport.getVideoCurrentFrame = function(clip) {
	return clip.getCurrentFrame();
};
RenderSupport.pauseVideo = function(clip) {
	clip.pauseVideo();
};
RenderSupport.resumeVideo = function(clip) {
	clip.resumeVideo();
};
RenderSupport.closeVideo = function(clip) {
};
RenderSupport.getTextFieldCharXPosition = function(textclip,charIdx) {
	return textclip.getCharXPosition(charIdx);
};
RenderSupport.findTextFieldCharByPosition = function(textclip,x,y) {
	if(x < 0) {
		x = 0;
	} else {
		var width = RenderSupport.getTextFieldWidth(textclip);
		if(x > width) {
			x = width;
		}
	}
	var EPSILON = 0.1;
	var clip = RenderSupport.getClipAt(textclip,new PIXI.Point(x,y),false,null,false);
	try {
		textclip = js_Boot.__cast(clip , TextClip);
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		if(typeof(haxe_Exception.caught(_g).unwrap()) == "string") {
			clip = textclip;
		} else {
			throw _g;
		}
	}
	if(textclip == null) {
		return -1;
	}
	var clipGlyphs = textclip.getContentGlyphs();
	var clipStyle = textclip.getStyle();
	var leftVal = 0;
	var mtxWidth = TextClip.measureTextModFrag(clipGlyphs,clipStyle,0,clipGlyphs.text.length);
	var rightVal = mtxWidth;
	if(Math.abs(leftVal - rightVal) < EPSILON) {
		return 0;
	}
	var org = clip.toGlobal(new PIXI.Point(0.0,0.0));
	var localX = Math.min(mtxWidth,Math.max(0.0,x - org.x));
	if(TextClip.getStringDirection(clipGlyphs.text,textclip.getTextDirection()) == "rtl") {
		localX = rightVal - localX;
	}
	var leftPos = 0;
	var rightPos = clipGlyphs.modified.length;
	var midVal = -1.0;
	var midPos = -1;
	var oldPos = rightPos;
	while(Math.abs(localX - midVal) >= EPSILON && Math.round(midPos) != Math.round(oldPos)) {
		oldPos = midPos;
		midPos = leftPos + (rightPos - leftPos) * (localX - leftVal) / (rightVal - leftVal);
		if(midPos < leftPos) {
			break;
		}
		mtxWidth = TextClip.measureTextModFrag(clipGlyphs,clipStyle,Math.floor(leftPos),Math.ceil(leftPos));
		midVal = leftVal - mtxWidth * (leftPos - Math.floor(leftPos));
		mtxWidth = TextClip.measureTextModFrag(clipGlyphs,clipStyle,Math.floor(leftPos),Math.floor(midPos));
		midVal += mtxWidth;
		mtxWidth = TextClip.measureTextModFrag(clipGlyphs,clipStyle,Math.floor(midPos),Math.ceil(midPos));
		midVal += mtxWidth * (midPos - Math.floor(midPos));
		leftPos = midPos;
		leftVal = midVal;
	}
	var mappingOffset = 0.0;
	var _g = 0;
	var _g1 = Math.round(midPos);
	while(_g < _g1) {
		var i = _g++;
		if(i < Math.ceil(midPos) - 1) {
			mappingOffset += clipGlyphs.difPositionMapping[i];
		} else {
			mappingOffset += clipGlyphs.difPositionMapping[i] * (midPos - Math.floor(midPos));
		}
	}
	return Math.round(midPos + mappingOffset) + textclip.charIdx;
};
RenderSupport.getTextFieldWidth = function(clip) {
	if(clip.isInput) {
		return clip.getWidth();
	} else {
		return clip.getClipWidth();
	}
};
RenderSupport.getTextFieldMaxWidth = function(clip) {
	return clip.getMaxWidth();
};
RenderSupport.setTextFieldWidth = function(clip,width) {
	clip.setWidth(width);
};
RenderSupport.getTextFieldHeight = function(clip) {
	if(clip.isInput) {
		return clip.getHeight();
	} else {
		return clip.getClipHeight();
	}
};
RenderSupport.setTextFieldHeight = function(clip,height) {
	if(height > 0.0) {
		clip.setHeight(height);
	}
};
RenderSupport.setTextFieldCropWords = function(clip,crop) {
	clip.setCropWords(crop);
};
RenderSupport.setTextFieldCursorColor = function(clip,color,opacity) {
	clip.setCursorColor(color,opacity);
};
RenderSupport.setTextFieldCursorWidth = function(clip,width) {
	clip.setCursorWidth(width);
};
RenderSupport.setTextEllipsis = function(clip,lines,cb) {
	clip.setEllipsis(lines,cb);
};
RenderSupport.setTextFieldInterlineSpacing = function(clip,spacing) {
	clip.setInterlineSpacing(spacing);
};
RenderSupport.setTextDirection = function(clip,direction) {
	clip.setTextDirection(direction);
};
RenderSupport.setTextSkipOrderCheck = function(clip,skip) {
	clip.setTextSkipOrderCheck(skip);
};
RenderSupport.setAutoAlign = function(clip,autoalign) {
	clip.setAutoAlign(autoalign);
};
RenderSupport.setPreventContextMenu = function(clip,preventContextMenu) {
	clip.setPreventContextMenu(preventContextMenu);
};
RenderSupport.setTextInput = function(clip) {
	clip.setTextInput();
};
RenderSupport.setTextInputType = function(clip,type) {
	clip.setTextInputType(type);
};
RenderSupport.setTextInputAutoCompleteType = function(clip,type) {
	clip.setTextInputAutoCompleteType(type);
};
RenderSupport.setTextInputStep = function(clip,step) {
	clip.setTextInputStep(step);
};
RenderSupport.setTabIndex = function(clip,index) {
	clip.setTabIndex(index);
};
RenderSupport.setTabEnabled = function(enabled) {
};
RenderSupport.getContent = function(clip) {
	return clip.getContent();
};
RenderSupport.getCursorPosition = function(clip) {
	return clip.getCursorPosition();
};
RenderSupport.getFocus = function(clip) {
	return clip.getFocus();
};
RenderSupport.getScrollV = function(clip) {
	return 0;
};
RenderSupport.setScrollV = function(clip,suggestedPosition) {
};
RenderSupport.getBottomScrollV = function(clip) {
	return 0;
};
RenderSupport.getNumLines = function(clip) {
	return 0;
};
RenderSupport.setFocus = function(clip,focus) {
	AccessWidget.updateAccessTree();
	if(focus) {
		RenderSupport.animate();
	}
	DisplayObjectHelper.setClipFocus(clip,focus);
};
RenderSupport.setMultiline = function(clip,multiline) {
	clip.setMultiline(multiline);
};
RenderSupport.setWordWrap = function(clip,wordWrap) {
	clip.setWordWrap(wordWrap);
};
RenderSupport.setDoNotInvalidateStage = function(clip,dontInvalidate) {
	clip.setDoNotInvalidateStage(dontInvalidate);
};
RenderSupport.getSelectionStart = function(clip) {
	return clip.getSelectionStart();
};
RenderSupport.getSelectionEnd = function(clip) {
	return clip.getSelectionEnd();
};
RenderSupport.setSelection = function(clip,start,end) {
	clip.setSelection(start,end);
};
RenderSupport.setReadOnly = function(clip,readOnly) {
	clip.setReadOnly(readOnly);
};
RenderSupport.setMaxChars = function(clip,maxChars) {
	clip.setMaxChars(maxChars);
};
RenderSupport.addTextInputFilter = function(clip,filter) {
	return clip.addTextInputFilter(filter);
};
RenderSupport.addTextInputEventFilter = function(clip,filter) {
	return clip.addTextInputEventFilter(filter);
};
RenderSupport.addTextInputKeyEventFilter = function(clip,event,filter) {
	if(event == "keydown") {
		return clip.addTextInputKeyDownEventFilter(filter);
	} else {
		return clip.addTextInputKeyUpEventFilter(filter);
	}
};
RenderSupport.addTextInputOnCopyEvent = function(clip,fn) {
	return clip.addOnCopyEventListener(fn);
};
RenderSupport.addChild = function(parent,child) {
	parent.addChild(child);
};
RenderSupport.addChildAt = function(parent,child,id) {
	parent.addChildAt(child,id);
};
RenderSupport.removeChild = function(parent,child) {
	if(parent.removeElementChild != null) {
		parent.removeElementChild(child);
	} else if(child.parent == parent || child.parentElement == parent) {
		parent.removeChild(child);
	}
};
RenderSupport.removeChildren = function(parent) {
	var _g = 0;
	var _g1 = parent.children;
	while(_g < _g1.length) {
		var child = _g1[_g];
		++_g;
		parent.removeChild(child);
	}
};
RenderSupport.makeClip = function() {
	return new FlowContainer();
};
RenderSupport.makeCanvasClip = function() {
	return new FlowCanvas();
};
RenderSupport.setClipCallstack = function(clip,callstack) {
};
RenderSupport.setClipX = function(clip,x) {
	var x1 = x;
	if(clip.scrollRect != null) {
		x1 -= clip.scrollRect.x;
	}
	if(!clip.destroyed && clip.x != x1) {
		var from = DisplayObjectHelper.DebugUpdate ? "setClipX " + clip.x + " : " + x1 : null;
		clip.x = x1;
		DisplayObjectHelper.invalidateTransform(clip,from);
	}
};
RenderSupport.setClipY = function(clip,y) {
	var y1 = y;
	if(clip.scrollRect != null) {
		y1 -= clip.scrollRect.y;
	}
	if(!clip.destroyed && clip.y != y1) {
		var from = DisplayObjectHelper.DebugUpdate ? "setClipY " + clip.y + " : " + y1 : null;
		clip.y = y1;
		DisplayObjectHelper.invalidateTransform(clip,from);
	}
};
RenderSupport.setClipScaleX = function(clip,scale) {
	if(!clip.destroyed && clip.scale.x != scale) {
		var from = DisplayObjectHelper.DebugUpdate ? "setClipScaleX " + clip.scale.x + " : " + scale : null;
		clip.scale.x = scale;
		if((RenderSupport.RendererType == "html" || clip.isHTML) && !clip.isCanvas && scale != 0.0) {
			DisplayObjectHelper.initNativeWidget(clip);
		}
		DisplayObjectHelper.invalidateTransform(clip,from);
	}
};
RenderSupport.setClipScaleY = function(clip,scale) {
	if(!clip.destroyed && clip.scale.y != scale) {
		var from = DisplayObjectHelper.DebugUpdate ? "setClipScaleY " + clip.scale.y + " : " + scale : null;
		clip.scale.y = scale;
		if((RenderSupport.RendererType == "html" || clip.isHTML) && !clip.isCanvas && scale != 0.0) {
			DisplayObjectHelper.initNativeWidget(clip);
		}
		DisplayObjectHelper.invalidateTransform(clip,from);
	}
};
RenderSupport.setClipRotation = function(clip,r) {
	var rotation = r * 0.0174532925;
	if(!clip.destroyed && clip.rotation != rotation) {
		var from = DisplayObjectHelper.DebugUpdate ? "setClipRotation " + clip.rotation + " : " + rotation : null;
		clip.rotation = rotation;
		DisplayObjectHelper.invalidateTransform(clip,from);
	}
};
RenderSupport.setClipOrigin = function(clip,x,y) {
	if(!clip.destroyed && clip.origin == null || clip.origin.x != x && clip.origin.y != y) {
		var from = DisplayObjectHelper.DebugUpdate ? "setClipOrigin " + (clip.origin + " : " + x + " " + y) : null;
		clip.origin = new PIXI.Point(x,y);
		if((RenderSupport.RendererType == "html" || clip.isHTML) && !clip.isCanvas) {
			DisplayObjectHelper.initNativeWidget(clip);
			if(clip.nativeWidget != null) {
				clip.nativeWidget.style.transformOrigin = clip.origin.x * 100 + "% " + (clip.origin.y * 100 + "%");
				clip.transform.pivot.x = 0.0;
				clip.transform.pivot.y = 0.0;
			} else {
				var tmp = clip.getWidth != null ? clip.getWidth() : clip.getLocalBounds().width;
				clip.transform.pivot.x = tmp * clip.origin.x;
				var tmp = DisplayObjectHelper.getHeight(clip);
				clip.transform.pivot.y = tmp * clip.origin.y;
			}
		} else {
			var tmp = clip.getWidth != null ? clip.getWidth() : clip.getLocalBounds().width;
			clip.transform.pivot.x = tmp * clip.origin.x;
			var tmp = DisplayObjectHelper.getHeight(clip);
			clip.transform.pivot.y = tmp * clip.origin.y;
		}
		DisplayObjectHelper.invalidateTransform(clip,from);
	}
};
RenderSupport.getGlobalTransform = function(clip) {
	if(clip.parent != null) {
		var a = clip.worldTransform;
		var az = RenderSupport.getAccessibilityZoom();
		return [a.a / az,a.b,a.c,a.d / az,a.tx / az,a.ty / az];
	} else {
		return [1.0,0.0,0.0,1.0,0.0,0.0];
	}
};
RenderSupport.addClipAnimation = function(clip,keyframes,options,onFinish,fallbackAnimation) {
	if((RenderSupport.RendererType == "html" || clip.isHTML) && !clip.isCanvas && window.document.body.animate != null && !Platform.isSafari && !Platform.isIOS && Util.getParameter("native_animation") != "0") {
		if(clip.nativeWidget == null) {
			DisplayObjectHelper.initNativeWidget(clip);
		}
		if(clip.nativeWidget == null) {
			return fallbackAnimation();
		} else {
			try {
				if(!clip.hasAnimation) {
					clip.hasAnimation = true;
					DisplayObjectHelper.invalidateTransform(clip,"addClipAnimation");
				}
				var nativeWidget = clip.nativeWidget;
				var optionsObject = { };
				var disposed = false;
				if(DisplayObjectHelper.isClipOnStage(clip)) {
					DisplayObjectHelper.updateNativeWidget(clip);
				}
				var isNormalInteger = function(str) {
					var n = Math.floor(Std.parseInt(str));
					if(n != Infinity && (n == null ? "null" : "" + n) == str) {
						return n >= 0;
					} else {
						return false;
					}
				};
				var _g = 0;
				while(_g < options.length) {
					var option = options[_g];
					++_g;
					if(isNormalInteger(option[1])) {
						optionsObject[option[0]] = Std.parseInt(option[1]);
					} else {
						optionsObject[option[0]] = option[1];
					}
				}
				var nativeWidget1 = nativeWidget;
				var result = new Array(keyframes.length);
				var _g = 0;
				var _g1 = keyframes.length;
				while(_g < _g1) {
					var i = _g++;
					var keyframe = keyframes[i];
					var o = { };
					var ii = keyframe.length / 2 | 0;
					var _g2 = 0;
					var _g3 = ii;
					while(_g2 < _g3) {
						var i1 = _g2++;
						o[keyframe[i1 * 2]] = keyframe[i1 * 2 + 1];
					}
					result[i] = o;
				}
				var animation = nativeWidget1.animate(result,optionsObject);
				animation.oncancel = function() {
					if(!disposed) {
						disposed = true;
						onFinish();
					}
					if(DisplayObjectHelper.isClipOnStage(clip)) {
						DisplayObjectHelper.updateNativeWidget(clip);
					}
				};
				animation.onremove = function() {
					if(!disposed) {
						disposed = true;
						onFinish();
					}
					if(DisplayObjectHelper.isClipOnStage(clip)) {
						DisplayObjectHelper.updateNativeWidget(clip);
					}
				};
				animation.onfinish = function() {
					if(!disposed) {
						disposed = true;
						onFinish();
					}
					if(DisplayObjectHelper.isClipOnStage(clip)) {
						DisplayObjectHelper.updateNativeWidget(clip);
					}
				};
				return function() {
					if(animation != null) {
						animation.cancel();
					}
				};
			} catch( _g ) {
				haxe_NativeStackTrace.lastError = _g;
				var e = haxe_Exception.caught(_g).unwrap();
				haxe_Log.trace("addClipAnimation error:",{ fileName : "RenderSupport.hx", lineNumber : 2682, className : "RenderSupport", methodName : "addClipAnimation"});
				haxe_Log.trace(e,{ fileName : "RenderSupport.hx", lineNumber : 2683, className : "RenderSupport", methodName : "addClipAnimation"});
				return fallbackAnimation();
			}
		}
	} else {
		return fallbackAnimation();
	}
};
RenderSupport.deferUntilRender = function(fn) {
	RenderSupport.once("drawframe",fn);
};
RenderSupport.interruptibleDeferUntilRender = function(fn0) {
	var alive = true;
	var fn = function() {
		if(alive) {
			fn0();
		}
	};
	RenderSupport.once("drawframe",fn);
	return function() {
		alive = false;
		RenderSupport.off("drawframe",fn);
	};
};
RenderSupport.setClipAlpha = function(clip,a) {
	if(!clip.destroyed && clip.alpha != a) {
		var from = DisplayObjectHelper.DebugUpdate ? "setClipAlpha " + clip.alpha + " : " + a : null;
		clip.alpha = a;
		DisplayObjectHelper.invalidateTransform(clip,from);
	}
};
RenderSupport.getFirstVideoWidget = function(clip) {
	if(HaxeRuntime.instanceof(clip,VideoClip)) {
		return clip;
	}
	if(clip.children != null) {
		var _g = 0;
		var _g1 = clip.children;
		while(_g < _g1.length) {
			var c = _g1[_g];
			++_g;
			var video = RenderSupport.getFirstVideoWidget(c);
			if(video != null) {
				return video;
			}
		}
	}
	return null;
};
RenderSupport.setClipMask = function(clip,mask) {
	var clip1 = clip;
	var maskContainer = mask;
	if(maskContainer != clip1.scrollRect) {
		clip1.scrollRectListener = null;
		var scrollRect = clip1.scrollRect;
		if(scrollRect != null) {
			var x = clip1.x + scrollRect.x;
			if(clip1.scrollRect != null) {
				x -= clip1.scrollRect.x;
			}
			if(!clip1.destroyed && clip1.x != x) {
				var from = DisplayObjectHelper.DebugUpdate ? "setClipX " + clip1.x + " : " + x : null;
				clip1.x = x;
				DisplayObjectHelper.invalidateTransform(clip1,from);
			}
			var y = clip1.y + scrollRect.y;
			if(clip1.scrollRect != null) {
				y -= clip1.scrollRect.y;
			}
			if(!clip1.destroyed && clip1.y != y) {
				var from = DisplayObjectHelper.DebugUpdate ? "setClipY " + clip1.y + " : " + y : null;
				clip1.y = y;
				DisplayObjectHelper.invalidateTransform(clip1,from);
			}
			clip1.removeChild(scrollRect);
			if(clip1.mask == scrollRect) {
				clip1.mask = null;
			}
			clip1.scrollRect = null;
			clip1.mask = null;
			clip1.maskContainer = null;
			DisplayObjectHelper.invalidateTransform(clip1,"removeScrollRect");
		}
	}
	if(clip1.mask != null) {
		clip1.mask.child = null;
		clip1.mask = null;
	}
	if(RenderSupport.RendererType == "webgl") {
		clip1.mask = DisplayObjectHelper.getFirstGraphics(maskContainer);
	} else {
		clip1.alphaMask = null;
		var obj = DisplayObjectHelper.getLastGraphicsOrSprite(maskContainer);
		if(HaxeRuntime.instanceof(obj,FlowGraphics)) {
			clip1.mask = obj;
		} else if(HaxeRuntime.instanceof(obj,FlowSprite)) {
			clip1.alphaMask = obj;
		}
	}
	if(clip1.mask != null) {
		maskContainer.child = clip1;
		clip1.mask.child = clip1;
		clip1.maskContainer = maskContainer;
		if((RenderSupport.RendererType == "html" || clip1.isHTML) && !clip1.isCanvas && (Platform.isIE || Platform.isEdge) && clip1.mask.isSvg) {
			DisplayObjectHelper.updateHasMask(clip1);
		}
		clip1.mask.once("removed",function() {
			clip1.mask = null;
		});
	} else if(clip1.alphaMask != null) {
		maskContainer.child = clip1;
		maskContainer.url = clip1.alphaMask.url;
		clip1.alphaMask.child = clip1;
		clip1.maskContainer = maskContainer;
		DisplayObjectHelper.updateHasMask(clip1);
		clip1.alphaMask.once("removed",function() {
			clip1.alphaMask = null;
		});
	}
	DisplayObjectHelper.updateIsMask(maskContainer);
	if(maskContainer.renderable != false) {
		maskContainer.renderable = false;
		DisplayObjectHelper.invalidateVisible(maskContainer);
		if(!maskContainer.keepNativeWidget) {
			DisplayObjectHelper.invalidateTransform(maskContainer,"setClipRenderable");
		}
	}
	maskContainer.once("childrenchanged",function() {
		var clip = clip1;
		var maskContainer1 = maskContainer;
		if(maskContainer1 != clip.scrollRect) {
			clip.scrollRectListener = null;
			var scrollRect = clip.scrollRect;
			if(scrollRect != null) {
				var x = clip.x + scrollRect.x;
				if(clip.scrollRect != null) {
					x -= clip.scrollRect.x;
				}
				if(!clip.destroyed && clip.x != x) {
					var from = DisplayObjectHelper.DebugUpdate ? "setClipX " + clip.x + " : " + x : null;
					clip.x = x;
					DisplayObjectHelper.invalidateTransform(clip,from);
				}
				var y = clip.y + scrollRect.y;
				if(clip.scrollRect != null) {
					y -= clip.scrollRect.y;
				}
				if(!clip.destroyed && clip.y != y) {
					var from = DisplayObjectHelper.DebugUpdate ? "setClipY " + clip.y + " : " + y : null;
					clip.y = y;
					DisplayObjectHelper.invalidateTransform(clip,from);
				}
				clip.removeChild(scrollRect);
				if(clip.mask == scrollRect) {
					clip.mask = null;
				}
				clip.scrollRect = null;
				clip.mask = null;
				clip.maskContainer = null;
				DisplayObjectHelper.invalidateTransform(clip,"removeScrollRect");
			}
		}
		if(clip.mask != null) {
			clip.mask.child = null;
			clip.mask = null;
		}
		if(RenderSupport.RendererType == "webgl") {
			clip.mask = DisplayObjectHelper.getFirstGraphics(maskContainer1);
		} else {
			clip.alphaMask = null;
			var obj = DisplayObjectHelper.getLastGraphicsOrSprite(maskContainer1);
			if(HaxeRuntime.instanceof(obj,FlowGraphics)) {
				clip.mask = obj;
			} else if(HaxeRuntime.instanceof(obj,FlowSprite)) {
				clip.alphaMask = obj;
			}
		}
		if(clip.mask != null) {
			maskContainer1.child = clip;
			clip.mask.child = clip;
			clip.maskContainer = maskContainer1;
			if((RenderSupport.RendererType == "html" || clip.isHTML) && !clip.isCanvas && (Platform.isIE || Platform.isEdge) && clip.mask.isSvg) {
				DisplayObjectHelper.updateHasMask(clip);
			}
			clip.mask.once("removed",function() {
				clip.mask = null;
			});
		} else if(clip.alphaMask != null) {
			maskContainer1.child = clip;
			maskContainer1.url = clip.alphaMask.url;
			clip.alphaMask.child = clip;
			clip.maskContainer = maskContainer1;
			DisplayObjectHelper.updateHasMask(clip);
			clip.alphaMask.once("removed",function() {
				clip.alphaMask = null;
			});
		}
		DisplayObjectHelper.updateIsMask(maskContainer1);
		if(maskContainer1.renderable != false) {
			maskContainer1.renderable = false;
			DisplayObjectHelper.invalidateVisible(maskContainer1);
			if(!maskContainer1.keepNativeWidget) {
				DisplayObjectHelper.invalidateTransform(maskContainer1,"setClipRenderable");
			}
		}
		maskContainer1.once("childrenchanged",function() {
			DisplayObjectHelper.setClipMask(clip,maskContainer1,null);
		});
		if((RenderSupport.RendererType == "html" || clip.isHTML) && !clip.isCanvas) {
			if(clip.mask != null || clip.alphaMask != null) {
				DisplayObjectHelper.initNativeWidget(clip);
			}
		}
		DisplayObjectHelper.invalidateTransform(clip,"setClipMask");
	});
	if((RenderSupport.RendererType == "html" || clip1.isHTML) && !clip1.isCanvas) {
		if(clip1.mask != null || clip1.alphaMask != null) {
			DisplayObjectHelper.initNativeWidget(clip1);
		}
	}
	DisplayObjectHelper.invalidateTransform(clip1,"setClipMask");
};
RenderSupport.setClipViewBounds = function(clip,minX,minY,maxX,maxY) {
	var bounds = new PIXI.Bounds();
	bounds.minX = minX;
	bounds.minY = minY;
	bounds.maxX = maxX;
	bounds.maxY = maxY;
	clip.setViewBounds(bounds);
};
RenderSupport.setClipWidth = function(clip,width) {
	clip.setWidth(width);
};
RenderSupport.setClipHeight = function(clip,height) {
	clip.setHeight(height);
};
RenderSupport.getClipWidth = function(clip) {
	if(clip.getWidth != null) {
		return clip.getWidth();
	} else {
		var widgetBounds = clip.widgetBounds;
		var widgetWidth;
		var widgetWidth1;
		if(widgetBounds != null) {
			var f = widgetBounds.minX;
			widgetWidth1 = isFinite(f);
		} else {
			widgetWidth1 = false;
		}
		if(widgetWidth1) {
			var f = widgetBounds.minX;
			widgetWidth = isFinite(f) ? widgetBounds.maxX - widgetBounds.minX : -1;
		} else {
			widgetWidth = clip.isFlowContainer && clip.mask == null ? clip.localBounds.maxX : clip.getWidth != null ? clip.getWidth() : clip.getLocalBounds().width;
		}
		return widgetWidth;
	}
};
RenderSupport.getClipHeight = function(clip) {
	if(clip.getHeight != null) {
		return clip.getHeight();
	} else {
		var widgetBounds = clip.widgetBounds;
		var tmp;
		if(widgetBounds != null) {
			var f = widgetBounds.minY;
			tmp = isFinite(f);
		} else {
			tmp = false;
		}
		if(tmp) {
			var f = widgetBounds.minY;
			if(isFinite(f)) {
				return widgetBounds.maxY - widgetBounds.minY;
			} else {
				return -1;
			}
		} else if(clip.isFlowContainer && clip.mask == null) {
			return clip.localBounds.maxY;
		} else {
			return DisplayObjectHelper.getHeight(clip);
		}
	}
};
RenderSupport.setClipResolution = function(clip,resolution) {
	clip.setResolution(resolution);
};
RenderSupport.startProfile = function(name) {
	$global.console.profile(name);
};
RenderSupport.endProfile = function() {
	$global.console.profileEnd();
};
RenderSupport.getStage = function() {
	return RenderSupport.PixiStage;
};
RenderSupport.getStageId = function(clip) {
	return clip.id;
};
RenderSupport.isStage = function(clip) {
	return RenderSupport.FlowInstances.some(function(value) {
		return value.stage == clip;
	});
};
RenderSupport.modifierStatePresent = function(e,m) {
	if(e.getModifierState != null) {
		return e.getModifierState(m) != null;
	} else {
		return false;
	}
};
RenderSupport.parseKeyEvent = function(e) {
	var shift = false;
	var alt = false;
	var ctrl = false;
	var meta = false;
	var charCode = -1;
	var s = "";
	if(RenderSupport.modifierStatePresent(e,"Shift")) {
		shift = e.getModifierState("Shift");
	} else if(e.shiftKey != null) {
		shift = e.shiftKey;
	}
	if(RenderSupport.modifierStatePresent(e,"Alt")) {
		alt = e.getModifierState("Alt");
	} else if(e.altKey != null) {
		alt = e.altKey;
	} else if(RenderSupport.modifierStatePresent(e,"AltGraph")) {
		alt = e.getModifierState("AltGraph");
	}
	if(RenderSupport.modifierStatePresent(e,"Control")) {
		ctrl = e.getModifierState("Control");
	} else if(e.ctrlKey != null) {
		ctrl = e.ctrlKey;
	}
	if(RenderSupport.modifierStatePresent(e,"Meta")) {
		meta = e.getModifierState("Meta");
	} else if(RenderSupport.modifierStatePresent(e,"OS")) {
		meta = e.getModifierState("OS");
	} else if(e.metaKey != null) {
		meta = e.metaKey;
	}
	if(Platform.isMacintosh) {
		var buf = meta;
		meta = ctrl;
		ctrl = buf;
	}
	if(e.charCode != null && e.charCode > 0) {
		charCode = e.charCode;
	} else if(e.which != null) {
		charCode = e.which;
	} else if(e.keyCode != null) {
		charCode = e.keyCode;
	}
	if(e.key != null && (Std.string(e.key).length == 1 || e.key == "Meta")) {
		s = e.key == "Meta" ? Platform.isMacintosh ? "ctrl" : "meta" : e.key;
	} else if(e.code != null && (Std.string(e.code).length == 1 || e.key == "MetaLeft" || e.key == "MetaRight")) {
		s = e.code == "MetaLeft" || e.code == "MetaRight" ? Platform.isMacintosh ? "ctrl" : "meta" : e.code;
	} else if(charCode >= 96 && charCode <= 105) {
		s = Std.string(charCode - 96);
	} else if(charCode >= 112 && charCode <= 123) {
		s = "F" + (charCode - 111);
	} else {
		switch(charCode) {
		case 8:
			s = "backspace";
			break;
		case 9:
			RenderSupport.switchFocusFramesShow(RenderSupport.EnableFocusFrame);
			s = "tab";
			break;
		case 12:
			s = "clear";
			break;
		case 13:
			s = "enter";
			break;
		case 16:
			s = "shift";
			break;
		case 17:
			s = Platform.isMacintosh ? "meta" : "ctrl";
			break;
		case 18:
			s = "alt";
			break;
		case 19:
			s = "pause/break";
			break;
		case 20:
			s = "capslock";
			break;
		case 27:
			s = "esc";
			break;
		case 33:
			s = "pageup";
			break;
		case 34:
			s = "pagedown";
			break;
		case 35:
			s = "end";
			break;
		case 36:
			s = "home";
			break;
		case 37:
			s = "left";
			break;
		case 38:
			s = "up";
			break;
		case 39:
			s = "right";
			break;
		case 40:
			s = "down";
			break;
		case 45:
			s = "insert";
			break;
		case 46:
			s = "delete";
			break;
		case 48:
			s = shift ? ")" : "0";
			break;
		case 49:
			s = shift ? "!" : "1";
			break;
		case 50:
			s = shift ? "@" : "2";
			break;
		case 51:
			s = shift ? "#" : "3";
			break;
		case 52:
			s = shift ? "$" : "4";
			break;
		case 53:
			s = shift ? "%" : "5";
			break;
		case 54:
			s = shift ? "^" : "6";
			break;
		case 55:
			s = shift ? "&" : "7";
			break;
		case 56:
			s = shift ? "*" : "8";
			break;
		case 57:
			s = shift ? "(" : "9";
			break;
		case 91:
			s = Platform.isMacintosh ? "ctrl" : "meta";
			break;
		case 92:
			s = "meta";
			break;
		case 93:
			s = Platform.isMacintosh ? "ctrl" : "context";
			break;
		case 106:
			s = "*";
			break;
		case 107:
			s = "+";
			break;
		case 109:
			s = "-";
			break;
		case 110:
			s = ".";
			break;
		case 111:
			s = "/";
			break;
		case 144:
			s = "numlock";
			break;
		case 145:
			s = "scrolllock";
			break;
		case 186:
			s = shift ? ":" : ";";
			break;
		case 187:
			s = shift ? "+" : "=";
			break;
		case 188:
			s = shift ? "<" : ",";
			break;
		case 189:
			s = shift ? "_" : "-";
			break;
		case 190:
			s = shift ? ">" : ".";
			break;
		case 191:
			s = shift ? "?" : "/";
			break;
		case 192:
			s = shift ? "~" : "`";
			break;
		case 219:
			s = shift ? "{" : "[";
			break;
		case 220:
			s = shift ? "|" : "\\";
			break;
		case 221:
			s = shift ? "}" : "]";
			break;
		case 222:
			s = shift ? "\"" : "'";
			break;
		case 226:
			s = shift ? "|" : "\\";
			break;
		default:
			var keyUTF = charCode >= 0 ? String.fromCodePoint(charCode) : "";
			s = RenderSupport.modifierStatePresent(e,"CapsLock") ? e.getModifierState("CapsLock") ? keyUTF.toUpperCase() : keyUTF.toLowerCase() : keyUTF;
		}
	}
	return { key : s, ctrl : ctrl, shift : shift, alt : alt, meta : meta, keyCode : e.keyCode, preventDefault : e.preventDefault.bind(e)};
};
RenderSupport.addKeyEventListener = function(clip,event,fn) {
	var keycb = function(ke) {
		if(event == "keydown") {
			RenderSupport.keysPending.h[ke.keyCode] = ke;
		} else {
			RenderSupport.keysPending.remove(ke.keyCode);
		}
		fn(ke.key,ke.ctrl,ke.shift,ke.alt,ke.meta,ke.keyCode,ke.preventDefault);
	};
	RenderSupport.on(event,keycb);
	return function() {
		RenderSupport.off(event,keycb);
	};
};
RenderSupport.addStreamStatusListener = function(clip,fn) {
	return clip.addStreamStatusListener(fn);
};
RenderSupport.addVideoSource = function(clip,src,type,headers) {
	clip.addVideoSource(src,type,headers);
};
RenderSupport.setVideoExternalSubtitle = function(clip,src,kind) {
	return clip.setVideoExternalSubtitle(src,kind);
};
RenderSupport.addEventListener = function(clip,event,fn) {
	if(event == "userstylechanged" || event == "beforeprint" || event == "afterprint") {
		RenderSupport.on(event,fn);
		return function() {
			RenderSupport.off(event,fn);
		};
	} else if(HaxeRuntime.instanceof(clip,HTMLElement)) {
		clip.addEventListener(event,fn);
		return function() {
			if(clip != null) {
				clip.removeEventListener(event,fn);
			}
		};
	} else {
		return RenderSupport.addDisplayObjectEventListener(clip,event,fn);
	}
};
RenderSupport.addDisplayObjectEventListener = function(clip,event,fn) {
	if(event == "transformchanged") {
		clip.on("transformchanged",fn);
		return function() {
			clip.off("transformchanged",fn);
		};
	} else if(event == "resize") {
		RenderSupport.on("resize",fn);
		return function() {
			RenderSupport.off("resize",fn);
		};
	} else if(event == "mousedown" || event == "mousemove" || event == "mouseup" || event == "mousemiddledown" || event == "mousemiddleup" || event == "touchstart" || event == "touchmove" || event == "touchend") {
		RenderSupport.on(event,fn);
		return function() {
			RenderSupport.off(event,fn);
		};
	} else if(event == "mouserightdown" || event == "mouserightup") {
		RenderSupport.PixiView.oncontextmenu = function(e) {
			e.preventDefault();
			e.stopPropagation();
			return false;
		};
		RenderSupport.on(event,fn);
		return function() {
			RenderSupport.off(event,fn);
		};
	} else if(event == "rollover") {
		var checkFn = function() {
			if(!clip.pointerOver) {
				clip.pointerOver = true;
				if(Platform.isSafari && RenderSupport.pointerOverClips.indexOf(clip) < 0) {
					var clipsToRemove = [];
					var _g = 0;
					var _g1 = RenderSupport.pointerOverClips;
					while(_g < _g1.length) {
						var pointerOverClip = _g1[_g];
						++_g;
						if(pointerOverClip.pointerOver && !pointerOverClip.destroyed) {
							if(!DisplayObjectHelper.isParentOf(pointerOverClip,clip) && !DisplayObjectHelper.isParentOf(clip,pointerOverClip)) {
								pointerOverClip.emit("pointerout");
								clipsToRemove.push(pointerOverClip);
							}
						} else {
							clipsToRemove.push(pointerOverClip);
						}
					}
					var _g = 0;
					while(_g < clipsToRemove.length) {
						var pointerOverClip = clipsToRemove[_g];
						++_g;
						HxOverrides.remove(RenderSupport.pointerOverClips,pointerOverClip);
					}
					RenderSupport.pointerOverClips.push(clip);
				}
				fn();
			}
		};
		clip.on("pointerover",checkFn);
		DisplayObjectHelper.invalidateInteractive(clip);
		return function() {
			clip.off("pointerover",checkFn);
			DisplayObjectHelper.invalidateInteractive(clip);
		};
	} else if(event == "rollout") {
		var checkFn1 = function() {
			if(clip.pointerOver) {
				clip.pointerOver = false;
				if(Platform.isSafari && RenderSupport.pointerOverClips.indexOf(clip) < 0) {
					HxOverrides.remove(RenderSupport.pointerOverClips,clip);
				}
				fn();
			}
		};
		clip.on("pointerout",checkFn1);
		DisplayObjectHelper.invalidateInteractive(clip);
		return function() {
			clip.off("pointerout",checkFn1);
			DisplayObjectHelper.invalidateInteractive(clip);
		};
	} else if(event == "scroll") {
		clip.on("scroll",fn);
		return function() {
			clip.off("scroll",fn);
		};
	} else if(event == "change") {
		clip.on("input",fn);
		return function() {
			clip.off("input",fn);
		};
	} else if(event == "focusin") {
		clip.on("focus",fn);
		return function() {
			clip.off("focus",fn);
		};
	} else if(event == "focusout") {
		clip.on("blur",fn);
		return function() {
			clip.off("blur",fn);
		};
	} else if(event == "visible" || event == "added" || event == "removed" || event == "textwidthchanged" || event == "selectionchange" || event == "selectall" || event == "compositionend") {
		clip.on(event,fn);
		return function() {
			clip.off(event,fn);
		};
	} else {
		Errors.report("Unknown event: " + event);
		return function() {
		};
	}
};
RenderSupport.addFileDropListener = function(clip,maxFilesCount,mimeTypeRegExpFilter,onDone) {
	if(Platform.isMobile) {
		return function() {
		};
	} else if(RenderSupport.RendererType != "html" || !((RenderSupport.RendererType == "html" || clip.isHTML) && !clip.isCanvas)) {
		var dropArea = new DropAreaClip(maxFilesCount,mimeTypeRegExpFilter,onDone);
		clip.addChild(dropArea);
		return function() {
			clip.removeChild(dropArea);
		};
	} else {
		return DisplayObjectHelper.addFileDropListener(clip,maxFilesCount,mimeTypeRegExpFilter,onDone);
	}
};
RenderSupport.addVirtualKeyboardHeightListener = function(fn) {
	return function() {
	};
};
RenderSupport.addExtendedEventListener = function(clip,event,fn) {
	if(event == "childfocused") {
		var parentFn = function(child) {
			var bounds = child.getBounds(true);
			var localPosition = clip.toLocal(new PIXI.Point(bounds.x,bounds.y));
			fn([localPosition.x,localPosition.y,bounds.width,bounds.height]);
		};
		clip.on(event,parentFn);
		return function() {
			clip.off(event,parentFn);
		};
	}
	if(event == "textwidthchanged") {
		var widthFn = function(width) {
			fn([width]);
		};
		clip.on(event,widthFn);
		return function() {
			clip.off(event,widthFn);
		};
	} else {
		Errors.report("Unknown event: " + event);
		return function() {
		};
	}
};
RenderSupport.addDrawFrameEventListener = function(fn) {
	RenderSupport.on("drawframe",fn);
	return function() {
		RenderSupport.off("drawframe",fn);
	};
};
RenderSupport.addMouseWheelEventListener = function(clip,fn) {
	var cb = function(p) {
		fn(p.x,p.y);
	};
	RenderSupport.on("mousewheel",cb);
	return function() {
		RenderSupport.off("mousewheel",cb);
	};
};
RenderSupport.addFinegrainMouseWheelEventListener = function(clip,f) {
	return RenderSupport.addMouseWheelEventListener(clip,f);
};
RenderSupport.getMouseX = function(clip) {
	var viewportScale = RenderSupport.getViewportScale();
	if(clip == null || clip == RenderSupport.PixiStage) {
		return RenderSupport.MousePos.x * viewportScale;
	} else {
		return clip.toLocal(RenderSupport.MousePos, null, null, true).x * viewportScale;
	}
};
RenderSupport.getMouseY = function(clip) {
	var viewportScale = RenderSupport.getViewportScale();
	if(clip == null || clip == RenderSupport.PixiStage) {
		return RenderSupport.MousePos.y * viewportScale;
	} else {
		return clip.toLocal(RenderSupport.MousePos, null, null, true).y * viewportScale;
	}
};
RenderSupport.getTouchPoints = function(clip) {
	var touches = [];
	var _g = 0;
	var _g1 = RenderSupport.TouchPoints.length;
	while(_g < _g1) {
		var i = _g++;
		touches.push([RenderSupport.TouchPoints[i].pageX,RenderSupport.TouchPoints[i].pageY]);
	}
	if(clip != null && clip != RenderSupport.PixiStage) {
		var _g = [];
		var _g_current = 0;
		var _g_array = touches;
		while(_g_current < _g_array.length) {
			var x = _g_array[_g_current++];
			var t = x;
			t = clip.toLocal(new PIXI.Point(t[0], t[1]), null, null, true);
			_g.push([t.x,t.y]);
		}
		return Lambda.array(_g);
	} else {
		return touches;
	}
};
RenderSupport.setMouseX = function(x) {
	var tmp = RenderSupport.getViewportScale();
	RenderSupport.MousePos.x = x / tmp;
};
RenderSupport.setMouseY = function(y) {
	var tmp = RenderSupport.getViewportScale();
	RenderSupport.MousePos.y = y / tmp;
};
RenderSupport.setMousePosition = function(pos) {
	RenderSupport.MousePos = pos;
};
RenderSupport.isMousePositionEqual = function(pos) {
	if(RenderSupport.MousePos.x == pos.x) {
		return RenderSupport.MousePos.y == pos.y;
	} else {
		return false;
	}
};
RenderSupport.hittest = function(clip,x,y) {
	if(!clip.visible || clip.parent == null) {
		return false;
	}
	DisplayObjectHelper.invalidateLocalBounds(clip);
	var point = new PIXI.Point(x,y);
	if(clip.skipHittestMask || RenderSupport.hittestMask(clip.parent,point)) {
		return RenderSupport.doHitTest(clip,point);
	} else {
		return false;
	}
};
RenderSupport.hittestMask = function(clip,point) {
	if(clip.viewBounds != null) {
		if(clip.worldTransformChanged) {
			clip.transform.updateTransform(clip.parent.transform);
		}
		var local = clip.toLocal(point, null, null, true);
		var viewBounds = clip.viewBounds;
		if(viewBounds.minX <= local.x && viewBounds.minY <= local.y && viewBounds.maxX >= local.x) {
			return viewBounds.maxY >= local.y;
		} else {
			return false;
		}
	} else if(clip.scrollRect != null && !RenderSupport.hittestGraphics(clip.scrollRect,point)) {
		return false;
	} else if(clip.mask != null && !RenderSupport.hittestGraphics(clip.mask,point)) {
		return false;
	} else if(clip.parent != null) {
		return RenderSupport.hittestMask(clip.parent,point);
	} else {
		return true;
	}
};
RenderSupport.hittestGraphics = function(clip,point,checkAlpha) {
	var graphicsData = clip.graphicsData;
	if(graphicsData == null || graphicsData.length == 0) {
		return false;
	}
	var data = graphicsData[0];
	if(data.fill && data.shape != null && (checkAlpha == null || data.fillAlpha > checkAlpha)) {
		if(clip.worldTransformChanged) {
			clip.transform.updateTransform(clip.parent.transform);
		}
		var local = clip.toLocal(point, null, null, true);
		return data.shape.contains(local.x,local.y);
	} else {
		return false;
	}
};
RenderSupport.doHitTest = function(clip,point) {
	return RenderSupport.getClipAt(clip,point,false) != null;
};
RenderSupport.getClipAt = function(clip,point,checkMask,checkAlpha,checkVisible) {
	if(checkVisible == null) {
		checkVisible = true;
	}
	if(checkMask == null) {
		checkMask = true;
	}
	if((!clip.visible || clip.isMask) && checkVisible) {
		return null;
	} else if(checkMask && !RenderSupport.hittestMask(clip,point)) {
		return null;
	} else if(clip.mask != null && !RenderSupport.hittestGraphics(clip.mask,point)) {
		return null;
	}
	if(HaxeRuntime.instanceof(clip,NativeWidgetClip) || HaxeRuntime.instanceof(clip,FlowSprite)) {
		if(clip.worldTransformChanged) {
			clip.transform.updateTransform(clip.parent.transform);
		}
		var local = clip.toLocal(point, null, null, true);
		var clipWidth = clip.getWidth != null ? clip.getWidth() : clip.getLocalBounds().width;
		var clipHeight = DisplayObjectHelper.getHeight(clip);
		if(checkAlpha != null && HaxeRuntime.instanceof(clip,FlowSprite)) {
			try {
				var tempCanvas = window.document.createElement("canvas");
				tempCanvas.width = clipWidth;
				tempCanvas.height = clipHeight;
				var ctx = tempCanvas.getContext("2d");
				ctx.drawImage(clip.nativeWidget,0,0,clipWidth,clipHeight);
				var pixel = ctx.getImageData(local.x,local.y,1,1);
				if(pixel.data[3] * clip.worldAlpha / 255 < checkAlpha) {
					return null;
				}
			} catch( _g ) {
				haxe_NativeStackTrace.lastError = _g;
			}
		}
		if(local.x >= 0.0 && local.y >= 0.0 && local.x <= clipWidth && local.y <= clipHeight) {
			return clip;
		}
	} else if(HaxeRuntime.instanceof(clip,FlowContainer)) {
		if(clip.worldTransformChanged) {
			clip.transform.updateTransform(clip.parent.transform);
		}
		var local = clip.toLocal(point, null, null, true);
		var localBounds = clip.localBounds;
		if(local.x < localBounds.minX && local.y < localBounds.minY && local.x >= localBounds.maxX && local.y >= localBounds.maxY) {
			return null;
		}
		var children = clip.children;
		var i = children.length - 1;
		while(i >= 0) {
			var child = children[i];
			--i;
			var clipHit = RenderSupport.getClipAt(child,point,false,checkAlpha);
			if(clipHit != null) {
				return clipHit;
			}
		}
	} else if(HaxeRuntime.instanceof(clip,FlowGraphics)) {
		if(RenderSupport.hittestGraphics(clip,point,checkAlpha)) {
			return clip;
		}
	}
	return null;
};
RenderSupport.countClips = function(parent) {
	if(parent == null) {
		parent = RenderSupport.PixiStage;
	}
	return DisplayObjectHelper.countClips(parent);
};
RenderSupport.makeGraphics = function() {
	return new FlowGraphics();
};
RenderSupport.getGraphics = function(parent) {
	var clip = new FlowGraphics();
	RenderSupport.addChild(parent,clip);
	return clip;
};
RenderSupport.clearGraphics = function(graphics) {
	graphics.clear();
};
RenderSupport.useSvg = function(graphics) {
	graphics.useSvg();
};
RenderSupport.setLineStyle = function(graphics,width,color,opacity) {
	graphics.lineStyle(width,color & 16777215,opacity);
};
RenderSupport.beginFill = function(graphics,color,opacity) {
	graphics.beginFill(color & 16777215,opacity);
};
RenderSupport.beginGradientFill = function(graphics,colors,alphas,offsets,matrix,type) {
	graphics.beginGradientFill(colors,alphas,offsets,matrix,type);
};
RenderSupport.setLineGradientStroke = function(graphics,colours,alphas,offsets,matrix) {
	graphics.lineGradientStroke(colours,alphas,offsets,matrix);
};
RenderSupport.makeMatrix = function(width,height,rotation,xOffset,yOffset) {
	return { width : width, height : height, rotation : rotation, xOffset : xOffset, yOffset : yOffset};
};
RenderSupport.moveTo = function(graphics,x,y) {
	graphics.moveTo(x,y);
};
RenderSupport.lineTo = function(graphics,x,y) {
	graphics.lineTo(x,y);
};
RenderSupport.curveTo = function(graphics,cx,cy,x,y) {
	graphics.quadraticCurveTo(cx,cy,x,y);
};
RenderSupport.makeCSSColor = function(color,alpha) {
	return "rgba(" + (color >> 16 & 255) + "," + (color >> 8 & 255) + "," + (color & 255) + "," + alpha + ")";
};
RenderSupport.endFill = function(graphics) {
	graphics.endFill();
};
RenderSupport.drawRect = function(graphics,x,y,width,height) {
	graphics.drawRect(x,y,width,height);
};
RenderSupport.drawRoundedRect = function(graphics,x,y,width,height,radius) {
	graphics.drawRoundedRect(x,y,width,height,radius);
};
RenderSupport.drawEllipse = function(graphics,x,y,width,height) {
	graphics.drawEllipse(x,y,width,height);
};
RenderSupport.drawCircle = function(graphics,x,y,radius) {
	graphics.drawCircle(x,y,radius);
};
RenderSupport.makePicture = function(url,cache,metricsFn,errorFn,onlyDownload,altText,headers) {
	return new FlowSprite(url,cache,metricsFn,errorFn,onlyDownload,altText,headers);
};
RenderSupport.setPictureUseCrossOrigin = function(picture,useCrossOrigin) {
	picture.switchUseCrossOrigin(useCrossOrigin);
};
RenderSupport.setPictureReferrerPolicy = function(picture,referrerpolicy) {
	picture.setPictureReferrerPolicy(referrerpolicy);
};
RenderSupport.parseXml = function(xmlString) {
	var doc;
	if(window.ActiveXObject) {
		doc = new ActiveXObject("MSXML.DOMDocument");
		doc.async = false;
		doc.loadXML(xmlString);
	} else {
		var parser = new DOMParser();
		doc = parser.parseFromString(xmlString,"text/xml");
	}
	return doc;
};
RenderSupport.checkIsValidSvg = function(url,cb) {
	var svgXhr = new XMLHttpRequest();
	if(!Platform.isIE && !Platform.isEdge) {
		svgXhr.overrideMimeType("image/svg+xml");
	}
	svgXhr.onload = function() {
		try {
			var doc = RenderSupport.parseXml(svgXhr.response);
			var viewBox = doc.documentElement.getAttribute("viewBox");
			cb(viewBox != null);
		} catch( _g ) {
			haxe_NativeStackTrace.lastError = _g;
			cb(false);
		}
	};
	svgXhr.open("GET",url,true);
	svgXhr.send();
};
RenderSupport.cursor2css = function(cursor) {
	switch(cursor) {
	case "all-scroll":
		return "all-scroll";
	case "arrow":
		return "default";
	case "auto":
		return "auto";
	case "col-resize":
		return "col-resize";
	case "context-menu":
		return "context-menu";
	case "copy":
		return "copy";
	case "crosshair":
		return "crosshair";
	case "e-resize":
		return "e-resize";
	case "ew-resize":
		return "ew-resize";
	case "finger":
		return "pointer";
	case "grab":
		return "grab";
	case "grabbing":
		return "grabbing";
	case "help":
		return "help";
	case "move":
		return "move";
	case "n-resize":
		return "n-resize";
	case "ne-resize":
		return "ne-resize";
	case "nesw-resize":
		return "nesw-resize";
	case "not-allowed":
		return "not-allowed";
	case "ns-resize":
		return "ns-resize";
	case "nw-resize":
		return "nw-resize";
	case "nwse-resize":
		return "nwse-resize";
	case "progress":
		return "progress";
	case "row-resize":
		return "row-resize";
	case "s-resize":
		return "s-resize";
	case "sw-resize":
		return "sw-resize";
	case "text":
		return "text";
	case "w-resize":
		return "w-resize";
	case "wait":
		return "wait";
	case "zoom-in":
		return "zoom-in";
	case "zoom-out":
		return "zoom-out";
	default:
		return "inherit";
	}
};
RenderSupport.setCursor = function(cursor) {
	RenderSupport.PixiView.style.cursor = RenderSupport.cursor2css(cursor);
};
RenderSupport.getCursor = function() {
	switch(RenderSupport.PixiView.style.cursor) {
	case "auto":
		return "auto";
	case "default":
		return "arrow";
	case "move":
		return "move";
	case "pointer":
		return "finger";
	case "text":
		return "text";
	default:
		return "default";
	}
};
RenderSupport.addFilters = function(clip,filters) {
	if(!RenderSupport.FiltersEnabled) {
		return;
	}
	if((RenderSupport.RendererType == "html" || clip.isHTML) && !clip.isCanvas) {
		clip.filterPadding = 0.0;
		var filterCount = 0;
		var _e = clip;
		var tmp = function(from,force) {
			DisplayObjectHelper.invalidateTransform(_e,from,force);
		};
		clip.off("childrenchanged",tmp);
		var _g = [];
		var _g1 = 0;
		var _g2 = filters;
		while(_g1 < _g2.length) {
			var v = _g2[_g1];
			++_g1;
			if((function(f) {
				if(f == null) {
					return false;
				} else if(f.padding != null) {
					clip.filterPadding = Math.max(f.padding,clip.filterPadding);
					filterCount += 1;
				}
				return true;
			})(v)) {
				_g.push(v);
			}
		}
		clip.filters = _g;
		clip.filterPadding *= filterCount;
		if(clip.updateNativeWidgetGraphicsData != null) {
			clip.updateNativeWidgetGraphicsData();
		}
		if(clip.filters.length > 0) {
			DisplayObjectHelper.updateEmitChildrenChanged(clip);
			var _e1 = clip;
			var tmp = function(from,force) {
				DisplayObjectHelper.invalidateTransform(_e1,from,force);
			};
			clip.on("childrenchanged",tmp);
		}
		DisplayObjectHelper.initNativeWidget(clip);
		var children = clip.children;
		if(children != null) {
			var _g = 0;
			while(_g < children.length) {
				var child = children[_g];
				++_g;
				DisplayObjectHelper.invalidateTransform(child,"addFilters -> child");
			}
		}
		var _this = clip.filters;
		var result = new Array(_this.length);
		var _g = 0;
		var _g1 = _this.length;
		while(_g < _g1) {
			var i = _g++;
			var f = _this[i];
			var tmp;
			if(HaxeRuntime.instanceof(f,PIXI.filters.DropShadowFilter)) {
				var newFilter = Reflect.copy(f);
				newFilter.__proto__ = f.__proto__;
				newFilter.blur = f.blur * 0.5;
				tmp = newFilter;
			} else {
				tmp = f;
			}
			result[i] = tmp;
		}
		clip.canvasFilters = result;
		DisplayObjectHelper.invalidateTransform(clip,"addFilters");
	} else {
		clip.filterPadding = 0.0;
		clip.glShaders = false;
		var filterCount1 = 0;
		var _g = [];
		var _g1 = 0;
		var _g2 = filters;
		while(_g1 < _g2.length) {
			var v = _g2[_g1];
			++_g1;
			var f = [v];
			var filters1;
			if(f[0] == null) {
				filters1 = false;
			} else {
				if(f[0].padding != null) {
					clip.filterPadding = Math.max(f[0].padding,clip.filterPadding);
					++filterCount1;
				}
				if(f[0].uniforms != null && (f[0].uniforms.time != null || f[0].uniforms.seed != null || f[0].uniforms.bounds != null)) {
					var fn = [(function(f) {
						return function() {
							if(f[0].uniforms.time != null) {
								f[0].uniforms.time = f[0].uniforms.time == null ? 0.0 : f[0].uniforms.time + 0.01;
							}
							if(f[0].uniforms.seed != null) {
								f[0].uniforms.seed = Math.random();
							}
							if(f[0].uniforms.bounds != null) {
								var bounds = clip.getBounds(true);
								f[0].uniforms.bounds = [bounds.x,bounds.y,bounds.width,bounds.height];
							}
							DisplayObjectHelper.invalidateStage(clip);
						};
					})(f)];
					DisplayObjectHelper.onAdded(clip,(function(fn) {
						return function() {
							RenderSupport.PixiStage.on("drawframe",fn[0]);
							return (function(fn) {
								return function() {
									RenderSupport.PixiStage.off("drawframe",fn[0]);
								};
							})(fn);
						};
					})(fn));
				}
				if(!HaxeRuntime.instanceof(f[0],PIXI.filters.DropShadowFilter) && !HaxeRuntime.instanceof(f[0],PIXI.filters.BlurFilter)) {
					clip.glShaders = true;
					if(RenderSupport.PixiRenderer.gl == null) {
						try {
							RenderSupport.PixiRenderer.gl = new PIXI.WebGLRenderer(0,0,{ transparent : true, autoResize : false, antialias : RenderSupport.Antialias, roundPixels : RenderSupport.RoundPixels});
						} catch( _g3 ) {
							haxe_NativeStackTrace.lastError = _g3;
						}
					}
				}
				filters1 = true;
			}
			if(filters1) {
				_g.push(v);
			}
		}
		filters = _g;
		clip.filterPadding *= filterCount1;
		clip.filters = filters.length > 0 ? filters : null;
		if(RenderSupport.RendererType == "canvas") {
			clip.canvasFilters = clip.filters;
		}
	}
};
RenderSupport.makeBevel = function(angle,distance,radius,spread,color1,alpha1,color2,alpha2,inside) {
	return null;
};
RenderSupport.makeBlur = function(radius,spread) {
	return new PIXI.filters.BlurFilter(spread,4,RenderSupport.backingStoreRatio,5);
};
RenderSupport.makeBackdropBlur = function(spread) {
	return new BlurBackdropFilter(spread);
};
RenderSupport.makeDropShadow = function(angle,distance,radius,spread,color,alpha,inside) {
	return new PIXI.filters.DropShadowFilter(angle,distance,radius,color,alpha);
};
RenderSupport.setUseBoxShadow = function(dropShadow) {
	dropShadow.useBoxShadow = true;
};
RenderSupport.makeGlow = function(radius,spread,color,alpha,inside) {
	return null;
};
RenderSupport.makeShader = function(vertex,fragment,uniforms) {
	var v = StringTools.replace(vertex.join(""),"a_VertexPos","aVertexPosition");
	v = StringTools.replace(v,"a_VertexTexCoord","aTextureCoord");
	v = StringTools.replace(v,"v_texCoord","vTextureCoord");
	v = StringTools.replace(v,"u_cmatrix","projectionMatrix");
	v = StringTools.replace(v,"s_tex","uSampler");
	v = StringTools.replace(v,"texture(","texture2D(");
	v = StringTools.replace(v,"in ","varying ");
	v = StringTools.replace(v,"out ","varying ");
	v = StringTools.replace(v,"frag_highp","highp");
	var f = StringTools.replace(fragment.join(""),"a_VertexPos","aVertexPosition");
	f = StringTools.replace(f,"a_VertexTexCoord","aTextureCoord");
	f = StringTools.replace(f,"v_texCoord","vTextureCoord");
	f = StringTools.replace(f,"u_cmatrix","projectionMatrix");
	f = StringTools.replace(f,"s_tex","uSampler");
	f = StringTools.replace(f,"texture(","texture2D(");
	f = StringTools.replace(f,"in ","varying ");
	f = StringTools.replace(f,"out ","varying ");
	f = StringTools.replace(f,"frag_highp","highp");
	var u = { };
	var _g = 0;
	while(_g < uniforms.length) {
		var uniform = uniforms[_g];
		++_g;
		u[uniform[0]] = { type : uniform[1], value : JSON.parse(uniform[2]) }
	}
	u.u_out_pixel_size = { type : "vec2", value : [1,1]};
	u.u_out_offset = { type : "vec2", value : [0,0]};
	u.u_in_pixel_size = { type : "vec2", value : [1,1]};
	u.u_in_offset = { type : "vec2", value : [0,0]};
	return new PIXI.Filter(v,f,u);
};
RenderSupport.setScrollRect = function(clip,left,top,width,height) {
	DisplayObjectHelper.setScrollRect(clip,left,top,width,height);
};
RenderSupport.setCropEnabled = function(clip,enabled) {
	DisplayObjectHelper.setCropEnabled(clip,enabled);
};
RenderSupport.setContentRect = function(clip,width,height) {
	if(clip.contentBounds == null) {
		clip.contentBounds = new PIXI.Bounds();
	}
	var contentBounds = clip.contentBounds;
	contentBounds.minX = 0.0;
	contentBounds.minY = 0.0;
	contentBounds.maxX = width;
	contentBounds.maxY = height;
	DisplayObjectHelper.invalidateTransform(clip,"setContentRect");
};
RenderSupport.listenScrollRect = function(clip,cb) {
	var clip1 = clip;
	clip1.scrollRectListener = cb;
	DisplayObjectHelper.invalidateInteractive(clip1);
	DisplayObjectHelper.invalidateTransform(clip1,"listenScrollRect");
	return function() {
		clip1.scrollRectListener = null;
		DisplayObjectHelper.invalidateInteractive(clip1);
		DisplayObjectHelper.invalidateTransform(clip1,"listenScrollRect disposer");
	};
};
RenderSupport.getTextMetrics = function(clip) {
	return clip.getTextMetrics();
};
RenderSupport.makeBitmap = function() {
	return null;
};
RenderSupport.bitmapDraw = function(bitmap,clip,width,height) {
};
RenderSupport.getClipVisible = function(clip) {
	return clip.clipVisible;
};
RenderSupport.setClipVisible = function(clip,visible) {
	if(clip._visible != visible) {
		clip._visible = visible;
		DisplayObjectHelper.invalidateVisible(clip);
	}
};
RenderSupport.setClipProtected = function(clip) {
	clip.skipHittestMask = true;
	DisplayObjectHelper.updateKeepNativeWidgetParent(clip,true);
};
RenderSupport.getClipRenderable = function(clip) {
	return clip.visible;
};
RenderSupport.setClipCursor = function(clip,cursor) {
	var cursor1 = RenderSupport.cursor2css(cursor);
	if(clip.cursor != cursor1) {
		clip.cursor = cursor1;
		if((RenderSupport.RendererType == "html" || clip.isHTML) && !clip.isCanvas && !clip.isNativeWidget) {
			DisplayObjectHelper.initNativeWidget(clip);
		}
		DisplayObjectHelper.invalidateTransform(clip,"setClipCursor");
	}
};
RenderSupport.setClipDebugInfo = function(clip,key,value) {
	clip.info = HaxeRuntime.typeOf(value).toString();
};
RenderSupport.fullScreenTrigger = function() {
	RenderSupport.IsFullScreen = RenderSupport.isFullScreen();
	RenderSupport.emit("fullscreen",RenderSupport.IsFullScreen);
};
RenderSupport.fullWindowTrigger = function(fw) {
	RenderSupport.IsFullWindow = fw;
	RenderSupport.emit("fullwindow",fw);
};
RenderSupport.setFullWindowTarget = function(clip) {
	if(RenderSupport.FullWindowTargetClip != clip) {
		if(RenderSupport.IsFullWindow && RenderSupport.FullWindowTargetClip != null) {
			RenderSupport.toggleFullWindow(false);
			RenderSupport.FullWindowTargetClip = clip;
			if(clip != null) {
				RenderSupport.toggleFullWindow(true);
			}
		} else {
			RenderSupport.FullWindowTargetClip = clip;
		}
	}
};
RenderSupport.setFullScreenTarget = function(clip) {
	if(RenderSupport.FullScreenTargetClip != clip) {
		if(RenderSupport.IsFullScreen && RenderSupport.FullScreenTargetClip != null) {
			RenderSupport.toggleFullScreen(false);
		}
		RenderSupport.FullScreenTargetClip = clip;
	}
};
RenderSupport.setFullScreenRectangle = function(x,y,w,h) {
};
RenderSupport.resetFullWindowTarget = function() {
	RenderSupport.setFullWindowTarget(null);
};
RenderSupport.resetFullScreenTarget = function() {
	RenderSupport.setFullScreenTarget(null);
};
RenderSupport.toggleFullWindow = function(fw) {
	if(RenderSupport.FullWindowTargetClip != null && RenderSupport.IsFullWindow != fw && RenderSupport.getClipPixiStage(RenderSupport.FullWindowTargetClip) != null) {
		var mainStage = js_Boot.__cast(RenderSupport.getClipPixiStage(RenderSupport.FullWindowTargetClip).children[0] , FlowContainer);
		if(fw) {
			RenderSupport.setShouldPreventFromBlur(RenderSupport.FullWindowTargetClip);
			var _g = 0;
			var _g1 = mainStage.children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				if(child._visible != false) {
					child._visible = false;
					DisplayObjectHelper.invalidateVisible(child);
				}
			}
			RenderSupport.regularFullScreenClipParent = RenderSupport.FullWindowTargetClip.parent;
			mainStage.addChild(RenderSupport.FullWindowTargetClip);
		} else {
			if(RenderSupport.regularFullScreenClipParent != null) {
				RenderSupport.regularFullScreenClipParent.addChild(RenderSupport.FullWindowTargetClip);
				RenderSupport.regularFullScreenClipParent = null;
			} else {
				mainStage.removeChild(RenderSupport.FullWindowTargetClip);
			}
			var _g = 0;
			var _g1 = mainStage.children;
			while(_g < _g1.length) {
				var child = _g1[_g];
				++_g;
				if(child._visible != true) {
					child._visible = true;
					DisplayObjectHelper.invalidateVisible(child);
				}
			}
		}
		RenderSupport.fullWindowTrigger(fw);
	}
};
RenderSupport.requestFullScreenClip = function(clip) {
	if(RenderSupport.IsFullScreen || clip == null || !clip.isNativeWidget) {
		return;
	}
	RenderSupport.FullScreenClip = clip;
	var nativeWidget = clip.nativeWidget;
	DisplayObjectHelper.updateKeepNativeWidgetInFullScreenModeParent(clip,true);
	if(nativeWidget != null) {
		var elementBRect = nativeWidget.getBoundingClientRect();
		RenderSupport.requestFullScreen(nativeWidget);
		RenderSupport.once("fullscreen",function() {
			RenderSupport.PixiStage.nativeWidget.style.position = "absolute";
			RenderSupport.PixiStage.nativeWidget.style.left = "" + -elementBRect.left + "px";
			RenderSupport.PixiStage.nativeWidget.style.top = "" + -elementBRect.top + "px";
		});
	}
};
RenderSupport.exitFullScreenClip = function(clip) {
	if(clip == null || !clip.isNativeWidget) {
		return;
	}
	RenderSupport.FullScreenClip = null;
	var nativeWidget = clip.nativeWidget;
	DisplayObjectHelper.updateKeepNativeWidgetInFullScreenModeParent(clip,false);
	if(nativeWidget != null) {
		RenderSupport.exitFullScreen(nativeWidget);
		RenderSupport.PixiStage.nativeWidget.style.position = null;
		RenderSupport.PixiStage.nativeWidget.style.left = null;
		RenderSupport.PixiStage.nativeWidget.style.top = null;
	}
};
RenderSupport.requestFullScreen = function(element) {
	if(element.requestFullscreen != null) {
		element.requestFullscreen();
	} else if(element.mozRequestFullScreen != null) {
		element.mozRequestFullScreen();
	} else if(element.webkitRequestFullscreen != null) {
		element.webkitRequestFullscreen();
	} else if(element.msRequestFullscreen != null) {
		element.msRequestFullscreen();
	} else if(element.webkitEnterFullScreen != null) {
		element.webkitEnterFullScreen();
	}
};
RenderSupport.exitFullScreen = function(element) {
	if(HaxeRuntime.instanceof(element,HTMLCanvasElement)) {
		element = window.document;
	}
	if(RenderSupport.IsFullScreen) {
		if(element.exitFullscreen != null) {
			element.exitFullscreen();
		} else if(element.mozCancelFullScreen != null) {
			element.mozCancelFullScreen();
		} else if(element.webkitExitFullscreen != null) {
			element.webkitExitFullscreen();
		} else if(element.msExitFullscreen != null) {
			element.msExitFullscreen();
		}
	}
};
RenderSupport.toggleFullScreen = function(fs) {
	if(!RenderSupport.hadUserInteracted) {
		return;
	}
	if(fs) {
		var mainStage = RenderSupport.getClipPixiStage(RenderSupport.FullScreenTargetClip);
		var root = mainStage == null || mainStage.nativeWidget == null ? window.document.body : mainStage.nativeWidget.host != null ? mainStage.nativeWidget.host : mainStage.nativeWidget;
		RenderSupport.requestFullScreen(root);
	} else {
		RenderSupport.exitFullScreen(window.document);
	}
};
RenderSupport.onFullScreen = function(fn) {
	RenderSupport.on("fullscreen",fn);
	return function() {
		RenderSupport.off("fullscreen",fn);
	};
};
RenderSupport.isFullScreen = function() {
	if(!window.document.fullScreen) {
		if(!window.document.mozFullScreen) {
			if(!window.document.webkitIsFullScreen) {
				if(window.document.fullscreenElement == null) {
					if(window.document.msFullscreenElement == null) {
						if(RenderSupport.FullWindowTargetClip != null && RenderSupport.FullWindowTargetClip.nativeWidget != null) {
							return RenderSupport.FullWindowTargetClip.nativeWidget.webkitDisplayingFullscreen;
						} else {
							return false;
						}
					} else {
						return true;
					}
				} else {
					return true;
				}
			} else {
				return true;
			}
		} else {
			return true;
		}
	} else {
		return true;
	}
};
RenderSupport.onFullWindow = function(onChange) {
	RenderSupport.on("fullwindow",onChange);
	return function() {
		RenderSupport.off("fullwindow",onChange);
	};
};
RenderSupport.isFullWindow = function() {
	return RenderSupport.IsFullWindow;
};
RenderSupport.setWindowTitle = function(title) {
	window.document.title = title;
};
RenderSupport.setFavIcon = function(url) {
	var head = window.document.getElementsByTagName("head")[0];
	var oldNode = window.document.getElementById("app-favicon");
	var oldIcons = window.document.querySelectorAll("link[rel='icon']");
	var node = window.document.createElement("link");
	node.setAttribute("id","app-favicon");
	node.setAttribute("rel","shortcut icon");
	node.setAttribute("href",url);
	node.setAttribute("type","image/ico");
	if(oldNode != null) {
		head.removeChild(oldNode);
	}
	if(oldIcons != null) {
		oldIcons.forEach(
				function (node) {
					head.removeChild(node);
				}
			);
	}
	head.appendChild(node);
};
RenderSupport.takeSnapshot = function(path) {
	RenderSupport.takeSnapshotBox(path,0,0,RenderSupport.getStageWidth() | 0,RenderSupport.getStageHeight() | 0);
};
RenderSupport.takeSnapshotBox = function(path,x,y,w,h) {
	try {
		var base64 = RenderSupport.getSnapshotBox(x,y,w,h).split(",")[1];
		var base64bytes = [];
		
				const sliceSize = 512;
				const byteCharacters = atob(base64);

				for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
					const slice = byteCharacters.slice(offset, offset + sliceSize);

					const byteNumbers = new Array(slice.length);
					for (var i = 0; i < slice.length; i++) {
						byteNumbers[i] = slice.charCodeAt(i);
					}

					const byteArray = new Uint8Array(byteNumbers);
					base64bytes.push(byteArray);
				}
			;
		FlowFileSystem.saveFileClient(path,base64bytes,"image/png");
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
	}
};
RenderSupport.getSnapshot = function() {
	return RenderSupport.getSnapshotBox(0,0,RenderSupport.getStageWidth() | 0,RenderSupport.getStageHeight() | 0);
};
RenderSupport.getSnapshotBox = function(x,y,w,h) {
	var child = RenderSupport.PixiStage.children[0];
	if(child == null) {
		return "";
	}
	RenderSupport.LayoutText = true;
	RenderSupport.emit("enable_sprites");
	DisplayObjectHelper.setScrollRect(child,x,y,w,h,true);
	var clip = RenderSupport.PixiStage;
	if(clip.renderable != true) {
		clip.renderable = true;
		DisplayObjectHelper.invalidateVisible(clip);
		if(!clip.keepNativeWidget) {
			DisplayObjectHelper.invalidateTransform(clip,"setClipRenderable");
		}
	}
	var _g = 0;
	var _g1 = clip.children || [];
	while(_g < _g1.length) {
		var child1 = _g1[_g];
		++_g;
		if(child1.clipVisible && !child1.isMask) {
			var renderable = true;
			if(renderable == null) {
				renderable = true;
			}
			if(child1.renderable != renderable) {
				child1.renderable = renderable;
				DisplayObjectHelper.invalidateVisible(child1);
				if(!child1.keepNativeWidget) {
					DisplayObjectHelper.invalidateTransform(child1,"setClipRenderable");
				}
			}
			var _g2 = 0;
			var _g3 = child1.children || [];
			while(_g2 < _g3.length) {
				var child2 = _g3[_g2];
				++_g2;
				if(child2.clipVisible && !child2.isMask) {
					DisplayObjectHelper.forceClipRenderable(child2,renderable);
				}
			}
		}
	}
	RenderSupport.animate();
	var dispFn = function() {
		child.scrollRectListener = null;
		var scrollRect = child.scrollRect;
		if(scrollRect != null) {
			var x = child.x + scrollRect.x;
			if(child.scrollRect != null) {
				x -= child.scrollRect.x;
			}
			if(!child.destroyed && child.x != x) {
				var from = DisplayObjectHelper.DebugUpdate ? "setClipX " + child.x + " : " + x : null;
				child.x = x;
				DisplayObjectHelper.invalidateTransform(child,from);
			}
			var y = child.y + scrollRect.y;
			if(child.scrollRect != null) {
				y -= child.scrollRect.y;
			}
			if(!child.destroyed && child.y != y) {
				var from = DisplayObjectHelper.DebugUpdate ? "setClipY " + child.y + " : " + y : null;
				child.y = y;
				DisplayObjectHelper.invalidateTransform(child,from);
			}
			child.removeChild(scrollRect);
			if(child.mask == scrollRect) {
				child.mask = null;
			}
			child.scrollRect = null;
			child.mask = null;
			child.maskContainer = null;
			DisplayObjectHelper.invalidateTransform(child,"removeScrollRect");
		}
		RenderSupport.LayoutText = false;
		RenderSupport.emit("disable_sprites");
		RenderSupport.forceRender();
	};
	try {
		var img = RenderSupport.PixiRenderer.plugins.extract.base64(RenderSupport.PixiStage);
		dispFn();
		return img;
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		var e = haxe_Exception.caught(_g).unwrap();
		haxe_Log.trace(e,{ fileName : "RenderSupport.hx", lineNumber : 4010, className : "RenderSupport", methodName : "getSnapshotBox"});
		dispFn();
		return "error";
	}
};
RenderSupport.getClipSnapshot = function(clip,cb) {
	RenderSupport.clipSnapshotRequests++;
	if(!RenderSupport.printMode) {
		RenderSupport.printMode = true;
		RenderSupport.prevInvalidateRenderable = DisplayObjectHelper.InvalidateRenderable;
		DisplayObjectHelper.InvalidateRenderable = false;
	}
	var clip1 = RenderSupport.PixiStage;
	if(clip1.renderable != true) {
		clip1.renderable = true;
		DisplayObjectHelper.invalidateVisible(clip1);
		if(!clip1.keepNativeWidget) {
			DisplayObjectHelper.invalidateTransform(clip1,"setClipRenderable");
		}
	}
	var _g = 0;
	var _g1 = clip1.children || [];
	while(_g < _g1.length) {
		var child = _g1[_g];
		++_g;
		if(child.clipVisible && !child.isMask) {
			var renderable = true;
			if(renderable == null) {
				renderable = true;
			}
			if(child.renderable != renderable) {
				child.renderable = renderable;
				DisplayObjectHelper.invalidateVisible(child);
				if(!child.keepNativeWidget) {
					DisplayObjectHelper.invalidateTransform(child,"setClipRenderable");
				}
			}
			var _g2 = 0;
			var _g3 = child.children || [];
			while(_g2 < _g3.length) {
				var child1 = _g3[_g2];
				++_g2;
				if(child1.clipVisible && !child1.isMask) {
					DisplayObjectHelper.forceClipRenderable(child1,renderable);
				}
			}
		}
	}
	RenderSupport.forceRender();
	RenderSupport.PixiStage.once("drawframe",function() {
		DisplayObjectHelper.onImagesLoaded(RenderSupport.PixiStage,function() {
			RenderSupport.PixiStage.once("drawframe",function() {
				var snapshot = clip.children != null && clip.children.length > 0 ? RenderSupport.getClipSnapshotBox(clip,Math.floor(clip.worldTransform.tx),Math.floor(clip.worldTransform.ty),Math.floor(clip.getWidth != null ? clip.getWidth() : clip.getLocalBounds().width),Math.floor(DisplayObjectHelper.getHeight(clip))) : "";
				RenderSupport.clipSnapshotRequests--;
				if(RenderSupport.printMode && RenderSupport.clipSnapshotRequests == 0) {
					RenderSupport.printMode = false;
					DisplayObjectHelper.InvalidateRenderable = RenderSupport.prevInvalidateRenderable;
					RenderSupport.forceRender();
				}
				cb(snapshot);
			});
		});
	});
};
RenderSupport.getClipSnapshotBox = function(clip,x,y,w,h) {
	if(clip == null) {
		return "";
	}
	RenderSupport.LayoutText = true;
	RenderSupport.emit("enable_sprites");
	var prevX = clip.x;
	var prevY = clip.y;
	DisplayObjectHelper.setScrollRect(clip,x,y,w,h);
	RenderSupport.forceRender();
	var dispFn = function() {
		clip.scrollRectListener = null;
		var scrollRect = clip.scrollRect;
		if(scrollRect != null) {
			var x = clip.x + scrollRect.x;
			if(clip.scrollRect != null) {
				x -= clip.scrollRect.x;
			}
			if(!clip.destroyed && clip.x != x) {
				var from = DisplayObjectHelper.DebugUpdate ? "setClipX " + clip.x + " : " + x : null;
				clip.x = x;
				DisplayObjectHelper.invalidateTransform(clip,from);
			}
			var y = clip.y + scrollRect.y;
			if(clip.scrollRect != null) {
				y -= clip.scrollRect.y;
			}
			if(!clip.destroyed && clip.y != y) {
				var from = DisplayObjectHelper.DebugUpdate ? "setClipY " + clip.y + " : " + y : null;
				clip.y = y;
				DisplayObjectHelper.invalidateTransform(clip,from);
			}
			clip.removeChild(scrollRect);
			if(clip.mask == scrollRect) {
				clip.mask = null;
			}
			clip.scrollRect = null;
			clip.mask = null;
			clip.maskContainer = null;
			DisplayObjectHelper.invalidateTransform(clip,"removeScrollRect");
		}
		clip.x = prevX;
		clip.y = prevY;
		DisplayObjectHelper.invalidateTransform(clip,"getClipSnapshotBox");
		RenderSupport.LayoutText = false;
		RenderSupport.emit("disable_sprites");
		RenderSupport.forceRender();
	};
	try {
		var img = RenderSupport.PixiRenderer.plugins.extract.base64(clip == RenderSupport.mainRenderClip() ? clip : clip.children[0]);
		dispFn();
		return img;
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		var e = haxe_Exception.caught(_g).unwrap();
		haxe_Log.trace(e,{ fileName : "RenderSupport.hx", lineNumber : 4085, className : "RenderSupport", methodName : "getClipSnapshotBox"});
		dispFn();
		return "error";
	}
};
RenderSupport.compareImages = function(image1,image2,cb) {
	if(typeof resemble === 'undefined') {
		var head = window.document.getElementsByTagName("head")[0];
		var node = window.document.createElement("script");
		node.setAttribute("type","text/javascript");
		node.setAttribute("src","js/resemble.js");
		node.onload = function() {
			RenderSupport.compareImages(image1,image2,cb);
		};
		head.appendChild(node);
	} else {
		
				resemble(image1)
				.compareTo(image2)
				.setReturnEarlyThreshold(Platform.isIE?10:0)
				.ignoreAntialiasing()
				.outputSettings({
					errorType: 'movementDifferenceIntensity',
				})
				.onComplete(function(data) {
					cb(JSON.stringify(data));
				});
			;
	}
};
RenderSupport.getScreenPixelColor = function(x,y) {
	var data = RenderSupport.PixiView.getContext2d().getImageData(x * RenderSupport.backingStoreRatio,y * RenderSupport.backingStoreRatio,1,1).data;
	var rgb = data[0];
	rgb = (rgb << 8) + data[1];
	rgb = (rgb << 8) + data[2];
	return rgb;
};
RenderSupport.makeWebClip = function(url,domain,useCache,reloadBlock,cb,ondone,shrinkToFit) {
	return new WebClip(url,domain,useCache,reloadBlock,cb,ondone,shrinkToFit);
};
RenderSupport.webClipHostCall = function(clip,name,args) {
	return clip.hostCall(name,args);
};
RenderSupport.setWebClipSandBox = function(clip,value) {
	clip.setSandBox(value);
};
RenderSupport.setWebClipDisabled = function(clip,disabled) {
	clip.setDisabled(disabled);
};
RenderSupport.setWebClipNoScroll = function(clip) {
	clip.setNoScroll();
};
RenderSupport.setWebClipPassEvents = function(clip) {
	clip.setPassEvents();
};
RenderSupport.webClipEvalJS = function(clip,code,cb) {
	cb(clip.evalJS(code));
};
RenderSupport.makeHTMLStage = function(width,height) {
	return new HTMLStage(width,height);
};
RenderSupport.assignClip = function(stage,id,clip) {
	stage.assignClip(id,clip);
};
RenderSupport.createElement = function(tagName) {
	var tmp = tagName.toLowerCase() == "svg" || tagName.toLowerCase() == "path" || tagName.toLowerCase() == "g" ? "http://www.w3.org/2000/svg" : "http://www.w3.org/1999/xhtml";
	return window.document.createElementNS(tmp,tagName);
};
RenderSupport.createTextNode = function(text) {
	return window.document.createTextNode(text);
};
RenderSupport.changeNodeValue = function(element,value) {
	element.nodeValue = value;
};
RenderSupport.getElementById = function(selector) {
	return window.document.getElementById(selector);
};
RenderSupport.getElementChildren = function(element) {
	if(element.isHTMLStage) {
		return Array.from(element.nativeWidget.childNodes);
	} else {
		return Array.from(element.childNodes);
	}
};
RenderSupport.getElementNextSibling = function(element) {
	return element.nextSibling;
};
RenderSupport.isElementNull = function(element) {
	return element == null;
};
RenderSupport.setAttribute = function(element,name,value,safe) {
	if(safe == null) {
		safe = false;
	}
	if(safe) {
		if(name == "innerHTML") {
			element.innerHTML = DOMPurify.sanitize(value);
		} else {
			element.setAttribute(name,DOMPurify.sanitize(value));
		}
	} else if(name == "innerHTML") {
		element.innerHTML = value;
	} else {
		element.setAttribute(name,value);
	}
};
RenderSupport.removeAttribute = function(element,name) {
	element.removeAttribute(name);
};
RenderSupport.appendChild = function(element,child) {
	element.appendChild(child);
};
RenderSupport.insertBefore = function(element,child,reference) {
	element.insertBefore(child,reference);
};
RenderSupport.removeElementChild = function(element,child) {
	RenderSupport.removeChild(element,child);
};
RenderSupport.getNumberOfCameras = function() {
	return 0;
};
RenderSupport.getCameraInfo = function(id) {
	return "";
};
RenderSupport.makeCamera = function(uri,camID,camWidth,camHeight,camFps,vidWidth,vidHeight,recordMode,cbOnReadyForRecording,cbOnFailed) {
	return [null,null];
};
RenderSupport.startRecord = function(str,filename,mode) {
};
RenderSupport.stopRecord = function(str) {
};
RenderSupport.cameraTakePhoto = function(cameraId,additionalInfo,desiredWidth,desiredHeight,compressQuality,fileName,fitMode) {
};
RenderSupport.addGestureListener = function(event,cb) {
	if(event == "pinch") {
		return GesturesDetector.addPinchListener(cb);
	} else {
		return function() {
		};
	}
};
RenderSupport.setWebClipZoomable = function(clip,zoomable) {
};
RenderSupport.setWebClipDomains = function(clip,domains) {
};
RenderSupport.setInterfaceOrientation = function(orientation) {
	var screen = window.screen;
	if(screen != null && screen.orientation != null && screen.orientation.lock != null) {
		if(orientation != "none") {
			screen.orientation.lock(orientation);
		} else {
			screen.orientation.unlock();
		}
	}
};
RenderSupport.setUrlHash = function(hash) {
	window.location.hash = hash;
};
RenderSupport.getUrlHash = function() {
	return window.location.hash;
};
RenderSupport.addUrlHashListener = function(cb) {
	var wrapper = function(e) {
		cb(window.location.hash);
	};
	window.addEventListener("hashchange",wrapper);
	return function() {
		window.removeEventListener("hashchange",wrapper);
	};
};
RenderSupport.reloadPage = function(forced) {
	window.location.reload(forced);
};
RenderSupport.setGlobalZoomEnabled = function(enabled) {
};
RenderSupport.removeAlphaChannel = function(color) {
	return color & 16777215;
};
RenderSupport.getInstanceByRootId = function(rootId) {
	if(Platform.isIE) {
		var _g = 0;
		var _g1 = RenderSupport.FlowInstances;
		while(_g < _g1.length) {
			var instance = _g1[_g];
			++_g;
			if(instance.rootId == rootId) {
				return instance;
			}
		}
		return null;
	} else {
		return RenderSupport.FlowInstances.find(function(instance) {
			return instance.rootId == rootId;
		});
	}
};
RenderSupport.getClipPixiStage = function(clip) {
	if(clip.flowInstance != null) {
		return clip;
	}
	if(clip.parentClip != null) {
		return RenderSupport.getClipPixiStage(clip.parentClip);
	}
	return null;
};
RenderSupport.getHadUserInteracted = function() {
	return RenderSupport.hadUserInteracted;
};
RenderSupport.prototype = {
	__class__: RenderSupport
};
var FlowJsProgram = function() { };
FlowJsProgram.__name__ = true;
var FlowMediaStream = function(mediaStream) {
	PIXI.utils.EventEmitter.call(this);
	this.mediaStream = mediaStream;
};
FlowMediaStream.__name__ = true;
FlowMediaStream.__super__ = PIXI.utils.EventEmitter;
FlowMediaStream.prototype = $extend(PIXI.utils.EventEmitter.prototype,{
	__class__: FlowMediaStream
});
var HTMLStage = function(width,height) {
	this.isInteractive = true;
	this.clips = new haxe_ds_StringMap();
	this.isHTMLStage = true;
	var _gthis = this;
	NativeWidgetClip.call(this);
	this.setWidth(width);
	this.setHeight(height);
	this.once("removed",function() {
		RenderSupport.PreventDefault = true;
	});
	DisplayObjectHelper.initNativeWidget(this);
	this.nativeWidget.style.display = "none";
	this.nativeWidget.classList.add("stage");
	this.nativeWidget.addEventListener("pointerenter",function() {
		RenderSupport.PreventDefault = false;
	});
	this.nativeWidget.addEventListener("pointerleave",function() {
		RenderSupport.PreventDefault = true;
	});
	window.document.body.appendChild(this.nativeWidget);
	this.stageRect = this.nativeWidget.getBoundingClientRect();
	var config = { attributes : true, childList : true, subtree : true};
	var updating = false;
	var callback = function() {
		if(!updating) {
			updating = true;
			RenderSupport.once("drawframe",function() {
				if(!_gthis.nativeWidget) {
					return;
				}
				_gthis.stageRect = _gthis.nativeWidget.getBoundingClientRect();
				var h = _gthis.clips.h;
				var clip_h = h;
				var clip_keys = Object.keys(h);
				var clip_length = clip_keys.length;
				var clip_current = 0;
				while(clip_current < clip_length) {
					var clip = clip_h[clip_keys[clip_current++]];
					if(clip.children != null && clip.children.length > 0) {
						var parentRect = clip.children[0].forceParentNode.getBoundingClientRect();
						var x = parentRect.x - _gthis.stageRect.x;
						if(clip.scrollRect != null) {
							x -= clip.scrollRect.x;
						}
						if(!clip.destroyed && clip.x != x) {
							var from = DisplayObjectHelper.DebugUpdate ? "setClipX " + clip.x + " : " + x : null;
							clip.x = x;
							DisplayObjectHelper.invalidateTransform(clip,from);
						}
						var y = parentRect.y - _gthis.stageRect.y;
						if(clip.scrollRect != null) {
							y -= clip.scrollRect.y;
						}
						if(!clip.destroyed && clip.y != y) {
							var from1 = DisplayObjectHelper.DebugUpdate ? "setClipY " + clip.y + " : " + y : null;
							clip.y = y;
							DisplayObjectHelper.invalidateTransform(clip,from1);
						}
					}
				}
				updating = false;
			});
		}
	};
	var observer = new MutationObserver(callback);
	observer.observe(this.nativeWidget,config);
};
HTMLStage.__name__ = true;
HTMLStage.__super__ = NativeWidgetClip;
HTMLStage.prototype = $extend(NativeWidgetClip.prototype,{
	appendChild: function(child) {
		this.nativeWidget.appendChild(child);
	}
	,assignClip: function(className,clip) {
		if(this.clips.h[className] != null) {
			this.clips.h[className].removeChildren();
			this.removeChild(this.clips.h[className]);
		}
		var container = new FlowContainer();
		container.isHTMLStageContainer = true;
		var element = this.nativeWidget.getElementsByClassName(className)[0];
		if(element) {
			clip.forceParentNode = element;
			DisplayObjectHelper.initNativeWidget(clip);
			container.addChild(clip);
			this.addChild(container);
			this.clips.h[className] = container;
		}
	}
	,insertBefore: function(child,reference) {
		this.nativeWidget.insertBefore(child,reference);
	}
	,removeElementChild: function(child) {
		if(this.nativeWidget != null && child.parentElement == this.nativeWidget) {
			this.nativeWidget.removeChild(child);
		}
	}
	,renderCanvas: function(renderer) {
		return;
	}
	,__class__: HTMLStage
});
var FlowRefObject = function(v) {
	this.__v = v;
};
FlowRefObject.__name__ = true;
FlowRefObject.prototype = {
	__class__: FlowRefObject
};
var haxe_http_HttpBase = function(url) {
	this.url = url;
	this.headers = [];
	this.params = [];
	this.emptyOnData = $bind(this,this.onData);
};
haxe_http_HttpBase.__name__ = true;
haxe_http_HttpBase.prototype = {
	setHeader: function(name,value) {
		var _g = 0;
		var _g1 = this.headers.length;
		while(_g < _g1) {
			var i = _g++;
			if(this.headers[i].name == name) {
				this.headers[i] = { name : name, value : value};
				return;
			}
		}
		this.headers.push({ name : name, value : value});
	}
	,setParameter: function(name,value) {
		var _g = 0;
		var _g1 = this.params.length;
		while(_g < _g1) {
			var i = _g++;
			if(this.params[i].name == name) {
				this.params[i] = { name : name, value : value};
				return;
			}
		}
		this.params.push({ name : name, value : value});
	}
	,setPostData: function(data) {
		this.postData = data;
		this.postBytes = null;
	}
	,onData: function(data) {
	}
	,onBytes: function(data) {
	}
	,onError: function(msg) {
	}
	,onStatus: function(status) {
	}
	,hasOnData: function() {
		return !Reflect.compareMethods($bind(this,this.onData),this.emptyOnData);
	}
	,success: function(data) {
		this.responseBytes = data;
		this.responseAsString = null;
		if(this.hasOnData()) {
			this.onData(this.get_responseData());
		}
		this.onBytes(this.responseBytes);
	}
	,get_responseData: function() {
		if(this.responseAsString == null && this.responseBytes != null) {
			this.responseAsString = this.responseBytes.getString(0,this.responseBytes.length,haxe_io_Encoding.UTF8);
		}
		return this.responseAsString;
	}
	,__class__: haxe_http_HttpBase
};
var haxe_http_HttpJs = function(url) {
	this.async = true;
	this.withCredentials = false;
	haxe_http_HttpBase.call(this,url);
};
haxe_http_HttpJs.__name__ = true;
haxe_http_HttpJs.__super__ = haxe_http_HttpBase;
haxe_http_HttpJs.prototype = $extend(haxe_http_HttpBase.prototype,{
	cancel: function() {
		if(this.req == null) {
			return;
		}
		this.req.abort();
		this.req = null;
	}
	,request: function(post) {
		var _gthis = this;
		this.responseAsString = null;
		this.responseBytes = null;
		var r = this.req = js_Browser.createXMLHttpRequest();
		var onreadystatechange = function(_) {
			if(r.readyState != 4) {
				return;
			}
			var s;
			try {
				s = r.status;
			} catch( _g ) {
				haxe_NativeStackTrace.lastError = _g;
				s = null;
			}
			if(s == 0 && js_Browser.get_supported() && $global.location != null) {
				var protocol = $global.location.protocol.toLowerCase();
				var rlocalProtocol = new EReg("^(?:about|app|app-storage|.+-extension|file|res|widget):$","");
				var isLocal = rlocalProtocol.match(protocol);
				if(isLocal) {
					s = r.response != null ? 200 : 404;
				}
			}
			if(s == undefined) {
				s = null;
			}
			if(s != null) {
				_gthis.onStatus(s);
			}
			if(s != null && s >= 200 && s < 400) {
				_gthis.req = null;
				_gthis.success(haxe_io_Bytes.ofData(r.response));
			} else if(s == null || s == 0 && r.response == null) {
				_gthis.req = null;
				_gthis.onError("Failed to connect or resolve host");
			} else if(s == null) {
				_gthis.req = null;
				var onreadystatechange = r.response != null ? haxe_io_Bytes.ofData(r.response) : null;
				_gthis.responseBytes = onreadystatechange;
				_gthis.onError("Http Error #" + r.status);
			} else {
				switch(s) {
				case 12007:
					_gthis.req = null;
					_gthis.onError("Unknown host");
					break;
				case 12029:
					_gthis.req = null;
					_gthis.onError("Failed to connect to host");
					break;
				default:
					_gthis.req = null;
					var onreadystatechange = r.response != null ? haxe_io_Bytes.ofData(r.response) : null;
					_gthis.responseBytes = onreadystatechange;
					_gthis.onError("Http Error #" + r.status);
				}
			}
		};
		if(this.async) {
			r.onreadystatechange = onreadystatechange;
		}
		var uri;
		var _g = this.postData;
		var _g1 = this.postBytes;
		if(_g == null) {
			if(_g1 == null) {
				uri = null;
			} else {
				var bytes = _g1;
				uri = new Blob([bytes.b.bufferValue]);
			}
		} else if(_g1 == null) {
			var str = _g;
			uri = str;
		} else {
			uri = null;
		}
		if(uri != null) {
			post = true;
		} else {
			var _g = 0;
			var _g1 = this.params;
			while(_g < _g1.length) {
				var p = _g1[_g];
				++_g;
				if(uri == null) {
					uri = "";
				} else {
					uri = (uri == null ? "null" : Std.string(uri)) + "&";
				}
				var s = p.name;
				var value = (uri == null ? "null" : Std.string(uri)) + encodeURIComponent(s) + "=";
				var s1 = p.value;
				uri = value + encodeURIComponent(s1);
			}
		}
		try {
			if(post) {
				r.open("POST",this.url,this.async);
			} else if(uri != null) {
				var question = this.url.split("?").length <= 1;
				r.open("GET",this.url + (question ? "?" : "&") + (uri == null ? "null" : Std.string(uri)),this.async);
				uri = null;
			} else {
				r.open("GET",this.url,this.async);
			}
			r.responseType = "arraybuffer";
		} catch( _g ) {
			haxe_NativeStackTrace.lastError = _g;
			var e = haxe_Exception.caught(_g).unwrap();
			this.req = null;
			this.onError(e.toString());
			return;
		}
		r.withCredentials = this.withCredentials;
		if(!Lambda.exists(this.headers,function(h) {
			return h.name == "Content-Type";
		}) && post && this.postData == null) {
			r.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		}
		var _g = 0;
		var _g1 = this.headers;
		while(_g < _g1.length) {
			var h = _g1[_g];
			++_g;
			r.setRequestHeader(h.name,h.value);
		}
		r.send(uri);
		if(!this.async) {
			onreadystatechange(null);
		}
	}
	,__class__: haxe_http_HttpJs
});
var HttpCustom = function(url,method) {
	this.defaultEncodings = ["auto","utf8_js"];
	this.arrayBufferEncodings = ["utf8","byte"];
	this.availableMethods = ["GET","POST","DELETE","PATCH","PUT"];
	haxe_http_HttpJs.call(this,url);
	if(this.availableMethods.lastIndexOf(method) != -1) {
		this.method = method;
	} else {
		this.method = "GET";
	}
};
HttpCustom.__name__ = true;
HttpCustom.__super__ = haxe_http_HttpJs;
HttpCustom.prototype = $extend(haxe_http_HttpJs.prototype,{
	request: function(post) {
		this.requestExt(post,"auto");
	}
	,requestExt: function(post,responseEncoding) {
		var _gthis = this;
		var me = this;
		me.responseAsString = null;
		var r = me.req = js_Browser.createXMLHttpRequest();
		var utf8NoSurrogatesFlag = Util.getParameter("utf8_no_surrogates");
		if(utf8NoSurrogatesFlag != null && utf8NoSurrogatesFlag != "0") {
			responseEncoding = "utf8";
		} else if(responseEncoding == "utf8_js") {
			responseEncoding = "auto";
		} else if(this.arrayBufferEncodings.indexOf(responseEncoding) == -1 && this.defaultEncodings.indexOf(responseEncoding) == -1) {
			responseEncoding = "auto";
		}
		if(!Platform.isIE) {
			if(this.arrayBufferEncodings.indexOf(responseEncoding) != -1) {
				r.responseType = "arraybuffer";
			} else {
				r.responseType = "";
			}
		}
		var encodedResponse = "";
		var onreadystatechange = function(v) {
			if(r.readyState != 4) {
				return;
			}
			var s;
			try {
				s = r.status;
			} catch( _g ) {
				haxe_NativeStackTrace.lastError = _g;
				s = null;
			}
			if(s != null && "undefined" !== typeof window) {
				var protocol = $global.location.protocol.toLowerCase();
				var rlocalProtocol = new EReg("^(?:about|app|app-storage|.+-extension|file|res|widget):$","");
				var isLocal = rlocalProtocol.match(protocol);
				if(isLocal) {
					if(r.responseType == "arraybuffer") {
						s = encodedResponse != null ? 200 : 404;
					} else {
						s = r.responseText != null ? 200 : 404;
					}
				}
			}
			if(s == undefined) {
				s = null;
			}
			if(s != null) {
				me.onStatus(s);
			}
			me.req = null;
			if(responseEncoding == "utf8") {
				try {
					encodedResponse = _gthis.parseUtf8Real(new Uint8Array(r.response),r.response.byteLength);
				} catch( _g ) {
					haxe_NativeStackTrace.lastError = _g;
					var e = haxe_Exception.caught(_g).unwrap();
					encodedResponse = null;
					Native.println("ERROR: parseUtf8Full reported: " + Std.string(e));
				}
			} else if(responseEncoding == "byte") {
				try {
					encodedResponse = _gthis.respone2bytesString(new Uint8Array(r.response),r.response.byteLength);
				} catch( _g ) {
					haxe_NativeStackTrace.lastError = _g;
					var e = haxe_Exception.caught(_g).unwrap();
					encodedResponse = null;
					Native.println("ERROR: parseBinary reported: " + Std.string(e));
				}
			}
			if(r.responseType == "arraybuffer") {
				me.responseAsString = encodedResponse;
			} else {
				me.responseAsString = r.responseText;
			}
			var _this = r.getAllResponseHeaders().split("\r\n");
			var result = new Array(_this.length);
			var _g = 0;
			var _g1 = _this.length;
			while(_g < _g1) {
				var i = _g++;
				var _this1 = _this[i].split(":");
				var f = StringTools.ltrim;
				var result1 = new Array(_this1.length);
				var _g2 = 0;
				var _g3 = _this1.length;
				while(_g2 < _g3) {
					var i1 = _g2++;
					result1[i1] = f(_this1[i1]);
				}
				result[i] = result1;
			}
			me.responseHeaders2 = result;
			me.onResponse(s,me.get_responseData(),me.responseHeaders2);
		};
		if(this.async) {
			r.onreadystatechange = onreadystatechange;
		}
		var uri = this.postData;
		if(uri != null && this.method == "GET") {
			this.method = "POST";
		} else {
			var _g = 0;
			var _g1 = this.params;
			while(_g < _g1.length) {
				var p = _g1[_g];
				++_g;
				if(uri == null) {
					uri = "";
				} else {
					uri += "&";
				}
				var s = p.name;
				var uri1 = encodeURIComponent(s) + "=";
				var s1 = p.value;
				uri += uri1 + encodeURIComponent(s1);
			}
		}
		try {
			if(this.method != "GET") {
				r.open(this.method,this.url,this.async);
			} else if(uri != null) {
				var question = this.url.split("?").length <= 1;
				r.open("GET",this.url + (question ? "?" : "&") + uri,this.async);
				uri = null;
			} else {
				r.open("GET",this.url,this.async);
			}
		} catch( _g ) {
			haxe_NativeStackTrace.lastError = _g;
			var e = haxe_Exception.caught(_g).unwrap();
			me.req = null;
			me.onError(e.toString());
			return;
		}
		if(Platform.isIE) {
			try {
				if(this.arrayBufferEncodings.indexOf(responseEncoding) != -1) {
					r.responseType = "arraybuffer";
				} else {
					r.responseType = "";
				}
			} catch( _g ) {
				haxe_NativeStackTrace.lastError = _g;
				var e = haxe_Exception.caught(_g).unwrap();
				console.log(e);
			}
		}
		if(!Lambda.exists(this.headers,function(h) {
			return h.name == "Content-Type";
		}) && this.method != "GET") {
			r.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		}
		var _g = 0;
		var _g1 = this.headers;
		while(_g < _g1.length) {
			var h = _g1[_g];
			++_g;
			try {
				r.setRequestHeader(h.name,h.value);
			} catch( _g2 ) {
				haxe_NativeStackTrace.lastError = _g2;
				var e = haxe_Exception.caught(_g2).unwrap();
				me.req = null;
				me.onResponse(0,e.toString(),[]);
				return;
			}
		}
		r.send(uri);
		if(!this.async) {
			onreadystatechange(null);
		}
	}
	,cancel: function() {
		if(this.req != null) {
			this.req.abort();
			this.req = null;
		}
	}
	,parseUtf8Real: function(str,size) {
		var out = "";
		var bytes = 0;
		var decode_error = String.fromCodePoint(65533);
		var is_sequence_correct = function(i,bytes) {
			var is_correct = true;
			if(size - i >= bytes) {
				var mask = 192;
				var next_octet_mask = 128;
				var _g = 1;
				var _g1 = bytes;
				while(_g < _g1) {
					var j = _g++;
					var c = str[i + j];
					is_correct = is_correct && (c & mask) == next_octet_mask;
				}
			} else {
				is_correct = false;
			}
			return is_correct;
		};
		var push_sequence = function(mask,c,i,bytes) {
			if(is_sequence_correct(i,bytes)) {
				var w = c & mask;
				var _g = 1;
				var _g1 = bytes;
				while(_g < _g1) {
					var j = _g++;
					c = str[i + j];
					w = w << 6 | c & 63;
				}
				out += String.fromCodePoint(w);
			} else {
				out += decode_error;
			}
		};
		var i = 0;
		while(i < size) {
			var c = str[i];
			if(c <= 127) {
				out += String.fromCodePoint(c);
				++i;
			} else if(c <= 223) {
				bytes = 2;
				push_sequence(31,c,i,bytes);
				i += bytes;
			} else if(c <= 239) {
				bytes = 3;
				push_sequence(15,c,i,bytes);
				i += bytes;
			} else if(c <= 247) {
				bytes = 4;
				push_sequence(7,c,i,bytes);
				i += bytes;
			} else {
				out += decode_error;
				++i;
			}
		}
		return out;
	}
	,respone2bytesString: function(str,size) {
		var out = "";
		var _g = 0;
		var _g1 = size;
		while(_g < _g1) {
			var i = _g++;
			out += String.fromCodePoint(str[i]);
		}
		return out;
	}
	,__class__: HttpCustom
});
var HttpSupport = function() { };
HttpSupport.__name__ = true;
HttpSupport.overrideXMLHttpRequest = function() {
	HttpSupport.XMLHttpRequestOverriden = true;
	
			XMLHttpRequest.prototype.realSend = XMLHttpRequest.prototype.send;
			var newSend = function(vData) { this.withCredentials = HttpSupport.CORSCredentialsEnabled; this.realSend(vData); };
			XMLHttpRequest.prototype.send = newSend;
		;
};
HttpSupport.isBinflow = function(url) {
	var binflow_pos = url.indexOf(".binflow");
	var q_pos = url.indexOf("?");
	if(binflow_pos > 0) {
		if(q_pos > 0) {
			return binflow_pos < q_pos;
		} else {
			return true;
		}
	} else {
		return false;
	}
};
HttpSupport.doBinflowHttpRequest = function(url,onDataFn,onErrorFn,onProgressFn,onStatusFn) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET",url,true);
	xhr.responseType = "arraybuffer";
	xhr.onload = function(oEvent) {
		if(onStatusFn != null) {
			onStatusFn(xhr.status);
		}
		if(xhr.status != 200) {
			onErrorFn("HTTP error : " + xhr.status);
			return;
		}
		var arr = new Uint8Array(xhr.response);
		if(xhr.response.byteLength >= 2) {
			onDataFn(new JSBinflowBuffer(xhr.response,2,xhr.response.byteLength - 2,arr[0] == 255));
		} else {
			onDataFn(new JSBinflowBuffer(xhr.response,0,0,true));
		}
	};
	xhr.addEventListener("error",function(e) {
		onErrorFn("IO error");
	},false);
	if(onProgressFn != null) {
		xhr.addEventListener("progress",function(e) {
			if(e.lengthComputable) {
				onProgressFn(e.loaded,e.total);
			}
		},false);
	}
	xhr.send(null);
};
HttpSupport.doBinaryHttpRequest = function(url,onDataFn,onErrorFn,onProgressFn,onStatusFn) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET",url,true);
	xhr.responseType = "arraybuffer";
	xhr.onload = function(oEvent) {
		if(onStatusFn != null) {
			onStatusFn(xhr.status);
		}
		if(xhr.status != 200) {
			onErrorFn("HTTP error : " + xhr.status);
			return;
		}
		var arr = new Uint8Array(xhr.response);
		onDataFn(arr);
	};
	xhr.addEventListener("error",function(e) {
		onErrorFn("IO error");
	},false);
	if(onProgressFn != null) {
		xhr.addEventListener("progress",function(e) {
			if(e.lengthComputable) {
				onProgressFn(e.loaded,e.total);
			}
		},false);
	}
	xhr.send(null);
};
HttpSupport.enableCORSCredentials = function(enabled) {
	HttpSupport.CORSCredentialsEnabled = enabled;
};
HttpSupport.printHttpRequestDetails = function(url,params) {
	Native.println("======= HTTP request details:");
	Native.println("URL: " + url);
	Native.println("Parameters: ");
	var _g = 0;
	while(_g < params.length) {
		var param = params[_g];
		++_g;
		Native.println(param[0] + ": " + param[1]);
	}
	Native.println("=======");
};
HttpSupport.httpRequest = function(url,post,headers,params,onDataFn,onErrorFn,onStatusFn,request) {
	if(!HttpSupport.XMLHttpRequestOverriden) {
		HttpSupport.overrideXMLHttpRequest();
	}
	if(HttpSupport.isBinflow(url) && Util.getParameter("arraybuffer") != "0") {
		var query = Lambda.fold(params,function(kv,query) {
			return query + "&" + kv[0] + "=" + kv[1];
		},"");
		if(url.indexOf("?") < 0) {
			query = "?" + query;
		} else {
			query = "&" + query;
		}
		HttpSupport.doBinflowHttpRequest(url + query,onDataFn,onErrorFn,null,onStatusFn);
		return;
	}
	var handled = false;
	var http = new haxe_http_HttpJs(url);
	var checkTimeout = function() {
		if(!handled) {
			handled = true;
			onErrorFn(url + ": request timed out");
			http.cancel();
		}
	};
	var timeoutInspector = haxe_Timer.delay(checkTimeout,HttpSupport.TimeoutInterval);
	var stopTimer = function() {
		timeoutInspector.stop();
	};
	http.onData = function(res) {
		if(!handled) {
			handled = true;
			stopTimer();
			try {
				onDataFn(res);
			} catch( _g ) {
				haxe_NativeStackTrace.lastError = _g;
				var e = haxe_Exception.caught(_g).unwrap();
				Native.println("FATAL ERROR: http.onData reported: " + Std.string(e));
				HttpSupport.printHttpRequestDetails(url,params);
				Assert.printExnStack("Trace: :");
				Native.callFlowCrashHandlers("[HTTP onData]: " + Std.string(e));
			}
		}
	};
	http.onError = function(err) {
		if(!handled) {
			handled = true;
			stopTimer();
			try {
				onErrorFn(err);
			} catch( _g ) {
				haxe_NativeStackTrace.lastError = _g;
				var e = haxe_Exception.caught(_g).unwrap();
				Native.println("FATAL ERROR: http.onError reported: " + Std.string(e));
				HttpSupport.printHttpRequestDetails(url,params);
				Assert.printExnStack("Trace: :");
				Native.callFlowCrashHandlers("[HTTP onError]: " + Std.string(e));
			}
		}
	};
	http.onStatus = function(status) {
		if(!handled) {
			try {
				onStatusFn(status);
			} catch( _g ) {
				haxe_NativeStackTrace.lastError = _g;
				var e = haxe_Exception.caught(_g).unwrap();
				Native.println("FATAL ERROR: http.onStatus reported: " + Std.string(e));
				HttpSupport.printHttpRequestDetails(url,params);
				Assert.printExnStack("Trace: :");
				Native.callFlowCrashHandlers("[HTTP onStatus]: " + Std.string(e));
			}
			if(status < 200 || status >= 400) {
				Errors.report("Http request to " + url + " returned status: " + status);
			}
		}
	};
	var _g = 0;
	while(_g < params.length) {
		var param = params[_g];
		++_g;
		http.setParameter(param[0],param[1]);
	}
	var _g = 0;
	while(_g < headers.length) {
		var header = headers[_g];
		++_g;
		http.setHeader(header[0],header[1]);
	}
	http.async = true;
	http.request(post);
};
HttpSupport.httpCustomRequestNative = function(url,method,headers,params,data,responseEncoding,onResponseFn,async,request) {
	if(HttpSupport.defaultResponseEncoding != null && responseEncoding == "auto") {
		responseEncoding = HttpSupport.defaultResponseEncoding;
	}
	if((method == "DELETE" || method == "PATCH" || method == "PUT") && !Lambda.exists(headers,function(h) {
		return h[0] == "If-Match";
	})) {
		headers.push(["If-Match","*"]);
	}
	var handled = false;
	var http = new HttpCustom(url,method);
	var checkTimeout = function() {
		if(!handled) {
			handled = true;
			onResponseFn(408,url + ": request timed out",[]);
			http.cancel();
		}
	};
	var timeoutInspector = haxe_Timer.delay(checkTimeout,HttpSupport.TimeoutInterval);
	if(data != "") {
		http.setPostData(data);
	}
	if(!HttpSupport.XMLHttpRequestOverriden) {
		HttpSupport.overrideXMLHttpRequest();
	}
	if(HttpSupport.isBinflow(url) && Util.getParameter("arraybuffer") != "0") {
		var query = Lambda.fold(params,function(kv,query) {
			return query + "&" + kv[0] + "=" + kv[1];
		},"");
		if(url.indexOf("?") < 0) {
			query = "?" + query;
		} else {
			query = "&" + query;
		}
		var responseStatus = 0;
		var onStatusFn = function(status) {
			responseStatus = status;
		};
		var onDataFn = function(data) {
			onResponseFn(responseStatus,data,[]);
		};
		HttpSupport.doBinflowHttpRequest(url + query,onDataFn,onDataFn,null,onStatusFn);
		return;
	}
	http.onResponse = function(status,data,headers) {
		if(!handled) {
			handled = true;
			try {
				timeoutInspector.stop();
				onResponseFn(status,data,headers);
			} catch( _g ) {
				haxe_NativeStackTrace.lastError = _g;
				var e = haxe_Exception.caught(_g).unwrap();
				Native.println("FATAL ERROR: http.onResponse reported: " + Std.string(e));
				HttpSupport.printHttpRequestDetails(url,params);
				Assert.printExnStack("Trace: :");
				Native.callFlowCrashHandlers("[HTTP onResponse]: " + Std.string(e));
			}
			if(status < 200 || status >= 400) {
				Errors.report("Http request to " + url + " returned status: " + status);
			}
		}
	};
	var _g = 0;
	while(_g < params.length) {
		var param = params[_g];
		++_g;
		http.setParameter(param[0],param[1]);
	}
	var _g = 0;
	while(_g < headers.length) {
		var header = headers[_g];
		++_g;
		http.setHeader(header[0],header[1]);
	}
	http.async = async;
	http.requestExt(method == "POST",responseEncoding);
};
HttpSupport.preloadMediaUrl = function(url,onSuccessFn,onErrorFn) {
};
HttpSupport.downloadFile = function(url,onDataFn,onErrorFn,onProgressFn) {
	if(HttpSupport.isBinflow(url) && Util.getParameter("arraybuffer") != "0") {
		HttpSupport.doBinflowHttpRequest(url,onDataFn,onErrorFn,onProgressFn,null);
	} else {
		var loader = new XMLHttpRequest();
		loader.addEventListener("load",function(e) {
			if(loader.status == 200) {
				onDataFn(loader.responseText);
			} else {
				onErrorFn("HTTP error : " + loader.status);
			}
		},false);
		loader.addEventListener("error",function(e) {
			onErrorFn("IO error");
		},false);
		loader.addEventListener("progress",function(e) {
			if(e.lengthComputable) {
				onProgressFn(e.loaded,e.total);
			}
		},false);
		loader.open("GET",url,true);
		loader.send("");
	}
};
HttpSupport.uploadNativeFile = function(file,url,params,headers,onOpenFn,onDataFn,onErrorFn,onProgressFn,onCancelFn) {
	var cancelFn = function() {
	};
	var xhr = new XMLHttpRequest();
	xhr.open("POST",url,true);
	onOpenFn();
	xhr.onload = xhr.onerror = function() {
		if(xhr.status != 200) {
			onErrorFn("" + Std.string(xhr.status));
		} else {
			onDataFn(xhr.responseText);
		}
	};
	xhr.upload.onprogress = function(event) {
		onProgressFn(event.loaded,event.total);
	};
	var form_data = new FormData();
	form_data.append("Filename",file.name);
	var payloadName = "Filedata";
	var _g = 0;
	while(_g < params.length) {
		var p = params[_g];
		++_g;
		if(p[0] != "uploadDataFieldName") {
			form_data.append(p[0],p[1]);
		} else {
			payloadName = p[1];
		}
	}
	form_data.append(payloadName,file,file.name);
	var _g = 0;
	while(_g < headers.length) {
		var header = headers[_g];
		++_g;
		xhr.setRequestHeader(header[0],header[1]);
	}
	cancelFn = function() {
		xhr.abort();
	};
	xhr.send(form_data);
	return cancelFn;
};
HttpSupport.removeUrlFromCache = function(url) {
};
HttpSupport.clearUrlCache = function() {
};
HttpSupport.sendHttpRequestWithAttachments = function(url,headers,params,attachments,onDataFn,onErrorFn) {
};
HttpSupport.setDefaultResponseEncoding = function(responseEncoding) {
	HttpSupport.defaultResponseEncoding = responseEncoding;
	var encodingName = "";
	if(responseEncoding == "auto") {
		encodingName = "auto";
	} else if(responseEncoding == "utf8_js") {
		encodingName = "utf8 with surrogate pairs";
	} else if(responseEncoding == "utf8") {
		encodingName = "utf8 without surrogate pairs";
	} else if(responseEncoding == "byte") {
		encodingName = "raw byte";
	} else {
		encodingName = "auto";
	}
	Native.println("Default response encoding switched to '" + encodingName + "'");
};
var JSBinflowBuffer = function(buffer,byte_offset,byte_length,little_endian) {
	this.StructFixupCache = new haxe_ds_StringMap();
	this.StructDefs = [];
	this.arrayBuffer = buffer;
	this.byteOffset = byte_offset;
	this.byteLength = byte_length;
	this.littleEndian = little_endian;
	this.dataView = new DataView(buffer,this.byteOffset,this.byteLength);
	this.length = this.byteLength / 2 | 0;
};
JSBinflowBuffer.__name__ = true;
JSBinflowBuffer.prototype = {
	getWord: function(idx) {
		return this.dataView.getUint16(idx * 2,this.littleEndian);
	}
	,getInt: function(idx) {
		return this.dataView.getUint16(idx * 2,this.littleEndian) | this.dataView.getUint16((idx + 1) * 2,this.littleEndian) << 16;
	}
	,getDouble: function(idx) {
		if(this.littleEndian) {
			return this.dataView.getFloat64(idx * 2,true);
		} else {
			JSBinflowBuffer.DoubleSwapBuffer.setUint16(0,this.dataView.getUint16(idx * 2,this.littleEndian),true);
			JSBinflowBuffer.DoubleSwapBuffer.setUint16(2,this.dataView.getUint16((idx + 1) * 2,this.littleEndian),true);
			JSBinflowBuffer.DoubleSwapBuffer.setUint16(4,this.dataView.getUint16((idx + 2) * 2,this.littleEndian),true);
			JSBinflowBuffer.DoubleSwapBuffer.setUint16(6,this.dataView.getUint16((idx + 3) * 2,this.littleEndian),true);
			return JSBinflowBuffer.DoubleSwapBuffer.getFloat64(0,true);
		}
	}
	,substr: function(idx,l) {
		var s_b = "";
		var _g = idx;
		var _g1 = idx + l;
		while(_g < _g1) {
			var i = _g++;
			var c = this.dataView.getUint16(i * 2,this.littleEndian);
			s_b += String.fromCodePoint(c);
		}
		return s_b;
	}
	,charAt: function(idx) {
		var s_b = "";
		var _g = idx;
		var _g1 = idx + 1;
		while(_g < _g1) {
			var i = _g++;
			var c = this.dataView.getUint16(i * 2,this.littleEndian);
			s_b += String.fromCodePoint(c);
		}
		return s_b;
	}
	,getFooterOffset: function() {
		var footer_offset = this.dataView.getUint16(0,this.littleEndian) | this.dataView.getUint16(2,this.littleEndian) << 16;
		if(footer_offset != 1) {
			return [footer_offset,2];
		} else {
			return [this.dataView.getUint16(4,this.littleEndian) | this.dataView.getUint16(6,this.littleEndian) << 16 | (this.dataView.getUint16(8,this.littleEndian) | this.dataView.getUint16(10,this.littleEndian) << 16),6];
		}
	}
	,getFixup: function(name) {
		var chached_fixup = this.StructFixupCache.h[name];
		if(chached_fixup === undefined) {
			var fixup = this.Fixups(name);
			chached_fixup = HaxeRuntime._structnames_.h[fixup._id] == "None" ? null : Reflect.field(fixup,HaxeRuntime._structargs_.h[fixup._id][0]);
			this.StructFixupCache.h[name] = chached_fixup;
		}
		return chached_fixup;
	}
	,doArray: function(index,n) {
		var ni = index;
		var ar = [];
		var _g = 0;
		var _g1 = n;
		while(_g < _g1) {
			var i = _g++;
			var v = this.doBinary(ni);
			ni = v[1];
			ar.push(v[0]);
		}
		return [ar,ni];
	}
	,doBinary: function(index) {
		if(index < this.endIndex) {
			var word = this.dataView.getUint16(index * 2,this.littleEndian);
			var ni = index + 1;
			if(word == 65524) {
				var def = this.StructDefs[this.dataView.getUint16(ni * 2,this.littleEndian)];
				var name = def[1];
				var ni1 = ni + 1;
				var ar = [];
				var _g = 0;
				var _g1 = def[0];
				while(_g < _g1) {
					var i = _g++;
					var v = this.doBinary(ni1);
					ni1 = v[1];
					ar.push(v[0]);
				}
				var args = [ar,ni1];
				var chached_fixup = this.StructFixupCache.h[name];
				if(chached_fixup === undefined) {
					var fixup = this.Fixups(name);
					chached_fixup = HaxeRuntime._structnames_.h[fixup._id] == "None" ? null : Reflect.field(fixup,HaxeRuntime._structargs_.h[fixup._id][0]);
					this.StructFixupCache.h[name] = chached_fixup;
				}
				var fixup = chached_fixup;
				var val = fixup == null ? HaxeRuntime.makeStructValue(name,args[0],JSBinflowBuffer.FlowIllegalStruct) : fixup(args[0]);
				return [val,args[1]];
			} else if(word == 65526) {
				var v = this.doBinary(ni);
				return [new FlowRefObject(v[0]),v[1]];
			} else if(word == 65530) {
				var l = this.dataView.getUint16(ni * 2,this.littleEndian);
				var idx = ni + 1;
				var s_b = "";
				var _g = idx;
				var _g1 = idx + l;
				while(_g < _g1) {
					var i = _g++;
					var c = this.dataView.getUint16(i * 2,this.littleEndian);
					s_b += String.fromCodePoint(c);
				}
				return [s_b,ni + 1 + l];
			} else if(word == 65532) {
				var d;
				if(this.littleEndian) {
					d = this.dataView.getFloat64(ni * 2,true);
				} else {
					JSBinflowBuffer.DoubleSwapBuffer.setUint16(0,this.dataView.getUint16(ni * 2,this.littleEndian),true);
					JSBinflowBuffer.DoubleSwapBuffer.setUint16(2,this.dataView.getUint16((ni + 1) * 2,this.littleEndian),true);
					JSBinflowBuffer.DoubleSwapBuffer.setUint16(4,this.dataView.getUint16((ni + 2) * 2,this.littleEndian),true);
					JSBinflowBuffer.DoubleSwapBuffer.setUint16(6,this.dataView.getUint16((ni + 3) * 2,this.littleEndian),true);
					d = JSBinflowBuffer.DoubleSwapBuffer.getFloat64(0,true);
				}
				return [d,ni + 4];
			} else if(word == 65525) {
				var i = this.dataView.getUint16(ni * 2,this.littleEndian) | this.dataView.getUint16((ni + 1) * 2,this.littleEndian) << 16;
				return [i,ni + 2];
			} else if(word < 65523) {
				return [word,ni];
			} else if(word == 65523) {
				var idx = ni + 2;
				return [this.dataView.getUint16(ni * 2,this.littleEndian) | this.dataView.getUint16((ni + 1) * 2,this.littleEndian) << 16 | (this.dataView.getUint16(idx * 2,this.littleEndian) | this.dataView.getUint16((idx + 1) * 2,this.littleEndian) << 16),ni + 4];
			} else if(word == 65533) {
				return [false,ni];
			} else if(word == 65534) {
				return [true,ni];
			} else if(word == 65528) {
				var l = this.dataView.getUint16(ni * 2,this.littleEndian);
				var ni1 = ni + 1;
				var ar = [];
				var _g = 0;
				var _g1 = l;
				while(_g < _g1) {
					var i = _g++;
					var v = this.doBinary(ni1);
					ni1 = v[1];
					ar.push(v[0]);
				}
				var result = [ar,ni1];
				return result;
			} else if(word == 65527) {
				return [[],ni];
			} else if(word == 65531) {
				var l = this.dataView.getUint16(ni * 2,this.littleEndian) | this.dataView.getUint16((ni + 1) * 2,this.littleEndian) << 16;
				var idx = ni + 2;
				var s_b = "";
				var _g = idx;
				var _g1 = idx + l;
				while(_g < _g1) {
					var i = _g++;
					var c = this.dataView.getUint16(i * 2,this.littleEndian);
					s_b += String.fromCodePoint(c);
				}
				return [s_b,ni + 2 + l];
			} else if(word == 65529) {
				var l = this.dataView.getUint16(ni * 2,this.littleEndian) | this.dataView.getUint16((ni + 1) * 2,this.littleEndian) << 16;
				var ni1 = ni + 2;
				var ar = [];
				var _g = 0;
				var _g1 = l;
				while(_g < _g1) {
					var i = _g++;
					var v = this.doBinary(ni1);
					ni1 = v[1];
					ar.push(v[0]);
				}
				var result = [ar,ni1];
				return result;
			} else if(word == 65535) {
				return [null,ni];
			} else {
				return [word,ni];
			}
		} else {
			return [this.DefValue,index];
		}
	}
	,deserialise: function(defvalue,fixups) {
		if(JSBinflowBuffer.FlowIllegalStruct == null) {
			JSBinflowBuffer.FlowIllegalStruct = HaxeRuntime.makeStructValue("IllegalStruct",[],null);
		}
		var footer_offset = this.getFooterOffset();
		this.endIndex = this.length;
		this.StructDefs = this.doBinary(footer_offset[0])[0];
		this.DefValue = defvalue;
		this.Fixups = fixups;
		this.endIndex = footer_offset[0];
		var r = this.doBinary(footer_offset[1]);
		if(r[1] < footer_offset[0]) {
			Errors.print("Did not understand all!");
		}
		return r[0];
	}
	,__class__: JSBinflowBuffer
};
var JsMd5 = function(s) {
	this.input = s;
	this.inputBytes = 0;
	this.nextCharIndex = 0;
	this.bytesStorage = 0;
	this.bytesInStorage = 0;
	var i = 0;
	while(i < s.length) {
		var c = s.charCodeAt(i++);
		if(55296 <= c && c <= 56319) {
			c = c - 55232 << 10 | s.charCodeAt(i++) & 1023;
		}
		if(c <= 127) {
			this.inputBytes++;
		} else if(c <= 2047) {
			this.inputBytes += 2;
		} else if(c <= 65535) {
			this.inputBytes += 3;
		} else {
			this.inputBytes += 4;
		}
	}
};
JsMd5.__name__ = true;
JsMd5.encode = function(s) {
	var m = new JsMd5(s);
	var h = m.doEncode();
	return m.hex(h);
};
JsMd5.prototype = {
	bitOR: function(a,b) {
		var lsb = a & 1 | b & 1;
		var msb31 = a >>> 1 | b >>> 1;
		return msb31 << 1 | lsb;
	}
	,bitXOR: function(a,b) {
		var lsb = a & 1 ^ b & 1;
		var msb31 = a >>> 1 ^ b >>> 1;
		return msb31 << 1 | lsb;
	}
	,bitAND: function(a,b) {
		var lsb = a & 1 & (b & 1);
		var msb31 = a >>> 1 & b >>> 1;
		return msb31 << 1 | lsb;
	}
	,addme: function(x,y) {
		var lsw = (x & 65535) + (y & 65535);
		var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
		return msw << 16 | lsw & 65535;
	}
	,hex: function(a) {
		var str = "";
		var hex_chr = "0123456789abcdef";
		var _g = 0;
		while(_g < a.length) {
			var num = a[_g];
			++_g;
			str += hex_chr.charAt(num >> 4 & 15) + hex_chr.charAt(num & 15);
			str += hex_chr.charAt(num >> 12 & 15) + hex_chr.charAt(num >> 8 & 15);
			str += hex_chr.charAt(num >> 20 & 15) + hex_chr.charAt(num >> 16 & 15);
			str += hex_chr.charAt(num >> 28 & 15) + hex_chr.charAt(num >> 24 & 15);
		}
		return str;
	}
	,rol: function(num,cnt) {
		return num << cnt | num >>> 32 - cnt;
	}
	,cmn: function(q,a,b,x,s,t) {
		return this.addme(this.rol(this.addme(this.addme(a,q),this.addme(x,t)),s),b);
	}
	,ff: function(a,b,c,d,x,s,t) {
		return this.cmn(this.bitOR(this.bitAND(b,c),this.bitAND(~b,d)),a,b,x,s,t);
	}
	,gg: function(a,b,c,d,x,s,t) {
		return this.cmn(this.bitOR(this.bitAND(b,d),this.bitAND(c,~d)),a,b,x,s,t);
	}
	,hh: function(a,b,c,d,x,s,t) {
		return this.cmn(this.bitXOR(this.bitXOR(b,c),d),a,b,x,s,t);
	}
	,ii: function(a,b,c,d,x,s,t) {
		return this.cmn(this.bitXOR(c,this.bitOR(b,~d)),a,b,x,s,t);
	}
	,getNextByte: function() {
		if(this.bytesInStorage != 0) {
			this.bytesInStorage--;
			var result = this.bytesStorage & 255;
			this.bytesStorage >>= 8;
			return result;
		}
		var result = 0;
		if(this.nextCharIndex >= this.input.length) {
			return result;
		}
		var c = this.input.charCodeAt(this.nextCharIndex++);
		if(55296 <= c && c <= 56319) {
			c = c - 55232 << 10 | this.input.charCodeAt(this.nextCharIndex++) & 1023;
		}
		if(c <= 127) {
			result = c;
		} else if(c <= 2047) {
			result = 192 | c >> 6;
			this.bytesInStorage = 1;
			this.bytesStorage = 128 | c & 63;
		} else if(c <= 65535) {
			result = 224 | c >> 12;
			this.bytesInStorage = 2;
			this.bytesStorage = 128 | c >> 6 & 63 | (128 | c & 63) << 8;
		} else {
			result = 240 | c >> 18;
			this.bytesInStorage = 3;
			this.bytesStorage = 128 | c >> 12 & 63 | (128 | c >> 6 & 63) << 8 | (128 | c & 63) << 16;
		}
		return result;
	}
	,setBlockData: function(x,blockNumber,numberOfBlocks) {
		var _gthis = this;
		var i = 0;
		var byteOffset = blockNumber << 6;
		var getByte = function(idx) {
			if(idx < _gthis.inputBytes) {
				return _gthis.getNextByte();
			} else if(idx == _gthis.inputBytes) {
				return 128;
			} else {
				return 0;
			}
		};
		var _g = 0;
		while(_g < 16) {
			var i = _g++;
			if(blockNumber + 1 == numberOfBlocks && i == 14) {
				x[i] = this.inputBytes << 3;
			} else {
				x[i] = getByte(byteOffset) | getByte(byteOffset + 1) << 8 | getByte(byteOffset + 2) << 16 | getByte(byteOffset + 3) << 24;
			}
			byteOffset += 4;
		}
	}
	,doEncode: function() {
		var a = 1732584193;
		var b = -271733879;
		var c = -1732584194;
		var d = 271733878;
		var step;
		this.nextCharIndex = 0;
		this.bytesStorage = 0;
		this.bytesInStorage = 0;
		var numberOfBlocks = (this.inputBytes + 8 >> 6) + 1;
		var this1 = new Array(16);
		var x = this1;
		var blockNumber = 0;
		while(blockNumber < numberOfBlocks) {
			var olda = a;
			var oldb = b;
			var oldc = c;
			var oldd = d;
			this.setBlockData(x,blockNumber,numberOfBlocks);
			step = 0;
			a = this.ff(a,b,c,d,x[0],7,-680876936);
			d = this.ff(d,a,b,c,x[1],12,-389564586);
			c = this.ff(c,d,a,b,x[2],17,606105819);
			b = this.ff(b,c,d,a,x[3],22,-1044525330);
			a = this.ff(a,b,c,d,x[4],7,-176418897);
			d = this.ff(d,a,b,c,x[5],12,1200080426);
			c = this.ff(c,d,a,b,x[6],17,-1473231341);
			b = this.ff(b,c,d,a,x[7],22,-45705983);
			a = this.ff(a,b,c,d,x[8],7,1770035416);
			d = this.ff(d,a,b,c,x[9],12,-1958414417);
			c = this.ff(c,d,a,b,x[10],17,-42063);
			b = this.ff(b,c,d,a,x[11],22,-1990404162);
			a = this.ff(a,b,c,d,x[12],7,1804603682);
			d = this.ff(d,a,b,c,x[13],12,-40341101);
			c = this.ff(c,d,a,b,x[14],17,-1502002290);
			b = this.ff(b,c,d,a,x[15],22,1236535329);
			a = this.gg(a,b,c,d,x[1],5,-165796510);
			d = this.gg(d,a,b,c,x[6],9,-1069501632);
			c = this.gg(c,d,a,b,x[11],14,643717713);
			b = this.gg(b,c,d,a,x[0],20,-373897302);
			a = this.gg(a,b,c,d,x[5],5,-701558691);
			d = this.gg(d,a,b,c,x[10],9,38016083);
			c = this.gg(c,d,a,b,x[15],14,-660478335);
			b = this.gg(b,c,d,a,x[4],20,-405537848);
			a = this.gg(a,b,c,d,x[9],5,568446438);
			d = this.gg(d,a,b,c,x[14],9,-1019803690);
			c = this.gg(c,d,a,b,x[3],14,-187363961);
			b = this.gg(b,c,d,a,x[8],20,1163531501);
			a = this.gg(a,b,c,d,x[13],5,-1444681467);
			d = this.gg(d,a,b,c,x[2],9,-51403784);
			c = this.gg(c,d,a,b,x[7],14,1735328473);
			b = this.gg(b,c,d,a,x[12],20,-1926607734);
			a = this.hh(a,b,c,d,x[5],4,-378558);
			d = this.hh(d,a,b,c,x[8],11,-2022574463);
			c = this.hh(c,d,a,b,x[11],16,1839030562);
			b = this.hh(b,c,d,a,x[14],23,-35309556);
			a = this.hh(a,b,c,d,x[1],4,-1530992060);
			d = this.hh(d,a,b,c,x[4],11,1272893353);
			c = this.hh(c,d,a,b,x[7],16,-155497632);
			b = this.hh(b,c,d,a,x[10],23,-1094730640);
			a = this.hh(a,b,c,d,x[13],4,681279174);
			d = this.hh(d,a,b,c,x[0],11,-358537222);
			c = this.hh(c,d,a,b,x[3],16,-722521979);
			b = this.hh(b,c,d,a,x[6],23,76029189);
			a = this.hh(a,b,c,d,x[9],4,-640364487);
			d = this.hh(d,a,b,c,x[12],11,-421815835);
			c = this.hh(c,d,a,b,x[15],16,530742520);
			b = this.hh(b,c,d,a,x[2],23,-995338651);
			a = this.ii(a,b,c,d,x[0],6,-198630844);
			d = this.ii(d,a,b,c,x[7],10,1126891415);
			c = this.ii(c,d,a,b,x[14],15,-1416354905);
			b = this.ii(b,c,d,a,x[5],21,-57434055);
			a = this.ii(a,b,c,d,x[12],6,1700485571);
			d = this.ii(d,a,b,c,x[3],10,-1894986606);
			c = this.ii(c,d,a,b,x[10],15,-1051523);
			b = this.ii(b,c,d,a,x[1],21,-2054922799);
			a = this.ii(a,b,c,d,x[8],6,1873313359);
			d = this.ii(d,a,b,c,x[15],10,-30611744);
			c = this.ii(c,d,a,b,x[6],15,-1560198380);
			b = this.ii(b,c,d,a,x[13],21,1309151649);
			a = this.ii(a,b,c,d,x[4],6,-145523070);
			d = this.ii(d,a,b,c,x[11],10,-1120210379);
			c = this.ii(c,d,a,b,x[2],15,718787259);
			b = this.ii(b,c,d,a,x[9],21,-343485551);
			a = this.addme(a,olda);
			b = this.addme(b,oldb);
			c = this.addme(c,oldc);
			d = this.addme(d,oldd);
			++blockNumber;
		}
		return [a,b,c,d];
	}
	,__class__: JsMd5
};
var MacroUtils = function() { };
MacroUtils.__name__ = true;
var Md5 = function() {
};
Md5.__name__ = true;
Md5.encode = function(s) {
	return Md5.inst.doEncode(s);
};
Md5.bitOR = function(a,b) {
	var lsb = a & 1 | b & 1;
	var msb31 = a >>> 1 | b >>> 1;
	return msb31 << 1 | lsb;
};
Md5.bitXOR = function(a,b) {
	var lsb = a & 1 ^ b & 1;
	var msb31 = a >>> 1 ^ b >>> 1;
	return msb31 << 1 | lsb;
};
Md5.bitAND = function(a,b) {
	var lsb = a & 1 & (b & 1);
	var msb31 = a >>> 1 & b >>> 1;
	return msb31 << 1 | lsb;
};
Md5.addme = function(x,y) {
	var lsw = (x & 65535) + (y & 65535);
	var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
	return msw << 16 | lsw & 65535;
};
Md5.rhex = function(num) {
	var str = "";
	var hex_chr = "0123456789abcdef";
	str += hex_chr.charAt(num >> 4 & 15) + hex_chr.charAt(num & 15);
	str += hex_chr.charAt(num >> 12 & 15) + hex_chr.charAt(num >> 8 & 15);
	str += hex_chr.charAt(num >> 20 & 15) + hex_chr.charAt(num >> 16 & 15);
	str += hex_chr.charAt(num >> 28 & 15) + hex_chr.charAt(num >> 24 & 15);
	return str;
};
Md5.rol = function(num,cnt) {
	return num << cnt | num >>> 32 - cnt;
};
Md5.cmn = function(q,a,b,x,s,t) {
	var lsw = (a & 65535) + (q & 65535);
	var msw = (a >> 16) + (q >> 16) + (lsw >> 16);
	var x1 = msw << 16 | lsw & 65535;
	var lsw = (x & 65535) + (t & 65535);
	var msw = (x >> 16) + (t >> 16) + (lsw >> 16);
	var y = msw << 16 | lsw & 65535;
	var lsw = (x1 & 65535) + (y & 65535);
	var msw = (x1 >> 16) + (y >> 16) + (lsw >> 16);
	var num = msw << 16 | lsw & 65535;
	var x = num << s | num >>> 32 - s;
	var lsw = (x & 65535) + (b & 65535);
	var msw = (x >> 16) + (b >> 16) + (lsw >> 16);
	return msw << 16 | lsw & 65535;
};
Md5.ff = function(a,b,c,d,x,s,t) {
	var lsb = b & 1 & (c & 1);
	var msb31 = b >>> 1 & c >>> 1;
	var a1 = msb31 << 1 | lsb;
	var a2 = ~b;
	var lsb = a2 & 1 & (d & 1);
	var msb31 = a2 >>> 1 & d >>> 1;
	var b1 = msb31 << 1 | lsb;
	var lsb = a1 & 1 | b1 & 1;
	var msb31 = a1 >>> 1 | b1 >>> 1;
	var q = msb31 << 1 | lsb;
	var lsw = (a & 65535) + (q & 65535);
	var msw = (a >> 16) + (q >> 16) + (lsw >> 16);
	var x1 = msw << 16 | lsw & 65535;
	var lsw = (x & 65535) + (t & 65535);
	var msw = (x >> 16) + (t >> 16) + (lsw >> 16);
	var y = msw << 16 | lsw & 65535;
	var lsw = (x1 & 65535) + (y & 65535);
	var msw = (x1 >> 16) + (y >> 16) + (lsw >> 16);
	var num = msw << 16 | lsw & 65535;
	var x = num << s | num >>> 32 - s;
	var lsw = (x & 65535) + (b & 65535);
	var msw = (x >> 16) + (b >> 16) + (lsw >> 16);
	return msw << 16 | lsw & 65535;
};
Md5.gg = function(a,b,c,d,x,s,t) {
	var lsb = b & 1 & (d & 1);
	var msb31 = b >>> 1 & d >>> 1;
	var a1 = msb31 << 1 | lsb;
	var b1 = ~d;
	var lsb = c & 1 & (b1 & 1);
	var msb31 = c >>> 1 & b1 >>> 1;
	var b1 = msb31 << 1 | lsb;
	var lsb = a1 & 1 | b1 & 1;
	var msb31 = a1 >>> 1 | b1 >>> 1;
	var q = msb31 << 1 | lsb;
	var lsw = (a & 65535) + (q & 65535);
	var msw = (a >> 16) + (q >> 16) + (lsw >> 16);
	var x1 = msw << 16 | lsw & 65535;
	var lsw = (x & 65535) + (t & 65535);
	var msw = (x >> 16) + (t >> 16) + (lsw >> 16);
	var y = msw << 16 | lsw & 65535;
	var lsw = (x1 & 65535) + (y & 65535);
	var msw = (x1 >> 16) + (y >> 16) + (lsw >> 16);
	var num = msw << 16 | lsw & 65535;
	var x = num << s | num >>> 32 - s;
	var lsw = (x & 65535) + (b & 65535);
	var msw = (x >> 16) + (b >> 16) + (lsw >> 16);
	return msw << 16 | lsw & 65535;
};
Md5.hh = function(a,b,c,d,x,s,t) {
	var lsb = b & 1 ^ c & 1;
	var msb31 = b >>> 1 ^ c >>> 1;
	var a1 = msb31 << 1 | lsb;
	var lsb = a1 & 1 ^ d & 1;
	var msb31 = a1 >>> 1 ^ d >>> 1;
	var q = msb31 << 1 | lsb;
	var lsw = (a & 65535) + (q & 65535);
	var msw = (a >> 16) + (q >> 16) + (lsw >> 16);
	var x1 = msw << 16 | lsw & 65535;
	var lsw = (x & 65535) + (t & 65535);
	var msw = (x >> 16) + (t >> 16) + (lsw >> 16);
	var y = msw << 16 | lsw & 65535;
	var lsw = (x1 & 65535) + (y & 65535);
	var msw = (x1 >> 16) + (y >> 16) + (lsw >> 16);
	var num = msw << 16 | lsw & 65535;
	var x = num << s | num >>> 32 - s;
	var lsw = (x & 65535) + (b & 65535);
	var msw = (x >> 16) + (b >> 16) + (lsw >> 16);
	return msw << 16 | lsw & 65535;
};
Md5.ii = function(a,b,c,d,x,s,t) {
	var b1 = ~d;
	var lsb = b & 1 | b1 & 1;
	var msb31 = b >>> 1 | b1 >>> 1;
	var b1 = msb31 << 1 | lsb;
	var lsb = c & 1 ^ b1 & 1;
	var msb31 = c >>> 1 ^ b1 >>> 1;
	var q = msb31 << 1 | lsb;
	var lsw = (a & 65535) + (q & 65535);
	var msw = (a >> 16) + (q >> 16) + (lsw >> 16);
	var x1 = msw << 16 | lsw & 65535;
	var lsw = (x & 65535) + (t & 65535);
	var msw = (x >> 16) + (t >> 16) + (lsw >> 16);
	var y = msw << 16 | lsw & 65535;
	var lsw = (x1 & 65535) + (y & 65535);
	var msw = (x1 >> 16) + (y >> 16) + (lsw >> 16);
	var num = msw << 16 | lsw & 65535;
	var x = num << s | num >>> 32 - s;
	var lsw = (x & 65535) + (b & 65535);
	var msw = (x >> 16) + (b >> 16) + (lsw >> 16);
	return msw << 16 | lsw & 65535;
};
Md5.prototype = {
	str2blks: function(str) {
		var nblk = (str.length + 8 >> 6) + 1;
		var blks = [];
		var _g = 0;
		var _g1 = nblk * 16;
		while(_g < _g1) {
			var i = _g++;
			blks[i] = 0;
		}
		var i = 0;
		while(i < str.length) {
			blks[i >> 2] |= HxOverrides.cca(str,i) << (str.length * 8 + i) % 4 * 8;
			++i;
		}
		blks[i >> 2] |= 128 << (str.length * 8 + i) % 4 * 8;
		var l = str.length * 8;
		var k = nblk * 16 - 2;
		blks[k] = l & 255;
		blks[k] |= (l >>> 8 & 255) << 8;
		blks[k] |= (l >>> 16 & 255) << 16;
		blks[k] |= (l >>> 24 & 255) << 24;
		return blks;
	}
	,charCodeAt: function(str,i) {
		return HxOverrides.cca(str,i);
	}
	,doEncode: function(str) {
		var x = this.str2blks(str);
		var a = 1732584193;
		var b = -271733879;
		var c = -1732584194;
		var d = 271733878;
		var step;
		var i = 0;
		while(i < x.length) {
			var olda = a;
			var oldb = b;
			var oldc = c;
			var oldd = d;
			step = 0;
			var x1 = x[i];
			var lsb = b & 1 & (c & 1);
			var msb31 = b >>> 1 & c >>> 1;
			var a1 = msb31 << 1 | lsb;
			var a2 = ~b;
			var lsb1 = a2 & 1 & (d & 1);
			var msb311 = a2 >>> 1 & d >>> 1;
			var b1 = msb311 << 1 | lsb1;
			var lsb2 = a1 & 1 | b1 & 1;
			var msb312 = a1 >>> 1 | b1 >>> 1;
			var q = msb312 << 1 | lsb2;
			var lsw = (a & 65535) + (q & 65535);
			var msw = (a >> 16) + (q >> 16) + (lsw >> 16);
			var x2 = msw << 16 | lsw & 65535;
			var lsw1 = (x1 & 65535) + 42104;
			var msw1 = (x1 >> 16) + (-10390) + (lsw1 >> 16);
			var y = msw1 << 16 | lsw1 & 65535;
			var lsw2 = (x2 & 65535) + (y & 65535);
			var msw2 = (x2 >> 16) + (y >> 16) + (lsw2 >> 16);
			var num = msw2 << 16 | lsw2 & 65535;
			var x3 = num << 7 | num >>> 25;
			var lsw3 = (x3 & 65535) + (b & 65535);
			var msw3 = (x3 >> 16) + (b >> 16) + (lsw3 >> 16);
			a = msw3 << 16 | lsw3 & 65535;
			var x4 = x[i + 1];
			var lsb3 = a & 1 & (b & 1);
			var msb313 = a >>> 1 & b >>> 1;
			var a3 = msb313 << 1 | lsb3;
			var a4 = ~a;
			var lsb4 = a4 & 1 & (c & 1);
			var msb314 = a4 >>> 1 & c >>> 1;
			var b2 = msb314 << 1 | lsb4;
			var lsb5 = a3 & 1 | b2 & 1;
			var msb315 = a3 >>> 1 | b2 >>> 1;
			var q1 = msb315 << 1 | lsb5;
			var lsw4 = (d & 65535) + (q1 & 65535);
			var msw4 = (d >> 16) + (q1 >> 16) + (lsw4 >> 16);
			var x5 = msw4 << 16 | lsw4 & 65535;
			var lsw5 = (x4 & 65535) + 46934;
			var msw5 = (x4 >> 16) + (-5945) + (lsw5 >> 16);
			var y1 = msw5 << 16 | lsw5 & 65535;
			var lsw6 = (x5 & 65535) + (y1 & 65535);
			var msw6 = (x5 >> 16) + (y1 >> 16) + (lsw6 >> 16);
			var num1 = msw6 << 16 | lsw6 & 65535;
			var x6 = num1 << 12 | num1 >>> 20;
			var lsw7 = (x6 & 65535) + (a & 65535);
			var msw7 = (x6 >> 16) + (a >> 16) + (lsw7 >> 16);
			d = msw7 << 16 | lsw7 & 65535;
			var x7 = x[i + 2];
			var lsb6 = d & 1 & (a & 1);
			var msb316 = d >>> 1 & a >>> 1;
			var a5 = msb316 << 1 | lsb6;
			var a6 = ~d;
			var lsb7 = a6 & 1 & (b & 1);
			var msb317 = a6 >>> 1 & b >>> 1;
			var b3 = msb317 << 1 | lsb7;
			var lsb8 = a5 & 1 | b3 & 1;
			var msb318 = a5 >>> 1 | b3 >>> 1;
			var q2 = msb318 << 1 | lsb8;
			var lsw8 = (c & 65535) + (q2 & 65535);
			var msw8 = (c >> 16) + (q2 >> 16) + (lsw8 >> 16);
			var x8 = msw8 << 16 | lsw8 & 65535;
			var lsw9 = (x7 & 65535) + 28891;
			var msw9 = (x7 >> 16) + 9248 + (lsw9 >> 16);
			var y2 = msw9 << 16 | lsw9 & 65535;
			var lsw10 = (x8 & 65535) + (y2 & 65535);
			var msw10 = (x8 >> 16) + (y2 >> 16) + (lsw10 >> 16);
			var num2 = msw10 << 16 | lsw10 & 65535;
			var x9 = num2 << 17 | num2 >>> 15;
			var lsw11 = (x9 & 65535) + (d & 65535);
			var msw11 = (x9 >> 16) + (d >> 16) + (lsw11 >> 16);
			c = msw11 << 16 | lsw11 & 65535;
			var x10 = x[i + 3];
			var lsb9 = c & 1 & (d & 1);
			var msb319 = c >>> 1 & d >>> 1;
			var a7 = msb319 << 1 | lsb9;
			var a8 = ~c;
			var lsb10 = a8 & 1 & (a & 1);
			var msb3110 = a8 >>> 1 & a >>> 1;
			var b4 = msb3110 << 1 | lsb10;
			var lsb11 = a7 & 1 | b4 & 1;
			var msb3111 = a7 >>> 1 | b4 >>> 1;
			var q3 = msb3111 << 1 | lsb11;
			var lsw12 = (b & 65535) + (q3 & 65535);
			var msw12 = (b >> 16) + (q3 >> 16) + (lsw12 >> 16);
			var x11 = msw12 << 16 | lsw12 & 65535;
			var lsw13 = (x10 & 65535) + 52974;
			var msw13 = (x10 >> 16) + (-15939) + (lsw13 >> 16);
			var y3 = msw13 << 16 | lsw13 & 65535;
			var lsw14 = (x11 & 65535) + (y3 & 65535);
			var msw14 = (x11 >> 16) + (y3 >> 16) + (lsw14 >> 16);
			var num3 = msw14 << 16 | lsw14 & 65535;
			var x12 = num3 << 22 | num3 >>> 10;
			var lsw15 = (x12 & 65535) + (c & 65535);
			var msw15 = (x12 >> 16) + (c >> 16) + (lsw15 >> 16);
			b = msw15 << 16 | lsw15 & 65535;
			var x13 = x[i + 4];
			var lsb12 = b & 1 & (c & 1);
			var msb3112 = b >>> 1 & c >>> 1;
			var a9 = msb3112 << 1 | lsb12;
			var a10 = ~b;
			var lsb13 = a10 & 1 & (d & 1);
			var msb3113 = a10 >>> 1 & d >>> 1;
			var b5 = msb3113 << 1 | lsb13;
			var lsb14 = a9 & 1 | b5 & 1;
			var msb3114 = a9 >>> 1 | b5 >>> 1;
			var q4 = msb3114 << 1 | lsb14;
			var lsw16 = (a & 65535) + (q4 & 65535);
			var msw16 = (a >> 16) + (q4 >> 16) + (lsw16 >> 16);
			var x14 = msw16 << 16 | lsw16 & 65535;
			var lsw17 = (x13 & 65535) + 4015;
			var msw17 = (x13 >> 16) + (-2692) + (lsw17 >> 16);
			var y4 = msw17 << 16 | lsw17 & 65535;
			var lsw18 = (x14 & 65535) + (y4 & 65535);
			var msw18 = (x14 >> 16) + (y4 >> 16) + (lsw18 >> 16);
			var num4 = msw18 << 16 | lsw18 & 65535;
			var x15 = num4 << 7 | num4 >>> 25;
			var lsw19 = (x15 & 65535) + (b & 65535);
			var msw19 = (x15 >> 16) + (b >> 16) + (lsw19 >> 16);
			a = msw19 << 16 | lsw19 & 65535;
			var x16 = x[i + 5];
			var lsb15 = a & 1 & (b & 1);
			var msb3115 = a >>> 1 & b >>> 1;
			var a11 = msb3115 << 1 | lsb15;
			var a12 = ~a;
			var lsb16 = a12 & 1 & (c & 1);
			var msb3116 = a12 >>> 1 & c >>> 1;
			var b6 = msb3116 << 1 | lsb16;
			var lsb17 = a11 & 1 | b6 & 1;
			var msb3117 = a11 >>> 1 | b6 >>> 1;
			var q5 = msb3117 << 1 | lsb17;
			var lsw20 = (d & 65535) + (q5 & 65535);
			var msw20 = (d >> 16) + (q5 >> 16) + (lsw20 >> 16);
			var x17 = msw20 << 16 | lsw20 & 65535;
			var lsw21 = (x16 & 65535) + 50730;
			var msw21 = (x16 >> 16) + 18311 + (lsw21 >> 16);
			var y5 = msw21 << 16 | lsw21 & 65535;
			var lsw22 = (x17 & 65535) + (y5 & 65535);
			var msw22 = (x17 >> 16) + (y5 >> 16) + (lsw22 >> 16);
			var num5 = msw22 << 16 | lsw22 & 65535;
			var x18 = num5 << 12 | num5 >>> 20;
			var lsw23 = (x18 & 65535) + (a & 65535);
			var msw23 = (x18 >> 16) + (a >> 16) + (lsw23 >> 16);
			d = msw23 << 16 | lsw23 & 65535;
			var x19 = x[i + 6];
			var lsb18 = d & 1 & (a & 1);
			var msb3118 = d >>> 1 & a >>> 1;
			var a13 = msb3118 << 1 | lsb18;
			var a14 = ~d;
			var lsb19 = a14 & 1 & (b & 1);
			var msb3119 = a14 >>> 1 & b >>> 1;
			var b7 = msb3119 << 1 | lsb19;
			var lsb20 = a13 & 1 | b7 & 1;
			var msb3120 = a13 >>> 1 | b7 >>> 1;
			var q6 = msb3120 << 1 | lsb20;
			var lsw24 = (c & 65535) + (q6 & 65535);
			var msw24 = (c >> 16) + (q6 >> 16) + (lsw24 >> 16);
			var x20 = msw24 << 16 | lsw24 & 65535;
			var lsw25 = (x19 & 65535) + 17939;
			var msw25 = (x19 >> 16) + (-22480) + (lsw25 >> 16);
			var y6 = msw25 << 16 | lsw25 & 65535;
			var lsw26 = (x20 & 65535) + (y6 & 65535);
			var msw26 = (x20 >> 16) + (y6 >> 16) + (lsw26 >> 16);
			var num6 = msw26 << 16 | lsw26 & 65535;
			var x21 = num6 << 17 | num6 >>> 15;
			var lsw27 = (x21 & 65535) + (d & 65535);
			var msw27 = (x21 >> 16) + (d >> 16) + (lsw27 >> 16);
			c = msw27 << 16 | lsw27 & 65535;
			var x22 = x[i + 7];
			var lsb21 = c & 1 & (d & 1);
			var msb3121 = c >>> 1 & d >>> 1;
			var a15 = msb3121 << 1 | lsb21;
			var a16 = ~c;
			var lsb22 = a16 & 1 & (a & 1);
			var msb3122 = a16 >>> 1 & a >>> 1;
			var b8 = msb3122 << 1 | lsb22;
			var lsb23 = a15 & 1 | b8 & 1;
			var msb3123 = a15 >>> 1 | b8 >>> 1;
			var q7 = msb3123 << 1 | lsb23;
			var lsw28 = (b & 65535) + (q7 & 65535);
			var msw28 = (b >> 16) + (q7 >> 16) + (lsw28 >> 16);
			var x23 = msw28 << 16 | lsw28 & 65535;
			var lsw29 = (x22 & 65535) + 38145;
			var msw29 = (x22 >> 16) + (-698) + (lsw29 >> 16);
			var y7 = msw29 << 16 | lsw29 & 65535;
			var lsw30 = (x23 & 65535) + (y7 & 65535);
			var msw30 = (x23 >> 16) + (y7 >> 16) + (lsw30 >> 16);
			var num7 = msw30 << 16 | lsw30 & 65535;
			var x24 = num7 << 22 | num7 >>> 10;
			var lsw31 = (x24 & 65535) + (c & 65535);
			var msw31 = (x24 >> 16) + (c >> 16) + (lsw31 >> 16);
			b = msw31 << 16 | lsw31 & 65535;
			var x25 = x[i + 8];
			var lsb24 = b & 1 & (c & 1);
			var msb3124 = b >>> 1 & c >>> 1;
			var a17 = msb3124 << 1 | lsb24;
			var a18 = ~b;
			var lsb25 = a18 & 1 & (d & 1);
			var msb3125 = a18 >>> 1 & d >>> 1;
			var b9 = msb3125 << 1 | lsb25;
			var lsb26 = a17 & 1 | b9 & 1;
			var msb3126 = a17 >>> 1 | b9 >>> 1;
			var q8 = msb3126 << 1 | lsb26;
			var lsw32 = (a & 65535) + (q8 & 65535);
			var msw32 = (a >> 16) + (q8 >> 16) + (lsw32 >> 16);
			var x26 = msw32 << 16 | lsw32 & 65535;
			var lsw33 = (x25 & 65535) + 39128;
			var msw33 = (x25 >> 16) + 27008 + (lsw33 >> 16);
			var y8 = msw33 << 16 | lsw33 & 65535;
			var lsw34 = (x26 & 65535) + (y8 & 65535);
			var msw34 = (x26 >> 16) + (y8 >> 16) + (lsw34 >> 16);
			var num8 = msw34 << 16 | lsw34 & 65535;
			var x27 = num8 << 7 | num8 >>> 25;
			var lsw35 = (x27 & 65535) + (b & 65535);
			var msw35 = (x27 >> 16) + (b >> 16) + (lsw35 >> 16);
			a = msw35 << 16 | lsw35 & 65535;
			var x28 = x[i + 9];
			var lsb27 = a & 1 & (b & 1);
			var msb3127 = a >>> 1 & b >>> 1;
			var a19 = msb3127 << 1 | lsb27;
			var a20 = ~a;
			var lsb28 = a20 & 1 & (c & 1);
			var msb3128 = a20 >>> 1 & c >>> 1;
			var b10 = msb3128 << 1 | lsb28;
			var lsb29 = a19 & 1 | b10 & 1;
			var msb3129 = a19 >>> 1 | b10 >>> 1;
			var q9 = msb3129 << 1 | lsb29;
			var lsw36 = (d & 65535) + (q9 & 65535);
			var msw36 = (d >> 16) + (q9 >> 16) + (lsw36 >> 16);
			var x29 = msw36 << 16 | lsw36 & 65535;
			var lsw37 = (x28 & 65535) + 63407;
			var msw37 = (x28 >> 16) + (-29884) + (lsw37 >> 16);
			var y9 = msw37 << 16 | lsw37 & 65535;
			var lsw38 = (x29 & 65535) + (y9 & 65535);
			var msw38 = (x29 >> 16) + (y9 >> 16) + (lsw38 >> 16);
			var num9 = msw38 << 16 | lsw38 & 65535;
			var x30 = num9 << 12 | num9 >>> 20;
			var lsw39 = (x30 & 65535) + (a & 65535);
			var msw39 = (x30 >> 16) + (a >> 16) + (lsw39 >> 16);
			d = msw39 << 16 | lsw39 & 65535;
			var x31 = x[i + 10];
			var lsb30 = d & 1 & (a & 1);
			var msb3130 = d >>> 1 & a >>> 1;
			var a21 = msb3130 << 1 | lsb30;
			var a22 = ~d;
			var lsb31 = a22 & 1 & (b & 1);
			var msb3131 = a22 >>> 1 & b >>> 1;
			var b11 = msb3131 << 1 | lsb31;
			var lsb32 = a21 & 1 | b11 & 1;
			var msb3132 = a21 >>> 1 | b11 >>> 1;
			var q10 = msb3132 << 1 | lsb32;
			var lsw40 = (c & 65535) + (q10 & 65535);
			var msw40 = (c >> 16) + (q10 >> 16) + (lsw40 >> 16);
			var x32 = msw40 << 16 | lsw40 & 65535;
			var lsw41 = (x31 & 65535) + 23473;
			var msw41 = (x31 >> 16) + (-1) + (lsw41 >> 16);
			var y10 = msw41 << 16 | lsw41 & 65535;
			var lsw42 = (x32 & 65535) + (y10 & 65535);
			var msw42 = (x32 >> 16) + (y10 >> 16) + (lsw42 >> 16);
			var num10 = msw42 << 16 | lsw42 & 65535;
			var x33 = num10 << 17 | num10 >>> 15;
			var lsw43 = (x33 & 65535) + (d & 65535);
			var msw43 = (x33 >> 16) + (d >> 16) + (lsw43 >> 16);
			c = msw43 << 16 | lsw43 & 65535;
			var x34 = x[i + 11];
			var lsb33 = c & 1 & (d & 1);
			var msb3133 = c >>> 1 & d >>> 1;
			var a23 = msb3133 << 1 | lsb33;
			var a24 = ~c;
			var lsb34 = a24 & 1 & (a & 1);
			var msb3134 = a24 >>> 1 & a >>> 1;
			var b12 = msb3134 << 1 | lsb34;
			var lsb35 = a23 & 1 | b12 & 1;
			var msb3135 = a23 >>> 1 | b12 >>> 1;
			var q11 = msb3135 << 1 | lsb35;
			var lsw44 = (b & 65535) + (q11 & 65535);
			var msw44 = (b >> 16) + (q11 >> 16) + (lsw44 >> 16);
			var x35 = msw44 << 16 | lsw44 & 65535;
			var lsw45 = (x34 & 65535) + 55230;
			var msw45 = (x34 >> 16) + (-30372) + (lsw45 >> 16);
			var y11 = msw45 << 16 | lsw45 & 65535;
			var lsw46 = (x35 & 65535) + (y11 & 65535);
			var msw46 = (x35 >> 16) + (y11 >> 16) + (lsw46 >> 16);
			var num11 = msw46 << 16 | lsw46 & 65535;
			var x36 = num11 << 22 | num11 >>> 10;
			var lsw47 = (x36 & 65535) + (c & 65535);
			var msw47 = (x36 >> 16) + (c >> 16) + (lsw47 >> 16);
			b = msw47 << 16 | lsw47 & 65535;
			var x37 = x[i + 12];
			var lsb36 = b & 1 & (c & 1);
			var msb3136 = b >>> 1 & c >>> 1;
			var a25 = msb3136 << 1 | lsb36;
			var a26 = ~b;
			var lsb37 = a26 & 1 & (d & 1);
			var msb3137 = a26 >>> 1 & d >>> 1;
			var b13 = msb3137 << 1 | lsb37;
			var lsb38 = a25 & 1 | b13 & 1;
			var msb3138 = a25 >>> 1 | b13 >>> 1;
			var q12 = msb3138 << 1 | lsb38;
			var lsw48 = (a & 65535) + (q12 & 65535);
			var msw48 = (a >> 16) + (q12 >> 16) + (lsw48 >> 16);
			var x38 = msw48 << 16 | lsw48 & 65535;
			var lsw49 = (x37 & 65535) + 4386;
			var msw49 = (x37 >> 16) + 27536 + (lsw49 >> 16);
			var y12 = msw49 << 16 | lsw49 & 65535;
			var lsw50 = (x38 & 65535) + (y12 & 65535);
			var msw50 = (x38 >> 16) + (y12 >> 16) + (lsw50 >> 16);
			var num12 = msw50 << 16 | lsw50 & 65535;
			var x39 = num12 << 7 | num12 >>> 25;
			var lsw51 = (x39 & 65535) + (b & 65535);
			var msw51 = (x39 >> 16) + (b >> 16) + (lsw51 >> 16);
			a = msw51 << 16 | lsw51 & 65535;
			var x40 = x[i + 13];
			var lsb39 = a & 1 & (b & 1);
			var msb3139 = a >>> 1 & b >>> 1;
			var a27 = msb3139 << 1 | lsb39;
			var a28 = ~a;
			var lsb40 = a28 & 1 & (c & 1);
			var msb3140 = a28 >>> 1 & c >>> 1;
			var b14 = msb3140 << 1 | lsb40;
			var lsb41 = a27 & 1 | b14 & 1;
			var msb3141 = a27 >>> 1 | b14 >>> 1;
			var q13 = msb3141 << 1 | lsb41;
			var lsw52 = (d & 65535) + (q13 & 65535);
			var msw52 = (d >> 16) + (q13 >> 16) + (lsw52 >> 16);
			var x41 = msw52 << 16 | lsw52 & 65535;
			var lsw53 = (x40 & 65535) + 29075;
			var msw53 = (x40 >> 16) + (-616) + (lsw53 >> 16);
			var y13 = msw53 << 16 | lsw53 & 65535;
			var lsw54 = (x41 & 65535) + (y13 & 65535);
			var msw54 = (x41 >> 16) + (y13 >> 16) + (lsw54 >> 16);
			var num13 = msw54 << 16 | lsw54 & 65535;
			var x42 = num13 << 12 | num13 >>> 20;
			var lsw55 = (x42 & 65535) + (a & 65535);
			var msw55 = (x42 >> 16) + (a >> 16) + (lsw55 >> 16);
			d = msw55 << 16 | lsw55 & 65535;
			var x43 = x[i + 14];
			var lsb42 = d & 1 & (a & 1);
			var msb3142 = d >>> 1 & a >>> 1;
			var a29 = msb3142 << 1 | lsb42;
			var a30 = ~d;
			var lsb43 = a30 & 1 & (b & 1);
			var msb3143 = a30 >>> 1 & b >>> 1;
			var b15 = msb3143 << 1 | lsb43;
			var lsb44 = a29 & 1 | b15 & 1;
			var msb3144 = a29 >>> 1 | b15 >>> 1;
			var q14 = msb3144 << 1 | lsb44;
			var lsw56 = (c & 65535) + (q14 & 65535);
			var msw56 = (c >> 16) + (q14 >> 16) + (lsw56 >> 16);
			var x44 = msw56 << 16 | lsw56 & 65535;
			var lsw57 = (x43 & 65535) + 17294;
			var msw57 = (x43 >> 16) + (-22919) + (lsw57 >> 16);
			var y14 = msw57 << 16 | lsw57 & 65535;
			var lsw58 = (x44 & 65535) + (y14 & 65535);
			var msw58 = (x44 >> 16) + (y14 >> 16) + (lsw58 >> 16);
			var num14 = msw58 << 16 | lsw58 & 65535;
			var x45 = num14 << 17 | num14 >>> 15;
			var lsw59 = (x45 & 65535) + (d & 65535);
			var msw59 = (x45 >> 16) + (d >> 16) + (lsw59 >> 16);
			c = msw59 << 16 | lsw59 & 65535;
			var x46 = x[i + 15];
			var lsb45 = c & 1 & (d & 1);
			var msb3145 = c >>> 1 & d >>> 1;
			var a31 = msb3145 << 1 | lsb45;
			var a32 = ~c;
			var lsb46 = a32 & 1 & (a & 1);
			var msb3146 = a32 >>> 1 & a >>> 1;
			var b16 = msb3146 << 1 | lsb46;
			var lsb47 = a31 & 1 | b16 & 1;
			var msb3147 = a31 >>> 1 | b16 >>> 1;
			var q15 = msb3147 << 1 | lsb47;
			var lsw60 = (b & 65535) + (q15 & 65535);
			var msw60 = (b >> 16) + (q15 >> 16) + (lsw60 >> 16);
			var x47 = msw60 << 16 | lsw60 & 65535;
			var lsw61 = (x46 & 65535) + 2081;
			var msw61 = (x46 >> 16) + 18868 + (lsw61 >> 16);
			var y15 = msw61 << 16 | lsw61 & 65535;
			var lsw62 = (x47 & 65535) + (y15 & 65535);
			var msw62 = (x47 >> 16) + (y15 >> 16) + (lsw62 >> 16);
			var num15 = msw62 << 16 | lsw62 & 65535;
			var x48 = num15 << 22 | num15 >>> 10;
			var lsw63 = (x48 & 65535) + (c & 65535);
			var msw63 = (x48 >> 16) + (c >> 16) + (lsw63 >> 16);
			b = msw63 << 16 | lsw63 & 65535;
			var x49 = x[i + 1];
			var lsb48 = b & 1 & (d & 1);
			var msb3148 = b >>> 1 & d >>> 1;
			var a33 = msb3148 << 1 | lsb48;
			var b17 = ~d;
			var lsb49 = c & 1 & (b17 & 1);
			var msb3149 = c >>> 1 & b17 >>> 1;
			var b18 = msb3149 << 1 | lsb49;
			var lsb50 = a33 & 1 | b18 & 1;
			var msb3150 = a33 >>> 1 | b18 >>> 1;
			var q16 = msb3150 << 1 | lsb50;
			var lsw64 = (a & 65535) + (q16 & 65535);
			var msw64 = (a >> 16) + (q16 >> 16) + (lsw64 >> 16);
			var x50 = msw64 << 16 | lsw64 & 65535;
			var lsw65 = (x49 & 65535) + 9570;
			var msw65 = (x49 >> 16) + (-2530) + (lsw65 >> 16);
			var y16 = msw65 << 16 | lsw65 & 65535;
			var lsw66 = (x50 & 65535) + (y16 & 65535);
			var msw66 = (x50 >> 16) + (y16 >> 16) + (lsw66 >> 16);
			var num16 = msw66 << 16 | lsw66 & 65535;
			var x51 = num16 << 5 | num16 >>> 27;
			var lsw67 = (x51 & 65535) + (b & 65535);
			var msw67 = (x51 >> 16) + (b >> 16) + (lsw67 >> 16);
			a = msw67 << 16 | lsw67 & 65535;
			var x52 = x[i + 6];
			var lsb51 = a & 1 & (c & 1);
			var msb3151 = a >>> 1 & c >>> 1;
			var a34 = msb3151 << 1 | lsb51;
			var b19 = ~c;
			var lsb52 = b & 1 & (b19 & 1);
			var msb3152 = b >>> 1 & b19 >>> 1;
			var b20 = msb3152 << 1 | lsb52;
			var lsb53 = a34 & 1 | b20 & 1;
			var msb3153 = a34 >>> 1 | b20 >>> 1;
			var q17 = msb3153 << 1 | lsb53;
			var lsw68 = (d & 65535) + (q17 & 65535);
			var msw68 = (d >> 16) + (q17 >> 16) + (lsw68 >> 16);
			var x53 = msw68 << 16 | lsw68 & 65535;
			var lsw69 = (x52 & 65535) + 45888;
			var msw69 = (x52 >> 16) + (-16320) + (lsw69 >> 16);
			var y17 = msw69 << 16 | lsw69 & 65535;
			var lsw70 = (x53 & 65535) + (y17 & 65535);
			var msw70 = (x53 >> 16) + (y17 >> 16) + (lsw70 >> 16);
			var num17 = msw70 << 16 | lsw70 & 65535;
			var x54 = num17 << 9 | num17 >>> 23;
			var lsw71 = (x54 & 65535) + (a & 65535);
			var msw71 = (x54 >> 16) + (a >> 16) + (lsw71 >> 16);
			d = msw71 << 16 | lsw71 & 65535;
			var x55 = x[i + 11];
			var lsb54 = d & 1 & (b & 1);
			var msb3154 = d >>> 1 & b >>> 1;
			var a35 = msb3154 << 1 | lsb54;
			var b21 = ~b;
			var lsb55 = a & 1 & (b21 & 1);
			var msb3155 = a >>> 1 & b21 >>> 1;
			var b22 = msb3155 << 1 | lsb55;
			var lsb56 = a35 & 1 | b22 & 1;
			var msb3156 = a35 >>> 1 | b22 >>> 1;
			var q18 = msb3156 << 1 | lsb56;
			var lsw72 = (c & 65535) + (q18 & 65535);
			var msw72 = (c >> 16) + (q18 >> 16) + (lsw72 >> 16);
			var x56 = msw72 << 16 | lsw72 & 65535;
			var lsw73 = (x55 & 65535) + 23121;
			var msw73 = (x55 >> 16) + 9822 + (lsw73 >> 16);
			var y18 = msw73 << 16 | lsw73 & 65535;
			var lsw74 = (x56 & 65535) + (y18 & 65535);
			var msw74 = (x56 >> 16) + (y18 >> 16) + (lsw74 >> 16);
			var num18 = msw74 << 16 | lsw74 & 65535;
			var x57 = num18 << 14 | num18 >>> 18;
			var lsw75 = (x57 & 65535) + (d & 65535);
			var msw75 = (x57 >> 16) + (d >> 16) + (lsw75 >> 16);
			c = msw75 << 16 | lsw75 & 65535;
			var x58 = x[i];
			var lsb57 = c & 1 & (a & 1);
			var msb3157 = c >>> 1 & a >>> 1;
			var a36 = msb3157 << 1 | lsb57;
			var b23 = ~a;
			var lsb58 = d & 1 & (b23 & 1);
			var msb3158 = d >>> 1 & b23 >>> 1;
			var b24 = msb3158 << 1 | lsb58;
			var lsb59 = a36 & 1 | b24 & 1;
			var msb3159 = a36 >>> 1 | b24 >>> 1;
			var q19 = msb3159 << 1 | lsb59;
			var lsw76 = (b & 65535) + (q19 & 65535);
			var msw76 = (b >> 16) + (q19 >> 16) + (lsw76 >> 16);
			var x59 = msw76 << 16 | lsw76 & 65535;
			var lsw77 = (x58 & 65535) + 51114;
			var msw77 = (x58 >> 16) + (-5706) + (lsw77 >> 16);
			var y19 = msw77 << 16 | lsw77 & 65535;
			var lsw78 = (x59 & 65535) + (y19 & 65535);
			var msw78 = (x59 >> 16) + (y19 >> 16) + (lsw78 >> 16);
			var num19 = msw78 << 16 | lsw78 & 65535;
			var x60 = num19 << 20 | num19 >>> 12;
			var lsw79 = (x60 & 65535) + (c & 65535);
			var msw79 = (x60 >> 16) + (c >> 16) + (lsw79 >> 16);
			b = msw79 << 16 | lsw79 & 65535;
			var x61 = x[i + 5];
			var lsb60 = b & 1 & (d & 1);
			var msb3160 = b >>> 1 & d >>> 1;
			var a37 = msb3160 << 1 | lsb60;
			var b25 = ~d;
			var lsb61 = c & 1 & (b25 & 1);
			var msb3161 = c >>> 1 & b25 >>> 1;
			var b26 = msb3161 << 1 | lsb61;
			var lsb62 = a37 & 1 | b26 & 1;
			var msb3162 = a37 >>> 1 | b26 >>> 1;
			var q20 = msb3162 << 1 | lsb62;
			var lsw80 = (a & 65535) + (q20 & 65535);
			var msw80 = (a >> 16) + (q20 >> 16) + (lsw80 >> 16);
			var x62 = msw80 << 16 | lsw80 & 65535;
			var lsw81 = (x61 & 65535) + 4189;
			var msw81 = (x61 >> 16) + (-10705) + (lsw81 >> 16);
			var y20 = msw81 << 16 | lsw81 & 65535;
			var lsw82 = (x62 & 65535) + (y20 & 65535);
			var msw82 = (x62 >> 16) + (y20 >> 16) + (lsw82 >> 16);
			var num20 = msw82 << 16 | lsw82 & 65535;
			var x63 = num20 << 5 | num20 >>> 27;
			var lsw83 = (x63 & 65535) + (b & 65535);
			var msw83 = (x63 >> 16) + (b >> 16) + (lsw83 >> 16);
			a = msw83 << 16 | lsw83 & 65535;
			var x64 = x[i + 10];
			var lsb63 = a & 1 & (c & 1);
			var msb3163 = a >>> 1 & c >>> 1;
			var a38 = msb3163 << 1 | lsb63;
			var b27 = ~c;
			var lsb64 = b & 1 & (b27 & 1);
			var msb3164 = b >>> 1 & b27 >>> 1;
			var b28 = msb3164 << 1 | lsb64;
			var lsb65 = a38 & 1 | b28 & 1;
			var msb3165 = a38 >>> 1 | b28 >>> 1;
			var q21 = msb3165 << 1 | lsb65;
			var lsw84 = (d & 65535) + (q21 & 65535);
			var msw84 = (d >> 16) + (q21 >> 16) + (lsw84 >> 16);
			var x65 = msw84 << 16 | lsw84 & 65535;
			var lsw85 = (x64 & 65535) + 5203;
			var msw85 = (x64 >> 16) + 580 + (lsw85 >> 16);
			var y21 = msw85 << 16 | lsw85 & 65535;
			var lsw86 = (x65 & 65535) + (y21 & 65535);
			var msw86 = (x65 >> 16) + (y21 >> 16) + (lsw86 >> 16);
			var num21 = msw86 << 16 | lsw86 & 65535;
			var x66 = num21 << 9 | num21 >>> 23;
			var lsw87 = (x66 & 65535) + (a & 65535);
			var msw87 = (x66 >> 16) + (a >> 16) + (lsw87 >> 16);
			d = msw87 << 16 | lsw87 & 65535;
			var x67 = x[i + 15];
			var lsb66 = d & 1 & (b & 1);
			var msb3166 = d >>> 1 & b >>> 1;
			var a39 = msb3166 << 1 | lsb66;
			var b29 = ~b;
			var lsb67 = a & 1 & (b29 & 1);
			var msb3167 = a >>> 1 & b29 >>> 1;
			var b30 = msb3167 << 1 | lsb67;
			var lsb68 = a39 & 1 | b30 & 1;
			var msb3168 = a39 >>> 1 | b30 >>> 1;
			var q22 = msb3168 << 1 | lsb68;
			var lsw88 = (c & 65535) + (q22 & 65535);
			var msw88 = (c >> 16) + (q22 >> 16) + (lsw88 >> 16);
			var x68 = msw88 << 16 | lsw88 & 65535;
			var lsw89 = (x67 & 65535) + 59009;
			var msw89 = (x67 >> 16) + (-10079) + (lsw89 >> 16);
			var y22 = msw89 << 16 | lsw89 & 65535;
			var lsw90 = (x68 & 65535) + (y22 & 65535);
			var msw90 = (x68 >> 16) + (y22 >> 16) + (lsw90 >> 16);
			var num22 = msw90 << 16 | lsw90 & 65535;
			var x69 = num22 << 14 | num22 >>> 18;
			var lsw91 = (x69 & 65535) + (d & 65535);
			var msw91 = (x69 >> 16) + (d >> 16) + (lsw91 >> 16);
			c = msw91 << 16 | lsw91 & 65535;
			var x70 = x[i + 4];
			var lsb69 = c & 1 & (a & 1);
			var msb3169 = c >>> 1 & a >>> 1;
			var a40 = msb3169 << 1 | lsb69;
			var b31 = ~a;
			var lsb70 = d & 1 & (b31 & 1);
			var msb3170 = d >>> 1 & b31 >>> 1;
			var b32 = msb3170 << 1 | lsb70;
			var lsb71 = a40 & 1 | b32 & 1;
			var msb3171 = a40 >>> 1 | b32 >>> 1;
			var q23 = msb3171 << 1 | lsb71;
			var lsw92 = (b & 65535) + (q23 & 65535);
			var msw92 = (b >> 16) + (q23 >> 16) + (lsw92 >> 16);
			var x71 = msw92 << 16 | lsw92 & 65535;
			var lsw93 = (x70 & 65535) + 64456;
			var msw93 = (x70 >> 16) + (-6189) + (lsw93 >> 16);
			var y23 = msw93 << 16 | lsw93 & 65535;
			var lsw94 = (x71 & 65535) + (y23 & 65535);
			var msw94 = (x71 >> 16) + (y23 >> 16) + (lsw94 >> 16);
			var num23 = msw94 << 16 | lsw94 & 65535;
			var x72 = num23 << 20 | num23 >>> 12;
			var lsw95 = (x72 & 65535) + (c & 65535);
			var msw95 = (x72 >> 16) + (c >> 16) + (lsw95 >> 16);
			b = msw95 << 16 | lsw95 & 65535;
			var x73 = x[i + 9];
			var lsb72 = b & 1 & (d & 1);
			var msb3172 = b >>> 1 & d >>> 1;
			var a41 = msb3172 << 1 | lsb72;
			var b33 = ~d;
			var lsb73 = c & 1 & (b33 & 1);
			var msb3173 = c >>> 1 & b33 >>> 1;
			var b34 = msb3173 << 1 | lsb73;
			var lsb74 = a41 & 1 | b34 & 1;
			var msb3174 = a41 >>> 1 | b34 >>> 1;
			var q24 = msb3174 << 1 | lsb74;
			var lsw96 = (a & 65535) + (q24 & 65535);
			var msw96 = (a >> 16) + (q24 >> 16) + (lsw96 >> 16);
			var x74 = msw96 << 16 | lsw96 & 65535;
			var lsw97 = (x73 & 65535) + 52710;
			var msw97 = (x73 >> 16) + 8673 + (lsw97 >> 16);
			var y24 = msw97 << 16 | lsw97 & 65535;
			var lsw98 = (x74 & 65535) + (y24 & 65535);
			var msw98 = (x74 >> 16) + (y24 >> 16) + (lsw98 >> 16);
			var num24 = msw98 << 16 | lsw98 & 65535;
			var x75 = num24 << 5 | num24 >>> 27;
			var lsw99 = (x75 & 65535) + (b & 65535);
			var msw99 = (x75 >> 16) + (b >> 16) + (lsw99 >> 16);
			a = msw99 << 16 | lsw99 & 65535;
			var x76 = x[i + 14];
			var lsb75 = a & 1 & (c & 1);
			var msb3175 = a >>> 1 & c >>> 1;
			var a42 = msb3175 << 1 | lsb75;
			var b35 = ~c;
			var lsb76 = b & 1 & (b35 & 1);
			var msb3176 = b >>> 1 & b35 >>> 1;
			var b36 = msb3176 << 1 | lsb76;
			var lsb77 = a42 & 1 | b36 & 1;
			var msb3177 = a42 >>> 1 | b36 >>> 1;
			var q25 = msb3177 << 1 | lsb77;
			var lsw100 = (d & 65535) + (q25 & 65535);
			var msw100 = (d >> 16) + (q25 >> 16) + (lsw100 >> 16);
			var x77 = msw100 << 16 | lsw100 & 65535;
			var lsw101 = (x76 & 65535) + 2006;
			var msw101 = (x76 >> 16) + (-15561) + (lsw101 >> 16);
			var y25 = msw101 << 16 | lsw101 & 65535;
			var lsw102 = (x77 & 65535) + (y25 & 65535);
			var msw102 = (x77 >> 16) + (y25 >> 16) + (lsw102 >> 16);
			var num25 = msw102 << 16 | lsw102 & 65535;
			var x78 = num25 << 9 | num25 >>> 23;
			var lsw103 = (x78 & 65535) + (a & 65535);
			var msw103 = (x78 >> 16) + (a >> 16) + (lsw103 >> 16);
			d = msw103 << 16 | lsw103 & 65535;
			var x79 = x[i + 3];
			var lsb78 = d & 1 & (b & 1);
			var msb3178 = d >>> 1 & b >>> 1;
			var a43 = msb3178 << 1 | lsb78;
			var b37 = ~b;
			var lsb79 = a & 1 & (b37 & 1);
			var msb3179 = a >>> 1 & b37 >>> 1;
			var b38 = msb3179 << 1 | lsb79;
			var lsb80 = a43 & 1 | b38 & 1;
			var msb3180 = a43 >>> 1 | b38 >>> 1;
			var q26 = msb3180 << 1 | lsb80;
			var lsw104 = (c & 65535) + (q26 & 65535);
			var msw104 = (c >> 16) + (q26 >> 16) + (lsw104 >> 16);
			var x80 = msw104 << 16 | lsw104 & 65535;
			var lsw105 = (x79 & 65535) + 3463;
			var msw105 = (x79 >> 16) + (-2859) + (lsw105 >> 16);
			var y26 = msw105 << 16 | lsw105 & 65535;
			var lsw106 = (x80 & 65535) + (y26 & 65535);
			var msw106 = (x80 >> 16) + (y26 >> 16) + (lsw106 >> 16);
			var num26 = msw106 << 16 | lsw106 & 65535;
			var x81 = num26 << 14 | num26 >>> 18;
			var lsw107 = (x81 & 65535) + (d & 65535);
			var msw107 = (x81 >> 16) + (d >> 16) + (lsw107 >> 16);
			c = msw107 << 16 | lsw107 & 65535;
			var x82 = x[i + 8];
			var lsb81 = c & 1 & (a & 1);
			var msb3181 = c >>> 1 & a >>> 1;
			var a44 = msb3181 << 1 | lsb81;
			var b39 = ~a;
			var lsb82 = d & 1 & (b39 & 1);
			var msb3182 = d >>> 1 & b39 >>> 1;
			var b40 = msb3182 << 1 | lsb82;
			var lsb83 = a44 & 1 | b40 & 1;
			var msb3183 = a44 >>> 1 | b40 >>> 1;
			var q27 = msb3183 << 1 | lsb83;
			var lsw108 = (b & 65535) + (q27 & 65535);
			var msw108 = (b >> 16) + (q27 >> 16) + (lsw108 >> 16);
			var x83 = msw108 << 16 | lsw108 & 65535;
			var lsw109 = (x82 & 65535) + 5357;
			var msw109 = (x82 >> 16) + 17754 + (lsw109 >> 16);
			var y27 = msw109 << 16 | lsw109 & 65535;
			var lsw110 = (x83 & 65535) + (y27 & 65535);
			var msw110 = (x83 >> 16) + (y27 >> 16) + (lsw110 >> 16);
			var num27 = msw110 << 16 | lsw110 & 65535;
			var x84 = num27 << 20 | num27 >>> 12;
			var lsw111 = (x84 & 65535) + (c & 65535);
			var msw111 = (x84 >> 16) + (c >> 16) + (lsw111 >> 16);
			b = msw111 << 16 | lsw111 & 65535;
			var x85 = x[i + 13];
			var lsb84 = b & 1 & (d & 1);
			var msb3184 = b >>> 1 & d >>> 1;
			var a45 = msb3184 << 1 | lsb84;
			var b41 = ~d;
			var lsb85 = c & 1 & (b41 & 1);
			var msb3185 = c >>> 1 & b41 >>> 1;
			var b42 = msb3185 << 1 | lsb85;
			var lsb86 = a45 & 1 | b42 & 1;
			var msb3186 = a45 >>> 1 | b42 >>> 1;
			var q28 = msb3186 << 1 | lsb86;
			var lsw112 = (a & 65535) + (q28 & 65535);
			var msw112 = (a >> 16) + (q28 >> 16) + (lsw112 >> 16);
			var x86 = msw112 << 16 | lsw112 & 65535;
			var lsw113 = (x85 & 65535) + 59653;
			var msw113 = (x85 >> 16) + (-22045) + (lsw113 >> 16);
			var y28 = msw113 << 16 | lsw113 & 65535;
			var lsw114 = (x86 & 65535) + (y28 & 65535);
			var msw114 = (x86 >> 16) + (y28 >> 16) + (lsw114 >> 16);
			var num28 = msw114 << 16 | lsw114 & 65535;
			var x87 = num28 << 5 | num28 >>> 27;
			var lsw115 = (x87 & 65535) + (b & 65535);
			var msw115 = (x87 >> 16) + (b >> 16) + (lsw115 >> 16);
			a = msw115 << 16 | lsw115 & 65535;
			var x88 = x[i + 2];
			var lsb87 = a & 1 & (c & 1);
			var msb3187 = a >>> 1 & c >>> 1;
			var a46 = msb3187 << 1 | lsb87;
			var b43 = ~c;
			var lsb88 = b & 1 & (b43 & 1);
			var msb3188 = b >>> 1 & b43 >>> 1;
			var b44 = msb3188 << 1 | lsb88;
			var lsb89 = a46 & 1 | b44 & 1;
			var msb3189 = a46 >>> 1 | b44 >>> 1;
			var q29 = msb3189 << 1 | lsb89;
			var lsw116 = (d & 65535) + (q29 & 65535);
			var msw116 = (d >> 16) + (q29 >> 16) + (lsw116 >> 16);
			var x89 = msw116 << 16 | lsw116 & 65535;
			var lsw117 = (x88 & 65535) + 41976;
			var msw117 = (x88 >> 16) + (-785) + (lsw117 >> 16);
			var y29 = msw117 << 16 | lsw117 & 65535;
			var lsw118 = (x89 & 65535) + (y29 & 65535);
			var msw118 = (x89 >> 16) + (y29 >> 16) + (lsw118 >> 16);
			var num29 = msw118 << 16 | lsw118 & 65535;
			var x90 = num29 << 9 | num29 >>> 23;
			var lsw119 = (x90 & 65535) + (a & 65535);
			var msw119 = (x90 >> 16) + (a >> 16) + (lsw119 >> 16);
			d = msw119 << 16 | lsw119 & 65535;
			var x91 = x[i + 7];
			var lsb90 = d & 1 & (b & 1);
			var msb3190 = d >>> 1 & b >>> 1;
			var a47 = msb3190 << 1 | lsb90;
			var b45 = ~b;
			var lsb91 = a & 1 & (b45 & 1);
			var msb3191 = a >>> 1 & b45 >>> 1;
			var b46 = msb3191 << 1 | lsb91;
			var lsb92 = a47 & 1 | b46 & 1;
			var msb3192 = a47 >>> 1 | b46 >>> 1;
			var q30 = msb3192 << 1 | lsb92;
			var lsw120 = (c & 65535) + (q30 & 65535);
			var msw120 = (c >> 16) + (q30 >> 16) + (lsw120 >> 16);
			var x92 = msw120 << 16 | lsw120 & 65535;
			var lsw121 = (x91 & 65535) + 729;
			var msw121 = (x91 >> 16) + 26479 + (lsw121 >> 16);
			var y30 = msw121 << 16 | lsw121 & 65535;
			var lsw122 = (x92 & 65535) + (y30 & 65535);
			var msw122 = (x92 >> 16) + (y30 >> 16) + (lsw122 >> 16);
			var num30 = msw122 << 16 | lsw122 & 65535;
			var x93 = num30 << 14 | num30 >>> 18;
			var lsw123 = (x93 & 65535) + (d & 65535);
			var msw123 = (x93 >> 16) + (d >> 16) + (lsw123 >> 16);
			c = msw123 << 16 | lsw123 & 65535;
			var x94 = x[i + 12];
			var lsb93 = c & 1 & (a & 1);
			var msb3193 = c >>> 1 & a >>> 1;
			var a48 = msb3193 << 1 | lsb93;
			var b47 = ~a;
			var lsb94 = d & 1 & (b47 & 1);
			var msb3194 = d >>> 1 & b47 >>> 1;
			var b48 = msb3194 << 1 | lsb94;
			var lsb95 = a48 & 1 | b48 & 1;
			var msb3195 = a48 >>> 1 | b48 >>> 1;
			var q31 = msb3195 << 1 | lsb95;
			var lsw124 = (b & 65535) + (q31 & 65535);
			var msw124 = (b >> 16) + (q31 >> 16) + (lsw124 >> 16);
			var x95 = msw124 << 16 | lsw124 & 65535;
			var lsw125 = (x94 & 65535) + 19594;
			var msw125 = (x94 >> 16) + (-29398) + (lsw125 >> 16);
			var y31 = msw125 << 16 | lsw125 & 65535;
			var lsw126 = (x95 & 65535) + (y31 & 65535);
			var msw126 = (x95 >> 16) + (y31 >> 16) + (lsw126 >> 16);
			var num31 = msw126 << 16 | lsw126 & 65535;
			var x96 = num31 << 20 | num31 >>> 12;
			var lsw127 = (x96 & 65535) + (c & 65535);
			var msw127 = (x96 >> 16) + (c >> 16) + (lsw127 >> 16);
			b = msw127 << 16 | lsw127 & 65535;
			var x97 = x[i + 5];
			var lsb96 = b & 1 ^ c & 1;
			var msb3196 = b >>> 1 ^ c >>> 1;
			var a49 = msb3196 << 1 | lsb96;
			var lsb97 = a49 & 1 ^ d & 1;
			var msb3197 = a49 >>> 1 ^ d >>> 1;
			var q32 = msb3197 << 1 | lsb97;
			var lsw128 = (a & 65535) + (q32 & 65535);
			var msw128 = (a >> 16) + (q32 >> 16) + (lsw128 >> 16);
			var x98 = msw128 << 16 | lsw128 & 65535;
			var lsw129 = (x97 & 65535) + 14658;
			var msw129 = (x97 >> 16) + (-6) + (lsw129 >> 16);
			var y32 = msw129 << 16 | lsw129 & 65535;
			var lsw130 = (x98 & 65535) + (y32 & 65535);
			var msw130 = (x98 >> 16) + (y32 >> 16) + (lsw130 >> 16);
			var num32 = msw130 << 16 | lsw130 & 65535;
			var x99 = num32 << 4 | num32 >>> 28;
			var lsw131 = (x99 & 65535) + (b & 65535);
			var msw131 = (x99 >> 16) + (b >> 16) + (lsw131 >> 16);
			a = msw131 << 16 | lsw131 & 65535;
			var x100 = x[i + 8];
			var lsb98 = a & 1 ^ b & 1;
			var msb3198 = a >>> 1 ^ b >>> 1;
			var a50 = msb3198 << 1 | lsb98;
			var lsb99 = a50 & 1 ^ c & 1;
			var msb3199 = a50 >>> 1 ^ c >>> 1;
			var q33 = msb3199 << 1 | lsb99;
			var lsw132 = (d & 65535) + (q33 & 65535);
			var msw132 = (d >> 16) + (q33 >> 16) + (lsw132 >> 16);
			var x101 = msw132 << 16 | lsw132 & 65535;
			var lsw133 = (x100 & 65535) + 63105;
			var msw133 = (x100 >> 16) + (-30863) + (lsw133 >> 16);
			var y33 = msw133 << 16 | lsw133 & 65535;
			var lsw134 = (x101 & 65535) + (y33 & 65535);
			var msw134 = (x101 >> 16) + (y33 >> 16) + (lsw134 >> 16);
			var num33 = msw134 << 16 | lsw134 & 65535;
			var x102 = num33 << 11 | num33 >>> 21;
			var lsw135 = (x102 & 65535) + (a & 65535);
			var msw135 = (x102 >> 16) + (a >> 16) + (lsw135 >> 16);
			d = msw135 << 16 | lsw135 & 65535;
			var x103 = x[i + 11];
			var lsb100 = d & 1 ^ a & 1;
			var msb31100 = d >>> 1 ^ a >>> 1;
			var a51 = msb31100 << 1 | lsb100;
			var lsb101 = a51 & 1 ^ b & 1;
			var msb31101 = a51 >>> 1 ^ b >>> 1;
			var q34 = msb31101 << 1 | lsb101;
			var lsw136 = (c & 65535) + (q34 & 65535);
			var msw136 = (c >> 16) + (q34 >> 16) + (lsw136 >> 16);
			var x104 = msw136 << 16 | lsw136 & 65535;
			var lsw137 = (x103 & 65535) + 24866;
			var msw137 = (x103 >> 16) + 28061 + (lsw137 >> 16);
			var y34 = msw137 << 16 | lsw137 & 65535;
			var lsw138 = (x104 & 65535) + (y34 & 65535);
			var msw138 = (x104 >> 16) + (y34 >> 16) + (lsw138 >> 16);
			var num34 = msw138 << 16 | lsw138 & 65535;
			var x105 = num34 << 16 | num34 >>> 16;
			var lsw139 = (x105 & 65535) + (d & 65535);
			var msw139 = (x105 >> 16) + (d >> 16) + (lsw139 >> 16);
			c = msw139 << 16 | lsw139 & 65535;
			var x106 = x[i + 14];
			var lsb102 = c & 1 ^ d & 1;
			var msb31102 = c >>> 1 ^ d >>> 1;
			var a52 = msb31102 << 1 | lsb102;
			var lsb103 = a52 & 1 ^ a & 1;
			var msb31103 = a52 >>> 1 ^ a >>> 1;
			var q35 = msb31103 << 1 | lsb103;
			var lsw140 = (b & 65535) + (q35 & 65535);
			var msw140 = (b >> 16) + (q35 >> 16) + (lsw140 >> 16);
			var x107 = msw140 << 16 | lsw140 & 65535;
			var lsw141 = (x106 & 65535) + 14348;
			var msw141 = (x106 >> 16) + (-539) + (lsw141 >> 16);
			var y35 = msw141 << 16 | lsw141 & 65535;
			var lsw142 = (x107 & 65535) + (y35 & 65535);
			var msw142 = (x107 >> 16) + (y35 >> 16) + (lsw142 >> 16);
			var num35 = msw142 << 16 | lsw142 & 65535;
			var x108 = num35 << 23 | num35 >>> 9;
			var lsw143 = (x108 & 65535) + (c & 65535);
			var msw143 = (x108 >> 16) + (c >> 16) + (lsw143 >> 16);
			b = msw143 << 16 | lsw143 & 65535;
			var x109 = x[i + 1];
			var lsb104 = b & 1 ^ c & 1;
			var msb31104 = b >>> 1 ^ c >>> 1;
			var a53 = msb31104 << 1 | lsb104;
			var lsb105 = a53 & 1 ^ d & 1;
			var msb31105 = a53 >>> 1 ^ d >>> 1;
			var q36 = msb31105 << 1 | lsb105;
			var lsw144 = (a & 65535) + (q36 & 65535);
			var msw144 = (a >> 16) + (q36 >> 16) + (lsw144 >> 16);
			var x110 = msw144 << 16 | lsw144 & 65535;
			var lsw145 = (x109 & 65535) + 59972;
			var msw145 = (x109 >> 16) + (-23362) + (lsw145 >> 16);
			var y36 = msw145 << 16 | lsw145 & 65535;
			var lsw146 = (x110 & 65535) + (y36 & 65535);
			var msw146 = (x110 >> 16) + (y36 >> 16) + (lsw146 >> 16);
			var num36 = msw146 << 16 | lsw146 & 65535;
			var x111 = num36 << 4 | num36 >>> 28;
			var lsw147 = (x111 & 65535) + (b & 65535);
			var msw147 = (x111 >> 16) + (b >> 16) + (lsw147 >> 16);
			a = msw147 << 16 | lsw147 & 65535;
			var x112 = x[i + 4];
			var lsb106 = a & 1 ^ b & 1;
			var msb31106 = a >>> 1 ^ b >>> 1;
			var a54 = msb31106 << 1 | lsb106;
			var lsb107 = a54 & 1 ^ c & 1;
			var msb31107 = a54 >>> 1 ^ c >>> 1;
			var q37 = msb31107 << 1 | lsb107;
			var lsw148 = (d & 65535) + (q37 & 65535);
			var msw148 = (d >> 16) + (q37 >> 16) + (lsw148 >> 16);
			var x113 = msw148 << 16 | lsw148 & 65535;
			var lsw149 = (x112 & 65535) + 53161;
			var msw149 = (x112 >> 16) + 19422 + (lsw149 >> 16);
			var y37 = msw149 << 16 | lsw149 & 65535;
			var lsw150 = (x113 & 65535) + (y37 & 65535);
			var msw150 = (x113 >> 16) + (y37 >> 16) + (lsw150 >> 16);
			var num37 = msw150 << 16 | lsw150 & 65535;
			var x114 = num37 << 11 | num37 >>> 21;
			var lsw151 = (x114 & 65535) + (a & 65535);
			var msw151 = (x114 >> 16) + (a >> 16) + (lsw151 >> 16);
			d = msw151 << 16 | lsw151 & 65535;
			var x115 = x[i + 7];
			var lsb108 = d & 1 ^ a & 1;
			var msb31108 = d >>> 1 ^ a >>> 1;
			var a55 = msb31108 << 1 | lsb108;
			var lsb109 = a55 & 1 ^ b & 1;
			var msb31109 = a55 >>> 1 ^ b >>> 1;
			var q38 = msb31109 << 1 | lsb109;
			var lsw152 = (c & 65535) + (q38 & 65535);
			var msw152 = (c >> 16) + (q38 >> 16) + (lsw152 >> 16);
			var x116 = msw152 << 16 | lsw152 & 65535;
			var lsw153 = (x115 & 65535) + 19296;
			var msw153 = (x115 >> 16) + (-2373) + (lsw153 >> 16);
			var y38 = msw153 << 16 | lsw153 & 65535;
			var lsw154 = (x116 & 65535) + (y38 & 65535);
			var msw154 = (x116 >> 16) + (y38 >> 16) + (lsw154 >> 16);
			var num38 = msw154 << 16 | lsw154 & 65535;
			var x117 = num38 << 16 | num38 >>> 16;
			var lsw155 = (x117 & 65535) + (d & 65535);
			var msw155 = (x117 >> 16) + (d >> 16) + (lsw155 >> 16);
			c = msw155 << 16 | lsw155 & 65535;
			var x118 = x[i + 10];
			var lsb110 = c & 1 ^ d & 1;
			var msb31110 = c >>> 1 ^ d >>> 1;
			var a56 = msb31110 << 1 | lsb110;
			var lsb111 = a56 & 1 ^ a & 1;
			var msb31111 = a56 >>> 1 ^ a >>> 1;
			var q39 = msb31111 << 1 | lsb111;
			var lsw156 = (b & 65535) + (q39 & 65535);
			var msw156 = (b >> 16) + (q39 >> 16) + (lsw156 >> 16);
			var x119 = msw156 << 16 | lsw156 & 65535;
			var lsw157 = (x118 & 65535) + 48240;
			var msw157 = (x118 >> 16) + (-16705) + (lsw157 >> 16);
			var y39 = msw157 << 16 | lsw157 & 65535;
			var lsw158 = (x119 & 65535) + (y39 & 65535);
			var msw158 = (x119 >> 16) + (y39 >> 16) + (lsw158 >> 16);
			var num39 = msw158 << 16 | lsw158 & 65535;
			var x120 = num39 << 23 | num39 >>> 9;
			var lsw159 = (x120 & 65535) + (c & 65535);
			var msw159 = (x120 >> 16) + (c >> 16) + (lsw159 >> 16);
			b = msw159 << 16 | lsw159 & 65535;
			var x121 = x[i + 13];
			var lsb112 = b & 1 ^ c & 1;
			var msb31112 = b >>> 1 ^ c >>> 1;
			var a57 = msb31112 << 1 | lsb112;
			var lsb113 = a57 & 1 ^ d & 1;
			var msb31113 = a57 >>> 1 ^ d >>> 1;
			var q40 = msb31113 << 1 | lsb113;
			var lsw160 = (a & 65535) + (q40 & 65535);
			var msw160 = (a >> 16) + (q40 >> 16) + (lsw160 >> 16);
			var x122 = msw160 << 16 | lsw160 & 65535;
			var lsw161 = (x121 & 65535) + 32454;
			var msw161 = (x121 >> 16) + 10395 + (lsw161 >> 16);
			var y40 = msw161 << 16 | lsw161 & 65535;
			var lsw162 = (x122 & 65535) + (y40 & 65535);
			var msw162 = (x122 >> 16) + (y40 >> 16) + (lsw162 >> 16);
			var num40 = msw162 << 16 | lsw162 & 65535;
			var x123 = num40 << 4 | num40 >>> 28;
			var lsw163 = (x123 & 65535) + (b & 65535);
			var msw163 = (x123 >> 16) + (b >> 16) + (lsw163 >> 16);
			a = msw163 << 16 | lsw163 & 65535;
			var x124 = x[i];
			var lsb114 = a & 1 ^ b & 1;
			var msb31114 = a >>> 1 ^ b >>> 1;
			var a58 = msb31114 << 1 | lsb114;
			var lsb115 = a58 & 1 ^ c & 1;
			var msb31115 = a58 >>> 1 ^ c >>> 1;
			var q41 = msb31115 << 1 | lsb115;
			var lsw164 = (d & 65535) + (q41 & 65535);
			var msw164 = (d >> 16) + (q41 >> 16) + (lsw164 >> 16);
			var x125 = msw164 << 16 | lsw164 & 65535;
			var lsw165 = (x124 & 65535) + 10234;
			var msw165 = (x124 >> 16) + (-5471) + (lsw165 >> 16);
			var y41 = msw165 << 16 | lsw165 & 65535;
			var lsw166 = (x125 & 65535) + (y41 & 65535);
			var msw166 = (x125 >> 16) + (y41 >> 16) + (lsw166 >> 16);
			var num41 = msw166 << 16 | lsw166 & 65535;
			var x126 = num41 << 11 | num41 >>> 21;
			var lsw167 = (x126 & 65535) + (a & 65535);
			var msw167 = (x126 >> 16) + (a >> 16) + (lsw167 >> 16);
			d = msw167 << 16 | lsw167 & 65535;
			var x127 = x[i + 3];
			var lsb116 = d & 1 ^ a & 1;
			var msb31116 = d >>> 1 ^ a >>> 1;
			var a59 = msb31116 << 1 | lsb116;
			var lsb117 = a59 & 1 ^ b & 1;
			var msb31117 = a59 >>> 1 ^ b >>> 1;
			var q42 = msb31117 << 1 | lsb117;
			var lsw168 = (c & 65535) + (q42 & 65535);
			var msw168 = (c >> 16) + (q42 >> 16) + (lsw168 >> 16);
			var x128 = msw168 << 16 | lsw168 & 65535;
			var lsw169 = (x127 & 65535) + 12421;
			var msw169 = (x127 >> 16) + (-11025) + (lsw169 >> 16);
			var y42 = msw169 << 16 | lsw169 & 65535;
			var lsw170 = (x128 & 65535) + (y42 & 65535);
			var msw170 = (x128 >> 16) + (y42 >> 16) + (lsw170 >> 16);
			var num42 = msw170 << 16 | lsw170 & 65535;
			var x129 = num42 << 16 | num42 >>> 16;
			var lsw171 = (x129 & 65535) + (d & 65535);
			var msw171 = (x129 >> 16) + (d >> 16) + (lsw171 >> 16);
			c = msw171 << 16 | lsw171 & 65535;
			var x130 = x[i + 6];
			var lsb118 = c & 1 ^ d & 1;
			var msb31118 = c >>> 1 ^ d >>> 1;
			var a60 = msb31118 << 1 | lsb118;
			var lsb119 = a60 & 1 ^ a & 1;
			var msb31119 = a60 >>> 1 ^ a >>> 1;
			var q43 = msb31119 << 1 | lsb119;
			var lsw172 = (b & 65535) + (q43 & 65535);
			var msw172 = (b >> 16) + (q43 >> 16) + (lsw172 >> 16);
			var x131 = msw172 << 16 | lsw172 & 65535;
			var lsw173 = (x130 & 65535) + 7429;
			var msw173 = (x130 >> 16) + 1160 + (lsw173 >> 16);
			var y43 = msw173 << 16 | lsw173 & 65535;
			var lsw174 = (x131 & 65535) + (y43 & 65535);
			var msw174 = (x131 >> 16) + (y43 >> 16) + (lsw174 >> 16);
			var num43 = msw174 << 16 | lsw174 & 65535;
			var x132 = num43 << 23 | num43 >>> 9;
			var lsw175 = (x132 & 65535) + (c & 65535);
			var msw175 = (x132 >> 16) + (c >> 16) + (lsw175 >> 16);
			b = msw175 << 16 | lsw175 & 65535;
			var x133 = x[i + 9];
			var lsb120 = b & 1 ^ c & 1;
			var msb31120 = b >>> 1 ^ c >>> 1;
			var a61 = msb31120 << 1 | lsb120;
			var lsb121 = a61 & 1 ^ d & 1;
			var msb31121 = a61 >>> 1 ^ d >>> 1;
			var q44 = msb31121 << 1 | lsb121;
			var lsw176 = (a & 65535) + (q44 & 65535);
			var msw176 = (a >> 16) + (q44 >> 16) + (lsw176 >> 16);
			var x134 = msw176 << 16 | lsw176 & 65535;
			var lsw177 = (x133 & 65535) + 53305;
			var msw177 = (x133 >> 16) + (-9772) + (lsw177 >> 16);
			var y44 = msw177 << 16 | lsw177 & 65535;
			var lsw178 = (x134 & 65535) + (y44 & 65535);
			var msw178 = (x134 >> 16) + (y44 >> 16) + (lsw178 >> 16);
			var num44 = msw178 << 16 | lsw178 & 65535;
			var x135 = num44 << 4 | num44 >>> 28;
			var lsw179 = (x135 & 65535) + (b & 65535);
			var msw179 = (x135 >> 16) + (b >> 16) + (lsw179 >> 16);
			a = msw179 << 16 | lsw179 & 65535;
			var x136 = x[i + 12];
			var lsb122 = a & 1 ^ b & 1;
			var msb31122 = a >>> 1 ^ b >>> 1;
			var a62 = msb31122 << 1 | lsb122;
			var lsb123 = a62 & 1 ^ c & 1;
			var msb31123 = a62 >>> 1 ^ c >>> 1;
			var q45 = msb31123 << 1 | lsb123;
			var lsw180 = (d & 65535) + (q45 & 65535);
			var msw180 = (d >> 16) + (q45 >> 16) + (lsw180 >> 16);
			var x137 = msw180 << 16 | lsw180 & 65535;
			var lsw181 = (x136 & 65535) + 39397;
			var msw181 = (x136 >> 16) + (-6437) + (lsw181 >> 16);
			var y45 = msw181 << 16 | lsw181 & 65535;
			var lsw182 = (x137 & 65535) + (y45 & 65535);
			var msw182 = (x137 >> 16) + (y45 >> 16) + (lsw182 >> 16);
			var num45 = msw182 << 16 | lsw182 & 65535;
			var x138 = num45 << 11 | num45 >>> 21;
			var lsw183 = (x138 & 65535) + (a & 65535);
			var msw183 = (x138 >> 16) + (a >> 16) + (lsw183 >> 16);
			d = msw183 << 16 | lsw183 & 65535;
			var x139 = x[i + 15];
			var lsb124 = d & 1 ^ a & 1;
			var msb31124 = d >>> 1 ^ a >>> 1;
			var a63 = msb31124 << 1 | lsb124;
			var lsb125 = a63 & 1 ^ b & 1;
			var msb31125 = a63 >>> 1 ^ b >>> 1;
			var q46 = msb31125 << 1 | lsb125;
			var lsw184 = (c & 65535) + (q46 & 65535);
			var msw184 = (c >> 16) + (q46 >> 16) + (lsw184 >> 16);
			var x140 = msw184 << 16 | lsw184 & 65535;
			var lsw185 = (x139 & 65535) + 31992;
			var msw185 = (x139 >> 16) + 8098 + (lsw185 >> 16);
			var y46 = msw185 << 16 | lsw185 & 65535;
			var lsw186 = (x140 & 65535) + (y46 & 65535);
			var msw186 = (x140 >> 16) + (y46 >> 16) + (lsw186 >> 16);
			var num46 = msw186 << 16 | lsw186 & 65535;
			var x141 = num46 << 16 | num46 >>> 16;
			var lsw187 = (x141 & 65535) + (d & 65535);
			var msw187 = (x141 >> 16) + (d >> 16) + (lsw187 >> 16);
			c = msw187 << 16 | lsw187 & 65535;
			var x142 = x[i + 2];
			var lsb126 = c & 1 ^ d & 1;
			var msb31126 = c >>> 1 ^ d >>> 1;
			var a64 = msb31126 << 1 | lsb126;
			var lsb127 = a64 & 1 ^ a & 1;
			var msb31127 = a64 >>> 1 ^ a >>> 1;
			var q47 = msb31127 << 1 | lsb127;
			var lsw188 = (b & 65535) + (q47 & 65535);
			var msw188 = (b >> 16) + (q47 >> 16) + (lsw188 >> 16);
			var x143 = msw188 << 16 | lsw188 & 65535;
			var lsw189 = (x142 & 65535) + 22117;
			var msw189 = (x142 >> 16) + (-15188) + (lsw189 >> 16);
			var y47 = msw189 << 16 | lsw189 & 65535;
			var lsw190 = (x143 & 65535) + (y47 & 65535);
			var msw190 = (x143 >> 16) + (y47 >> 16) + (lsw190 >> 16);
			var num47 = msw190 << 16 | lsw190 & 65535;
			var x144 = num47 << 23 | num47 >>> 9;
			var lsw191 = (x144 & 65535) + (c & 65535);
			var msw191 = (x144 >> 16) + (c >> 16) + (lsw191 >> 16);
			b = msw191 << 16 | lsw191 & 65535;
			var x145 = x[i];
			var b49 = ~d;
			var lsb128 = b & 1 | b49 & 1;
			var msb31128 = b >>> 1 | b49 >>> 1;
			var b50 = msb31128 << 1 | lsb128;
			var lsb129 = c & 1 ^ b50 & 1;
			var msb31129 = c >>> 1 ^ b50 >>> 1;
			var q48 = msb31129 << 1 | lsb129;
			var lsw192 = (a & 65535) + (q48 & 65535);
			var msw192 = (a >> 16) + (q48 >> 16) + (lsw192 >> 16);
			var x146 = msw192 << 16 | lsw192 & 65535;
			var lsw193 = (x145 & 65535) + 8772;
			var msw193 = (x145 >> 16) + (-3031) + (lsw193 >> 16);
			var y48 = msw193 << 16 | lsw193 & 65535;
			var lsw194 = (x146 & 65535) + (y48 & 65535);
			var msw194 = (x146 >> 16) + (y48 >> 16) + (lsw194 >> 16);
			var num48 = msw194 << 16 | lsw194 & 65535;
			var x147 = num48 << 6 | num48 >>> 26;
			var lsw195 = (x147 & 65535) + (b & 65535);
			var msw195 = (x147 >> 16) + (b >> 16) + (lsw195 >> 16);
			a = msw195 << 16 | lsw195 & 65535;
			var x148 = x[i + 7];
			var b51 = ~c;
			var lsb130 = a & 1 | b51 & 1;
			var msb31130 = a >>> 1 | b51 >>> 1;
			var b52 = msb31130 << 1 | lsb130;
			var lsb131 = b & 1 ^ b52 & 1;
			var msb31131 = b >>> 1 ^ b52 >>> 1;
			var q49 = msb31131 << 1 | lsb131;
			var lsw196 = (d & 65535) + (q49 & 65535);
			var msw196 = (d >> 16) + (q49 >> 16) + (lsw196 >> 16);
			var x149 = msw196 << 16 | lsw196 & 65535;
			var lsw197 = (x148 & 65535) + 65431;
			var msw197 = (x148 >> 16) + 17194 + (lsw197 >> 16);
			var y49 = msw197 << 16 | lsw197 & 65535;
			var lsw198 = (x149 & 65535) + (y49 & 65535);
			var msw198 = (x149 >> 16) + (y49 >> 16) + (lsw198 >> 16);
			var num49 = msw198 << 16 | lsw198 & 65535;
			var x150 = num49 << 10 | num49 >>> 22;
			var lsw199 = (x150 & 65535) + (a & 65535);
			var msw199 = (x150 >> 16) + (a >> 16) + (lsw199 >> 16);
			d = msw199 << 16 | lsw199 & 65535;
			var x151 = x[i + 14];
			var b53 = ~b;
			var lsb132 = d & 1 | b53 & 1;
			var msb31132 = d >>> 1 | b53 >>> 1;
			var b54 = msb31132 << 1 | lsb132;
			var lsb133 = a & 1 ^ b54 & 1;
			var msb31133 = a >>> 1 ^ b54 >>> 1;
			var q50 = msb31133 << 1 | lsb133;
			var lsw200 = (c & 65535) + (q50 & 65535);
			var msw200 = (c >> 16) + (q50 >> 16) + (lsw200 >> 16);
			var x152 = msw200 << 16 | lsw200 & 65535;
			var lsw201 = (x151 & 65535) + 9127;
			var msw201 = (x151 >> 16) + (-21612) + (lsw201 >> 16);
			var y50 = msw201 << 16 | lsw201 & 65535;
			var lsw202 = (x152 & 65535) + (y50 & 65535);
			var msw202 = (x152 >> 16) + (y50 >> 16) + (lsw202 >> 16);
			var num50 = msw202 << 16 | lsw202 & 65535;
			var x153 = num50 << 15 | num50 >>> 17;
			var lsw203 = (x153 & 65535) + (d & 65535);
			var msw203 = (x153 >> 16) + (d >> 16) + (lsw203 >> 16);
			c = msw203 << 16 | lsw203 & 65535;
			var x154 = x[i + 5];
			var b55 = ~a;
			var lsb134 = c & 1 | b55 & 1;
			var msb31134 = c >>> 1 | b55 >>> 1;
			var b56 = msb31134 << 1 | lsb134;
			var lsb135 = d & 1 ^ b56 & 1;
			var msb31135 = d >>> 1 ^ b56 >>> 1;
			var q51 = msb31135 << 1 | lsb135;
			var lsw204 = (b & 65535) + (q51 & 65535);
			var msw204 = (b >> 16) + (q51 >> 16) + (lsw204 >> 16);
			var x155 = msw204 << 16 | lsw204 & 65535;
			var lsw205 = (x154 & 65535) + 41017;
			var msw205 = (x154 >> 16) + (-877) + (lsw205 >> 16);
			var y51 = msw205 << 16 | lsw205 & 65535;
			var lsw206 = (x155 & 65535) + (y51 & 65535);
			var msw206 = (x155 >> 16) + (y51 >> 16) + (lsw206 >> 16);
			var num51 = msw206 << 16 | lsw206 & 65535;
			var x156 = num51 << 21 | num51 >>> 11;
			var lsw207 = (x156 & 65535) + (c & 65535);
			var msw207 = (x156 >> 16) + (c >> 16) + (lsw207 >> 16);
			b = msw207 << 16 | lsw207 & 65535;
			var x157 = x[i + 12];
			var b57 = ~d;
			var lsb136 = b & 1 | b57 & 1;
			var msb31136 = b >>> 1 | b57 >>> 1;
			var b58 = msb31136 << 1 | lsb136;
			var lsb137 = c & 1 ^ b58 & 1;
			var msb31137 = c >>> 1 ^ b58 >>> 1;
			var q52 = msb31137 << 1 | lsb137;
			var lsw208 = (a & 65535) + (q52 & 65535);
			var msw208 = (a >> 16) + (q52 >> 16) + (lsw208 >> 16);
			var x158 = msw208 << 16 | lsw208 & 65535;
			var lsw209 = (x157 & 65535) + 22979;
			var msw209 = (x157 >> 16) + 25947 + (lsw209 >> 16);
			var y52 = msw209 << 16 | lsw209 & 65535;
			var lsw210 = (x158 & 65535) + (y52 & 65535);
			var msw210 = (x158 >> 16) + (y52 >> 16) + (lsw210 >> 16);
			var num52 = msw210 << 16 | lsw210 & 65535;
			var x159 = num52 << 6 | num52 >>> 26;
			var lsw211 = (x159 & 65535) + (b & 65535);
			var msw211 = (x159 >> 16) + (b >> 16) + (lsw211 >> 16);
			a = msw211 << 16 | lsw211 & 65535;
			var x160 = x[i + 3];
			var b59 = ~c;
			var lsb138 = a & 1 | b59 & 1;
			var msb31138 = a >>> 1 | b59 >>> 1;
			var b60 = msb31138 << 1 | lsb138;
			var lsb139 = b & 1 ^ b60 & 1;
			var msb31139 = b >>> 1 ^ b60 >>> 1;
			var q53 = msb31139 << 1 | lsb139;
			var lsw212 = (d & 65535) + (q53 & 65535);
			var msw212 = (d >> 16) + (q53 >> 16) + (lsw212 >> 16);
			var x161 = msw212 << 16 | lsw212 & 65535;
			var lsw213 = (x160 & 65535) + 52370;
			var msw213 = (x160 >> 16) + (-28916) + (lsw213 >> 16);
			var y53 = msw213 << 16 | lsw213 & 65535;
			var lsw214 = (x161 & 65535) + (y53 & 65535);
			var msw214 = (x161 >> 16) + (y53 >> 16) + (lsw214 >> 16);
			var num53 = msw214 << 16 | lsw214 & 65535;
			var x162 = num53 << 10 | num53 >>> 22;
			var lsw215 = (x162 & 65535) + (a & 65535);
			var msw215 = (x162 >> 16) + (a >> 16) + (lsw215 >> 16);
			d = msw215 << 16 | lsw215 & 65535;
			var x163 = x[i + 10];
			var b61 = ~b;
			var lsb140 = d & 1 | b61 & 1;
			var msb31140 = d >>> 1 | b61 >>> 1;
			var b62 = msb31140 << 1 | lsb140;
			var lsb141 = a & 1 ^ b62 & 1;
			var msb31141 = a >>> 1 ^ b62 >>> 1;
			var q54 = msb31141 << 1 | lsb141;
			var lsw216 = (c & 65535) + (q54 & 65535);
			var msw216 = (c >> 16) + (q54 >> 16) + (lsw216 >> 16);
			var x164 = msw216 << 16 | lsw216 & 65535;
			var lsw217 = (x163 & 65535) + 62589;
			var msw217 = (x163 >> 16) + (-17) + (lsw217 >> 16);
			var y54 = msw217 << 16 | lsw217 & 65535;
			var lsw218 = (x164 & 65535) + (y54 & 65535);
			var msw218 = (x164 >> 16) + (y54 >> 16) + (lsw218 >> 16);
			var num54 = msw218 << 16 | lsw218 & 65535;
			var x165 = num54 << 15 | num54 >>> 17;
			var lsw219 = (x165 & 65535) + (d & 65535);
			var msw219 = (x165 >> 16) + (d >> 16) + (lsw219 >> 16);
			c = msw219 << 16 | lsw219 & 65535;
			var x166 = x[i + 1];
			var b63 = ~a;
			var lsb142 = c & 1 | b63 & 1;
			var msb31142 = c >>> 1 | b63 >>> 1;
			var b64 = msb31142 << 1 | lsb142;
			var lsb143 = d & 1 ^ b64 & 1;
			var msb31143 = d >>> 1 ^ b64 >>> 1;
			var q55 = msb31143 << 1 | lsb143;
			var lsw220 = (b & 65535) + (q55 & 65535);
			var msw220 = (b >> 16) + (q55 >> 16) + (lsw220 >> 16);
			var x167 = msw220 << 16 | lsw220 & 65535;
			var lsw221 = (x166 & 65535) + 24017;
			var msw221 = (x166 >> 16) + (-31356) + (lsw221 >> 16);
			var y55 = msw221 << 16 | lsw221 & 65535;
			var lsw222 = (x167 & 65535) + (y55 & 65535);
			var msw222 = (x167 >> 16) + (y55 >> 16) + (lsw222 >> 16);
			var num55 = msw222 << 16 | lsw222 & 65535;
			var x168 = num55 << 21 | num55 >>> 11;
			var lsw223 = (x168 & 65535) + (c & 65535);
			var msw223 = (x168 >> 16) + (c >> 16) + (lsw223 >> 16);
			b = msw223 << 16 | lsw223 & 65535;
			var x169 = x[i + 8];
			var b65 = ~d;
			var lsb144 = b & 1 | b65 & 1;
			var msb31144 = b >>> 1 | b65 >>> 1;
			var b66 = msb31144 << 1 | lsb144;
			var lsb145 = c & 1 ^ b66 & 1;
			var msb31145 = c >>> 1 ^ b66 >>> 1;
			var q56 = msb31145 << 1 | lsb145;
			var lsw224 = (a & 65535) + (q56 & 65535);
			var msw224 = (a >> 16) + (q56 >> 16) + (lsw224 >> 16);
			var x170 = msw224 << 16 | lsw224 & 65535;
			var lsw225 = (x169 & 65535) + 32335;
			var msw225 = (x169 >> 16) + 28584 + (lsw225 >> 16);
			var y56 = msw225 << 16 | lsw225 & 65535;
			var lsw226 = (x170 & 65535) + (y56 & 65535);
			var msw226 = (x170 >> 16) + (y56 >> 16) + (lsw226 >> 16);
			var num56 = msw226 << 16 | lsw226 & 65535;
			var x171 = num56 << 6 | num56 >>> 26;
			var lsw227 = (x171 & 65535) + (b & 65535);
			var msw227 = (x171 >> 16) + (b >> 16) + (lsw227 >> 16);
			a = msw227 << 16 | lsw227 & 65535;
			var x172 = x[i + 15];
			var b67 = ~c;
			var lsb146 = a & 1 | b67 & 1;
			var msb31146 = a >>> 1 | b67 >>> 1;
			var b68 = msb31146 << 1 | lsb146;
			var lsb147 = b & 1 ^ b68 & 1;
			var msb31147 = b >>> 1 ^ b68 >>> 1;
			var q57 = msb31147 << 1 | lsb147;
			var lsw228 = (d & 65535) + (q57 & 65535);
			var msw228 = (d >> 16) + (q57 >> 16) + (lsw228 >> 16);
			var x173 = msw228 << 16 | lsw228 & 65535;
			var lsw229 = (x172 & 65535) + 59104;
			var msw229 = (x172 >> 16) + (-468) + (lsw229 >> 16);
			var y57 = msw229 << 16 | lsw229 & 65535;
			var lsw230 = (x173 & 65535) + (y57 & 65535);
			var msw230 = (x173 >> 16) + (y57 >> 16) + (lsw230 >> 16);
			var num57 = msw230 << 16 | lsw230 & 65535;
			var x174 = num57 << 10 | num57 >>> 22;
			var lsw231 = (x174 & 65535) + (a & 65535);
			var msw231 = (x174 >> 16) + (a >> 16) + (lsw231 >> 16);
			d = msw231 << 16 | lsw231 & 65535;
			var x175 = x[i + 6];
			var b69 = ~b;
			var lsb148 = d & 1 | b69 & 1;
			var msb31148 = d >>> 1 | b69 >>> 1;
			var b70 = msb31148 << 1 | lsb148;
			var lsb149 = a & 1 ^ b70 & 1;
			var msb31149 = a >>> 1 ^ b70 >>> 1;
			var q58 = msb31149 << 1 | lsb149;
			var lsw232 = (c & 65535) + (q58 & 65535);
			var msw232 = (c >> 16) + (q58 >> 16) + (lsw232 >> 16);
			var x176 = msw232 << 16 | lsw232 & 65535;
			var lsw233 = (x175 & 65535) + 17172;
			var msw233 = (x175 >> 16) + (-23807) + (lsw233 >> 16);
			var y58 = msw233 << 16 | lsw233 & 65535;
			var lsw234 = (x176 & 65535) + (y58 & 65535);
			var msw234 = (x176 >> 16) + (y58 >> 16) + (lsw234 >> 16);
			var num58 = msw234 << 16 | lsw234 & 65535;
			var x177 = num58 << 15 | num58 >>> 17;
			var lsw235 = (x177 & 65535) + (d & 65535);
			var msw235 = (x177 >> 16) + (d >> 16) + (lsw235 >> 16);
			c = msw235 << 16 | lsw235 & 65535;
			var x178 = x[i + 13];
			var b71 = ~a;
			var lsb150 = c & 1 | b71 & 1;
			var msb31150 = c >>> 1 | b71 >>> 1;
			var b72 = msb31150 << 1 | lsb150;
			var lsb151 = d & 1 ^ b72 & 1;
			var msb31151 = d >>> 1 ^ b72 >>> 1;
			var q59 = msb31151 << 1 | lsb151;
			var lsw236 = (b & 65535) + (q59 & 65535);
			var msw236 = (b >> 16) + (q59 >> 16) + (lsw236 >> 16);
			var x179 = msw236 << 16 | lsw236 & 65535;
			var lsw237 = (x178 & 65535) + 4513;
			var msw237 = (x178 >> 16) + 19976 + (lsw237 >> 16);
			var y59 = msw237 << 16 | lsw237 & 65535;
			var lsw238 = (x179 & 65535) + (y59 & 65535);
			var msw238 = (x179 >> 16) + (y59 >> 16) + (lsw238 >> 16);
			var num59 = msw238 << 16 | lsw238 & 65535;
			var x180 = num59 << 21 | num59 >>> 11;
			var lsw239 = (x180 & 65535) + (c & 65535);
			var msw239 = (x180 >> 16) + (c >> 16) + (lsw239 >> 16);
			b = msw239 << 16 | lsw239 & 65535;
			var x181 = x[i + 4];
			var b73 = ~d;
			var lsb152 = b & 1 | b73 & 1;
			var msb31152 = b >>> 1 | b73 >>> 1;
			var b74 = msb31152 << 1 | lsb152;
			var lsb153 = c & 1 ^ b74 & 1;
			var msb31153 = c >>> 1 ^ b74 >>> 1;
			var q60 = msb31153 << 1 | lsb153;
			var lsw240 = (a & 65535) + (q60 & 65535);
			var msw240 = (a >> 16) + (q60 >> 16) + (lsw240 >> 16);
			var x182 = msw240 << 16 | lsw240 & 65535;
			var lsw241 = (x181 & 65535) + 32386;
			var msw241 = (x181 >> 16) + (-2221) + (lsw241 >> 16);
			var y60 = msw241 << 16 | lsw241 & 65535;
			var lsw242 = (x182 & 65535) + (y60 & 65535);
			var msw242 = (x182 >> 16) + (y60 >> 16) + (lsw242 >> 16);
			var num60 = msw242 << 16 | lsw242 & 65535;
			var x183 = num60 << 6 | num60 >>> 26;
			var lsw243 = (x183 & 65535) + (b & 65535);
			var msw243 = (x183 >> 16) + (b >> 16) + (lsw243 >> 16);
			a = msw243 << 16 | lsw243 & 65535;
			var x184 = x[i + 11];
			var b75 = ~c;
			var lsb154 = a & 1 | b75 & 1;
			var msb31154 = a >>> 1 | b75 >>> 1;
			var b76 = msb31154 << 1 | lsb154;
			var lsb155 = b & 1 ^ b76 & 1;
			var msb31155 = b >>> 1 ^ b76 >>> 1;
			var q61 = msb31155 << 1 | lsb155;
			var lsw244 = (d & 65535) + (q61 & 65535);
			var msw244 = (d >> 16) + (q61 >> 16) + (lsw244 >> 16);
			var x185 = msw244 << 16 | lsw244 & 65535;
			var lsw245 = (x184 & 65535) + 62005;
			var msw245 = (x184 >> 16) + (-17094) + (lsw245 >> 16);
			var y61 = msw245 << 16 | lsw245 & 65535;
			var lsw246 = (x185 & 65535) + (y61 & 65535);
			var msw246 = (x185 >> 16) + (y61 >> 16) + (lsw246 >> 16);
			var num61 = msw246 << 16 | lsw246 & 65535;
			var x186 = num61 << 10 | num61 >>> 22;
			var lsw247 = (x186 & 65535) + (a & 65535);
			var msw247 = (x186 >> 16) + (a >> 16) + (lsw247 >> 16);
			d = msw247 << 16 | lsw247 & 65535;
			var x187 = x[i + 2];
			var b77 = ~b;
			var lsb156 = d & 1 | b77 & 1;
			var msb31156 = d >>> 1 | b77 >>> 1;
			var b78 = msb31156 << 1 | lsb156;
			var lsb157 = a & 1 ^ b78 & 1;
			var msb31157 = a >>> 1 ^ b78 >>> 1;
			var q62 = msb31157 << 1 | lsb157;
			var lsw248 = (c & 65535) + (q62 & 65535);
			var msw248 = (c >> 16) + (q62 >> 16) + (lsw248 >> 16);
			var x188 = msw248 << 16 | lsw248 & 65535;
			var lsw249 = (x187 & 65535) + 53947;
			var msw249 = (x187 >> 16) + 10967 + (lsw249 >> 16);
			var y62 = msw249 << 16 | lsw249 & 65535;
			var lsw250 = (x188 & 65535) + (y62 & 65535);
			var msw250 = (x188 >> 16) + (y62 >> 16) + (lsw250 >> 16);
			var num62 = msw250 << 16 | lsw250 & 65535;
			var x189 = num62 << 15 | num62 >>> 17;
			var lsw251 = (x189 & 65535) + (d & 65535);
			var msw251 = (x189 >> 16) + (d >> 16) + (lsw251 >> 16);
			c = msw251 << 16 | lsw251 & 65535;
			var x190 = x[i + 9];
			var b79 = ~a;
			var lsb158 = c & 1 | b79 & 1;
			var msb31158 = c >>> 1 | b79 >>> 1;
			var b80 = msb31158 << 1 | lsb158;
			var lsb159 = d & 1 ^ b80 & 1;
			var msb31159 = d >>> 1 ^ b80 >>> 1;
			var q63 = msb31159 << 1 | lsb159;
			var lsw252 = (b & 65535) + (q63 & 65535);
			var msw252 = (b >> 16) + (q63 >> 16) + (lsw252 >> 16);
			var x191 = msw252 << 16 | lsw252 & 65535;
			var lsw253 = (x190 & 65535) + 54161;
			var msw253 = (x190 >> 16) + (-5242) + (lsw253 >> 16);
			var y63 = msw253 << 16 | lsw253 & 65535;
			var lsw254 = (x191 & 65535) + (y63 & 65535);
			var msw254 = (x191 >> 16) + (y63 >> 16) + (lsw254 >> 16);
			var num63 = msw254 << 16 | lsw254 & 65535;
			var x192 = num63 << 21 | num63 >>> 11;
			var lsw255 = (x192 & 65535) + (c & 65535);
			var msw255 = (x192 >> 16) + (c >> 16) + (lsw255 >> 16);
			b = msw255 << 16 | lsw255 & 65535;
			var lsw256 = (a & 65535) + (olda & 65535);
			var msw256 = (a >> 16) + (olda >> 16) + (lsw256 >> 16);
			a = msw256 << 16 | lsw256 & 65535;
			var lsw257 = (b & 65535) + (oldb & 65535);
			var msw257 = (b >> 16) + (oldb >> 16) + (lsw257 >> 16);
			b = msw257 << 16 | lsw257 & 65535;
			var lsw258 = (c & 65535) + (oldc & 65535);
			var msw258 = (c >> 16) + (oldc >> 16) + (lsw258 >> 16);
			c = msw258 << 16 | lsw258 & 65535;
			var lsw259 = (d & 65535) + (oldd & 65535);
			var msw259 = (d >> 16) + (oldd >> 16) + (lsw259 >> 16);
			d = msw259 << 16 | lsw259 & 65535;
			i += 16;
		}
		return Md5.rhex(a) + Md5.rhex(b) + Md5.rhex(c) + Md5.rhex(d);
	}
	,__class__: Md5
};
var SoundSupport = function() {
};
SoundSupport.__name__ = true;
SoundSupport.play = function(f) {
	var s = window.document.createElement("AUDIO");
	if(!(!(!s.canPlayType) && "no" != s.canPlayType("audio/mpeg") && "" != s.canPlayType("audio/mpeg"))) {
		var e = window.document.createElement("EMBED");
		e.setAttribute("hidden","true");
		e.setAttribute("src",f);
		e.setAttribute("autostart","true");
		window.document.body.appendChild(e);
	} else {
		s.src = f;
		s.play();
	}
};
SoundSupport.loadSound = function(url,headers,onFail,onComplete) {
	if(SoundSupport.UseAudioStream) {
		haxe_Timer.delay(onComplete,200);
		return url;
	}
	try {
		var audio = new Audio();
		if(headers.length == 0) {
			audio.src = url;
		}
		var remove_listeners = null;
		var oncanplay = function() {
			if(Util.getParameter("devtrace") == "1") {
				Errors.print(url + " loaded");
			}
			onComplete();
			remove_listeners();
		};
		var onerror = function() {
			Errors.print("Cannot load: " + url);
			onFail("" + audio.error);
			remove_listeners();
		};
		remove_listeners = function() {
			audio.removeEventListener("canplay",oncanplay);
			audio.removeEventListener("error",onerror);
		};
		audio.addEventListener("canplay",oncanplay);
		audio.addEventListener("error",onerror);
		if(headers.length > 0) {
			var type = "";
			var audioXhr = new XMLHttpRequest();
			audioXhr.open("GET",url,true);
			var _g = 0;
			while(_g < headers.length) {
				var header = headers[_g];
				++_g;
				audioXhr.setRequestHeader(header[0],header[1]);
			}
			audioXhr.responseType = "blob";
			audioXhr.onload = function(oEvent) {
				if(audioXhr.status == 200) {
					if(type == "") {
						type = audioXhr.getResponseHeader("content-type");
					}
					audio.src = URL.createObjectURL(audioXhr.response);
					audio.load();
				} else if(audioXhr.status >= 400) {
					onerror();
				}
			};
			audioXhr.onerror = onerror;
			audioXhr.send(null);
		} else {
			audio.load();
		}
		return audio;
	} catch( _g ) {
		haxe_NativeStackTrace.lastError = _g;
		var e = haxe_Exception.caught(_g).unwrap();
		Errors.print("Exception while loading audio: " + Std.string(e));
		return null;
	}
};
SoundSupport.createStreamPlayer = function() {
	haxe_Timer.delay(function() {
		SoundSupport.AudioStream = window.document.createElement("AUDIO");
		SoundSupport.AudioStream.setAttribute("controls","");
		SoundSupport.AudioStream.style.position = "absolute";
		SoundSupport.AudioStream.style.left = SoundSupport.AudioStream.style.top = "30px";
		SoundSupport.AudioStream.style.zIndex = 2000;
		SoundSupport.AudioStream.src = "php/mp3stream/stream.php";
		window.document.body.appendChild(SoundSupport.AudioStream);
	},200);
};
SoundSupport.pushSoundToLiveStream = function(url,onDone) {
	var loader = new XMLHttpRequest();
	loader.open("GET","php/mp3stream/stream.php" + "?pushsnd=" + url,true);
	loader.addEventListener("load",function(e) {
		if(loader.responseText != "") {
			if(SoundSupport.AudioStream == null) {
				SoundSupport.createStreamPlayer();
			}
			haxe_Timer.delay(onDone,1000 * (parseFloat(loader.responseText) | 0));
		} else {
			onDone();
		}
	},false);
	loader.addEventListener("error",function(e) {
		onDone();
	},false);
	loader.send("");
};
SoundSupport.playSound = function(s,loop,onDone) {
	if(SoundSupport.UseAudioStream) {
		SoundSupport.pushSoundToLiveStream(s,onDone);
		return s;
	}
	var audio = s;
	var url = audio.currentSrc;
	var remove_listeners = null;
	var onended = function() {
		if(Util.getParameter("devtrace") == "1") {
			Errors.print(url + " ended");
		}
		onDone();
		remove_listeners();
	};
	var onerror = function() {
		Errors.print("Cannot play: " + url);
		onDone();
		remove_listeners();
	};
	remove_listeners = function() {
		audio.removeEventListener("ended",onended);
		audio.removeEventListener("error",onerror);
	};
	audio.addEventListener("ended",onended);
	audio.addEventListener("error",onerror);
	audio.play();
	return audio;
};
SoundSupport.setVolume = function(s,newVolume) {
	if(s != null) {
		s.volume = newVolume;
	}
};
SoundSupport.stopSound = function(s) {
	if(s != null && s.pause != null) {
		s.pause();
	}
	return null;
};
SoundSupport.noSound = function() {
	return null;
};
SoundSupport.playSoundFrom = function(s,cue,onDone) {
	var done = function() {
		onDone();
	};
	if(s == null) {
		return null;
	}
	s.addEventListener("ended",done,false);
	s.addEventListener("error",done,false);
	s.currentTime = cue / 1000.0;
	s.play();
	return s;
};
SoundSupport.getSoundLength = function(s) {
	if(s != null) {
		return s.duration * 1000.0;
	} else {
		return 0.0;
	}
};
SoundSupport.getSoundPosition = function(s) {
	if(s != null) {
		return s.currentTime * 1000.0;
	} else {
		return 0.0;
	}
};
SoundSupport.addDeviceVolumeEventListener = function(callback) {
	return function() {
	};
};
SoundSupport.getAudioSessionCategory = function() {
	return "soloambient";
};
SoundSupport.setAudioSessionCategory = function(category) {
};
SoundSupport.removeUtteranceFromGlobalArray = function(utterThis) {
	if(SoundSupport.hasSpeechSupport) {
		var utteranceIndex = SoundSupport.utterancesArray.indexOf(utterThis);
		if(utteranceIndex > -1) {
			SoundSupport.utterancesArray.splice(utteranceIndex,1);
		}
	}
};
SoundSupport.resumeSpeechSynthesisNative = function() {
	if(SoundSupport.hasSpeechSupport) {
		window.speechSynthesis.resume();
	}
};
SoundSupport.pauseSpeechSynthesisNative = function() {
	if(SoundSupport.hasSpeechSupport) {
		window.speechSynthesis.pause();
	}
};
SoundSupport.clearSpeechSynthesisQueueNative = function() {
	if(SoundSupport.hasSpeechSupport) {
		window.speechSynthesis.cancel();
	}
};
SoundSupport.performSpeechSynthesis = function(speak,voiceUri,lang,pitch,rate,volume,onReady,onBoundary,onEnd,onError) {
	if(SoundSupport.hasSpeechSupport) {
		var synth = window.speechSynthesis;
		var utterThis = new SpeechSynthesisUtterance(speak);
		SoundSupport.utterancesArray.push(utterThis);
		if(voiceUri != "") {
			var voices = synth.getVoices();
			var _g = 0;
			while(_g < voices.length) {
				var voice = voices[_g];
				++_g;
				if(voice.voiceURI == voiceUri) {
					utterThis.voice = voice;
				}
			}
		}
		if(lang != "") {
			utterThis.lang = lang;
		}
		utterThis.pitch = pitch;
		utterThis.rate = rate;
		utterThis.volume = volume;
		utterThis.addEventListener("start",function() {
			synth.pause();
			onReady();
		});
		utterThis.addEventListener("boundary",function(event) {
			onBoundary(event.charIndex,event.elapsedTime);
		});
		utterThis.addEventListener("error",function() {
			onError();
			SoundSupport.removeUtteranceFromGlobalArray(utterThis);
		});
		utterThis.addEventListener("end",function() {
			onEnd();
			SoundSupport.removeUtteranceFromGlobalArray(utterThis);
		});
		synth.speak(utterThis);
	}
};
SoundSupport.getAvailableVoices = function(callback) {
	if(SoundSupport.hasSpeechSupport) {
		var voices = window.speechSynthesis.getVoices();
		if(voices.length == 0) {
			SoundSupport.waitForVoices(callback);
		} else {
			callback(SoundSupport.mapSpeechSynthesisVoices(voices));
		}
	}
};
SoundSupport.waitForVoices = function(callback) {
	if(SoundSupport.hasSpeechSupport) {
		window.speechSynthesis.addEventListener("voiceschanged",function() {
			SoundSupport.getAvailableVoices(callback);
		});
	}
};
SoundSupport.mapSpeechSynthesisVoices = function(voices) {
	var i = 0;
	var result = [];
	var _g = 0;
	while(_g < voices.length) {
		var voice = voices[_g];
		++_g;
		var res = [];
		res[0] = voice.voiceURI;
		res[1] = voice.name;
		res[2] = voice.lang;
		result[i++] = res;
	}
	return result;
};
SoundSupport.makeSpeechRecognition = function(continuous,interimResults,maxAlternatives,lang) {
	if(SoundSupport.hasSpeechSupport) {
		var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
		var recognition = new SpeechRecognition();
		SoundSupport.setSpeechRecognitionContinious(recognition,continuous);
		SoundSupport.setSpeechRecognitionInterimResults(recognition,interimResults);
		SoundSupport.setSpeechRecognitionMaxAlternatives(recognition,maxAlternatives);
		if(lang != "") {
			SoundSupport.setSpeechRecognitionLang(recognition,lang);
		}
		return recognition;
	} else {
		return null;
	}
};
SoundSupport.startSpeechRecognition = function(recognition) {
	if(recognition != null) {
		recognition.stop();
		recognition.start();
		return function() {
			recognition.stop();
		};
	} else {
		return function() {
		};
	}
};
SoundSupport.setSpeechRecognitionContinious = function(recognition,continuous) {
	if(recognition != null) {
		recognition.continuous = continuous;
	}
};
SoundSupport.setSpeechRecognitionInterimResults = function(recognition,interimResults) {
	if(recognition != null) {
		recognition.interimResults = interimResults;
	}
};
SoundSupport.setSpeechRecognitionMaxAlternatives = function(recognition,maxAlternatives) {
	if(recognition != null) {
		recognition.maxAlternatives = maxAlternatives;
	}
};
SoundSupport.setSpeechRecognitionLang = function(recognition,lang) {
	if(recognition != null) {
		recognition.lang = lang;
	}
};
SoundSupport.setSpeechRecognitionServiceURI = function(recognition,uri) {
	if(recognition != null) {
		recognition.serviceURI = uri;
	}
};
SoundSupport.addSpeechRecognitionGrammar = function(recognition,grammar) {
	if(recognition != null) {
		recognition.grammars.addFromString(grammar,1);
	}
};
SoundSupport.addSpeechRecognitionGrammarFromURI = function(recognition,uri) {
	if(recognition != null) {
		recognition.grammars.addFromURI(uri,1);
	}
};
SoundSupport.clearSpeechRecognitionGrammars = function(recognition) {
	if(recognition != null) {
		var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
		recognition.grammars = new SpeechGrammarList();
	}
};
SoundSupport.addSpeechRecognitionEventListener = function(recognition,event,cb) {
	if(recognition != null) {
		if(event == "onresult") {
			recognition.onresult = function(e) {
				var i = e.resultIndex;
				while(i < e.results.length) {
					cb(e.results[i][0].transcript);
					++i;
				}
			};
		} else if(event == "onerror") {
			recognition.onerror = function(e) {
				cb("Error :");
			};
		} else if(event == "onnomatch") {
			recognition.onnomatch = function(e) {
				cb("No match :");
			};
		} else if(event == "onstart") {
			recognition.onstart = function(e) {
				cb("Started");
			};
		} else if(event == "onend") {
			recognition.onend = function(e) {
				cb("Ended");
			};
		} else if(event == "onspeechstart") {
			recognition.onspeechstart = function(e) {
				cb("Speech Started");
			};
		} else if(event == "onspeechend") {
			recognition.onspeechend = function(e) {
				cb("Speech Ended");
			};
		} else if(event == "onsoundstart") {
			recognition.onsoundstart = function(e) {
				cb("Sound Started");
			};
		} else if(event == "onsoundend") {
			recognition.onsoundend = function(e) {
				cb("Sound Ended");
			};
		} else if(event == "onaudiostart") {
			recognition.onaudiostart = function(e) {
				cb("Audio Started");
			};
		} else if(event == "onaudioend") {
			recognition.onaudioend = function(e) {
				cb("Audio Ended");
			};
		}
	}
};
SoundSupport.prototype = {
	__class__: SoundSupport
};
var Text = function(text,style,canvas) {
	this.orgCharIdxEnd = 0;
	this.orgCharIdxStart = 0;
	this.charIdx = 0;
	PIXI.Text.call(this,text,style,canvas);
};
Text.__name__ = true;
Text.__super__ = PIXI.Text;
Text.prototype = $extend(PIXI.Text.prototype,{
	update: function(mod,style,textDirection) {
		this.text = TextClip.bidiDecorate(mod.text,textDirection);
		this.modification = mod;
		this.style = style;
	}
	,__class__: Text
});
var TextMappedModification = function(text,modified,difPositionMapping,variants) {
	this.text = text;
	this.modified = modified;
	this.difPositionMapping = difPositionMapping;
	this.variants = variants;
};
TextMappedModification.__name__ = true;
TextMappedModification.createInvariantForString = function(text) {
	var positionsDiff = [];
	var vars = [];
	var _g = 0;
	var _g1 = text.length;
	while(_g < _g1) {
		var i = _g++;
		positionsDiff.push(0);
		vars.push(0);
	}
	return new TextMappedModification(text,text,positionsDiff,vars);
};
TextMappedModification.prototype = {
	substr: function(pos,len) {
		var ofsB = 0;
		var _g = 0;
		var _g1 = pos;
		while(_g < _g1) {
			var i = _g++;
			ofsB += this.difPositionMapping[i];
		}
		var ofsE = 0;
		var _g = pos;
		var _g1 = pos + len;
		while(_g < _g1) {
			var i = _g++;
			ofsE += this.difPositionMapping[i];
		}
		return new TextMappedModification(HxOverrides.substr(this.text,pos + ofsB,len + ofsE),HxOverrides.substr(this.modified,pos,len),this.difPositionMapping.slice(pos,pos + len),this.variants.slice(pos,pos + len));
	}
	,__class__: TextMappedModification
};
var UnicodeTranslation = function(rangeStart,rangeContentFlags) {
	this.rangeStart = rangeStart;
	this.rangeContentFlags = rangeContentFlags;
};
UnicodeTranslation.__name__ = true;
UnicodeTranslation.initMap = function() {
	var found = "";
	var h = UnicodeTranslation.map.h;
	var found_h = h;
	var found_keys = Object.keys(h);
	var found_length = found_keys.length;
	var found_current = 0;
	while(found_current < found_length) {
		var found1 = found_h[found_keys[found_current++]];
		break;
	}
	if(found == "") {
		var rangeStart = 65153;
		var flags = 33431376;
		var _g = 1570;
		while(_g < 1595) {
			var i = _g++;
			var is4range = flags & 1;
			flags >>= 1;
			var this1 = UnicodeTranslation.map;
			var k = String.fromCodePoint(i);
			var v = new UnicodeTranslation(rangeStart,3 + 12 * is4range);
			this1.h[k] = v;
			rangeStart += 2 + is4range * 2;
		}
		flags = 639;
		var _g = 1601;
		while(_g < 1611) {
			var i = _g++;
			var is4range = flags & 1;
			flags >>= 1;
			var this1 = UnicodeTranslation.map;
			var k = String.fromCodePoint(i);
			var v = new UnicodeTranslation(rangeStart,3 + 12 * is4range);
			this1.h[k] = v;
			rangeStart += 2 + is4range * 2;
		}
		var this1 = UnicodeTranslation.map;
		var k = String.fromCodePoint(rangeStart);
		var v = new UnicodeTranslation(rangeStart,3);
		this1.h[k] = v;
		rangeStart += 2;
		var this1 = UnicodeTranslation.map;
		var k = String.fromCodePoint(rangeStart);
		var v = new UnicodeTranslation(rangeStart,3);
		this1.h[k] = v;
		rangeStart += 2;
		var this1 = UnicodeTranslation.map;
		var k = String.fromCodePoint(rangeStart);
		var v = new UnicodeTranslation(rangeStart,3);
		this1.h[k] = v;
		rangeStart += 2;
		var this1 = UnicodeTranslation.map;
		var k = String.fromCodePoint(rangeStart);
		var v = new UnicodeTranslation(rangeStart,3);
		this1.h[k] = v;
		rangeStart += 2;
	}
};
UnicodeTranslation.getCharAvailableVariants = function(chr) {
	UnicodeTranslation.initMap();
	var unit = UnicodeTranslation.map.h[chr];
	if(unit == null) {
		return 1;
	}
	return unit.rangeContentFlags;
};
UnicodeTranslation.getCharVariant = function(chr,gv) {
	UnicodeTranslation.initMap();
	var unit = UnicodeTranslation.map.h[chr];
	if(unit == null) {
		return chr;
	}
	var tr_gv = unit.rangeContentFlags;
	if(0 == (tr_gv >> gv & 1)) {
		gv &= -3;
	}
	if(0 == (tr_gv >> gv & 1)) {
		gv &= -2;
	}
	var code = unit.rangeStart + gv;
	return String.fromCodePoint(code);
};
UnicodeTranslation.prototype = {
	__class__: UnicodeTranslation
};
var TextClip = function(worldVisible) {
	if(worldVisible == null) {
		worldVisible = false;
	}
	this.preventCheckTextNodeWidth = false;
	this.preventEnsureCurrentInputVisible = false;
	this.preventMouseUpEvent = false;
	this.preventSelectEvent = false;
	this.doNotRemap = false;
	this.needBaseline = true;
	this.preventContextMenu = false;
	this.isInteractive = false;
	this.isFocused = false;
	this.isInput = false;
	this.textClipChanged = false;
	this.textClip = null;
	this.TextInputKeyUpFilters = [];
	this.TextInputKeyDownFilters = [];
	this.TextInputEventFilters = [];
	this.TextInputFilters = [];
	this.multiline = false;
	this.background = null;
	this.selectionEnd = 0;
	this.selectionStart = 0;
	this.cursorPosition = 0;
	this.maxChars = -1;
	this.readOnly = false;
	this.autoAlign = "AutoAlignNone";
	this.cropWords = false;
	this.doNotInvalidateStage = false;
	this.step = 1.0;
	this.autocomplete = "";
	this.type = "text";
	this.style = new PIXI.TextStyle();
	this.skipOrderCheck = false;
	this.escapeHTML = true;
	this.textDirection = "";
	this.cursorWidth = 2;
	this.cursorOpacity = -1.0;
	this.cursorColor = -1;
	this.backgroundOpacity = 0.0;
	this.backgroundColor = 0;
	this.charIdx = 0;
	this.contentGlyphsDirection = "";
	this.contentGlyphs = TextClip.dummyContentGlyphs;
	this.text = "";
	NativeWidgetClip.call(this,worldVisible);
	this.style.resolution = 1.0;
	this.style.wordWrap = false;
	this.style.wordWrapWidth = 2048.0;
	this.keepNativeWidget = TextClip.KeepTextClips;
};
TextClip.__name__ = true;
TextClip.recalculateUseTextBackgroundWidget = function() {
	TextClip.useTextBackgroundWidget = RenderSupport.RendererType == "html" && Util.getParameter("textBackgroundWidget") != "0";
};
TextClip.isRtlChar = function(ch) {
	var code = HxOverrides.cca(ch,0);
	if(!(code >= 1424 && code < 2304 || code >= 64285 && code < 64976 || code >= 65008 && code < 65024)) {
		if(code >= 65136) {
			return code < 65280;
		} else {
			return false;
		}
	} else {
		return true;
	}
};
TextClip.isLtrChar = function(ch) {
	var code = HxOverrides.cca(ch,0);
	if(!(code >= 48 && code < 58 || code >= 65 && code < 91 || code >= 97 && code < 123 || code >= 161 && code < 1424 || code >= 1792 && code < 8192 || code >= 8448 && code < 8592 || code >= 9312 && code < 9472 || code >= 10240 && code < 10496 || code >= 11904 && code < 12288 || code >= 12352 && code < 55296 || code >= 63744 && code < 64285 || code >= 65056 && code < 65136)) {
		if(code >= 65280) {
			return code < 65520;
		} else {
			return false;
		}
	} else {
		return true;
	}
};
TextClip.getStringDirection = function(s,dflt) {
	var flagsR = 0;
	var _g = 0;
	var _g1 = s.length;
	while(_g < _g1) {
		var i = _g++;
		var c = s.charAt(i);
		if(TextClip.isRtlChar(c)) {
			flagsR |= 2;
		}
		if(TextClip.isLtrChar(c)) {
			flagsR |= 1;
		}
	}
	if(flagsR == 2) {
		return "rtl";
	}
	if(flagsR == 1) {
		return "ltr";
	}
	return dflt;
};
TextClip.isStringRtl = function(s) {
	return TextClip.getStringDirection(s,null) == "rtl";
};
TextClip.isCharCombining = function(testChr,pos) {
	var chr = HxOverrides.cca(testChr,pos);
	if(!(chr >= 768 && chr < 880 || chr >= 1155 && chr < 1160 || chr >= 1425 && chr < 1480 || chr >= 1552 && chr < 1563 || chr >= 1611 && chr < 1632 || chr == 1648 || chr >= 1750 && chr < 1774 || chr == 1809 || chr >= 1840 && chr < 2036 || chr >= 2070 && chr < 2094 || chr >= 2137 && chr < 2140 || chr >= 2260 && chr < 2307 || chr >= 2362 && chr < 2365 || chr >= 2369 && chr < 2382 || chr >= 2385 && chr < 2392 || chr >= 2402 && chr < 2404 || chr == 2433 || chr == 2492 || chr >= 2497 && chr < 2501 || chr == 2492 || chr >= 2530 && chr < 2531 || chr >= 2561 && chr < 2563 || chr == 2620 || chr >= 2625 && chr < 2627 || chr >= 2631 && chr < 2633 || chr >= 2635 && chr < 2638 || chr == 2641 || chr >= 2672 && chr < 2674 || chr == 2677 || chr >= 2689 && chr < 2691 || chr == 2748 || chr >= 2753 && chr < 2766 || chr >= 2786 && chr < 2788 || chr >= 2810 && chr < 2816 || chr == 2817 || chr == 2876 || chr == 2879 || chr >= 2881 && chr < 2885 || chr == 2893 || chr == 2902 || chr >= 2914 && chr < 2916 || chr == 2946 || chr == 3008 || chr == 3021 || chr == 3072 || chr >= 3134 && chr < 3137 || chr >= 3142 && chr < 3150 && chr != 3145 || chr >= 3157 && chr < 3159 || chr >= 3170 && chr < 3172 || chr == 3201 || chr == 3260 || chr == 3263 || chr == 3270 || chr >= 3276 && chr < 3278 || chr >= 3298 && chr < 3300)) {
		if(chr >= 6832) {
			return chr < 6912;
		} else {
			return false;
		}
	} else {
		return true;
	}
};
TextClip.getBulletsString = function(t) {
	var bullet = String.fromCodePoint(8226);
	var i = 0;
	var ret = "";
	var positionsDiff = [];
	var vars = [];
	var _g = 0;
	var _g1 = t.length;
	while(_g < _g1) {
		var i = _g++;
		ret += bullet;
		positionsDiff.push(0);
		vars.push(0);
	}
	return new TextMappedModification(ret,ret,positionsDiff,vars);
};
TextClip.getActualGlyphsString = function(t) {
	var positionsDiff = [];
	var vars = [];
	var lret = "";
	var i = 0;
	while(i < t.length) {
		var subst = null;
		var _g = 0;
		var _g1 = TextClip.LIGA_LENGTHS;
		while(_g < _g1.length) {
			var ll = _g1[_g];
			++_g;
			var cand = HxOverrides.substr(t,i,ll);
			subst = TextClip.LIGATURES.h[cand];
			if(subst != null) {
				positionsDiff.push(ll - 1);
				lret += subst;
				i += ll;
				break;
			}
		}
		if(subst == null) {
			lret += HxOverrides.substr(t,i,1);
			positionsDiff.push(0);
			++i;
		}
	}
	var gv = 0;
	i = -1;
	var ret = "";
	var rightConnect = false;
	while(i <= lret.length) {
		var j = i + 1;
		while(j < lret.length && TextClip.isCharCombining(lret,j)) ++j;
		var conMask = UnicodeTranslation.getCharAvailableVariants(j >= lret.length ? "" : HxOverrides.substr(lret,j,1));
		if((conMask & 3) != 3) {
			gv &= 1;
		}
		vars.push(gv);
		var chr = i >= 0 ? UnicodeTranslation.getCharVariant(HxOverrides.substr(lret,i,1),gv) : "";
		if((conMask & 12) != 0) {
			gv = rightConnect ? 3 : 2;
			rightConnect = true;
		} else {
			gv = rightConnect ? 1 : 0;
			rightConnect = false;
		}
		ret += chr + HxOverrides.substr(lret,i + 1,j - i - 1);
		i = j;
	}
	return new TextMappedModification(t,ret,positionsDiff,vars.slice(1,-1));
};
TextClip.checkTextLength = function(text) {
	var textSplit = text.split("\n");
	var _g = [];
	var _g1 = 0;
	var _g2 = textSplit;
	while(_g1 < _g2.length) {
		var v = _g2[_g1];
		++_g1;
		if(v.length > 1000) {
			_g.push(v);
		}
	}
	if(_g.length > 0) {
		var result = new Array(textSplit.length);
		var _g = 0;
		var _g1 = textSplit.length;
		while(_g < _g1) {
			var i = _g++;
			var t = textSplit[i];
			result[i] = t.length > 1000 ? TextClip.splitString(t) : [t];
		}
		return result;
	} else {
		return [[text]];
	}
};
TextClip.splitString = function(text) {
	if(text.length > 1000) {
		return [HxOverrides.substr(text,0,1000)].concat(TextClip.splitString(HxOverrides.substr(text,1000,null)));
	} else if(text.length > 0) {
		return [text];
	} else {
		return [];
	}
};
TextClip.getAdvancedWidths = function(key,style) {
	if(RenderSupport.WebFontsConfig.custom.metrics.hasOwnProperty(style.fontFamily) && RenderSupport.WebFontsConfig.custom.metrics[style.fontFamily].advanceWidth.hasOwnProperty(key)) {
		return RenderSupport.WebFontsConfig.custom.metrics[style.fontFamily].advanceWidth[key];
	}
	var mtxI = PIXI.TextMetrics.measureText(key,style);
	var mtx3 = PIXI.TextMetrics.measureText("ن" + key + "ن",style);
	var mtx2 = PIXI.TextMetrics.measureText("نن",style);
	var iso = [Math.round(mtxI.width * 2048.0 / style.fontSize / key.length)];
	var med = [Math.round((mtx3.width - mtx2.width) * 2048.0 / style.fontSize / key.length)];
	if(key.length != 1 || UnicodeTranslation.getCharAvailableVariants(key) != 15) {
		while(iso.length < key.length) {
			iso.push(iso[0]);
			med.push(med[0]);
		}
		return [iso,med,iso,med];
	}
	return [iso,iso,med,med];
};
TextClip.measureTextModFrag = function(tm,style,b,e) {
	var bochi = -1;
	var bgchi = -1;
	var egchi = 0;
	var eochi = 0;
	var bgb = 0;
	var egb = 0;
	while(eochi < e) {
		eochi += 1 + tm.difPositionMapping[egchi];
		++egchi;
		if(eochi >= b && bochi < 0) {
			bochi = eochi;
			bgchi = egchi;
		}
	}
	if(bochi < 0) {
		bochi = 0;
		bgchi = 0;
	}
	if(bochi > b) {
		--bochi;
		++bgb;
	}
	if(eochi > e) {
		--eochi;
		++egb;
	}
	if(bochi > eochi || bochi < 0) {
		return -1.0;
	}
	var scriptingFixSuffix = "";
	if(TextClip.isRtlChar(HxOverrides.substr(tm.text,eochi,1))) {
		scriptingFixSuffix = "ث";
	}
	var mtxb = PIXI.TextMetrics.measureText(HxOverrides.substr(tm.text,0,bochi) + scriptingFixSuffix,style);
	var mtxe = PIXI.TextMetrics.measureText(HxOverrides.substr(tm.text,0,eochi) + scriptingFixSuffix,style);
	return mtxe.width - mtxb.width;
};
TextClip.adaptWhitespaces = function(textContent) {
	return StringTools.replace(StringTools.startsWith(textContent," ") ? " " + textContent.substring(1) : textContent,"\t"," ");
};
TextClip.bidiDecorate = function(text,dir) {
	if(text == "<" || text == ">") {
		return text;
	}
	if(dir == "ltr") {
		return String.fromCodePoint(8234) + text + String.fromCodePoint(8236);
	} else if(dir == "rtl") {
		return String.fromCodePoint(8235) + text + String.fromCodePoint(8236);
	} else {
		return text;
	}
};
TextClip.bidiUndecorate = function(text) {
	if(HxOverrides.cca(text,text.length - 1) == 8236) {
		if(HxOverrides.cca(text,0) == 8234) {
			return [HxOverrides.substr(text,1,text.length - 2),"ltr"];
		}
		if(HxOverrides.cca(text,0) == 8235) {
			return [HxOverrides.substr(text,1,text.length - 2),"rtl"];
		}
	}
	return [text,""];
};
TextClip.capitalize = function(s) {
	return HxOverrides.substr(s,0,1).toUpperCase() + HxOverrides.substr(s,1,s.length - 1);
};
TextClip.recognizeBuiltinFont = function(fontFamily,fontWeight,fontSlope) {
	if(StringTools.startsWith(fontFamily,"'Material Icons")) {
		return "MaterialIcons";
	} else if(StringTools.startsWith(fontFamily,"'DejaVu Sans")) {
		return "DejaVuSans";
	} else if(StringTools.startsWith(fontFamily,"'Franklin Gothic")) {
		if(fontSlope == "italic") {
			return "Italic";
		} else if(fontWeight == 700) {
			return "Bold";
		} else {
			return "Book";
		}
	} else if(StringTools.startsWith(fontFamily,"'Roboto")) {
		if(fontFamily + (fontWeight <= 100 ? "Thin" : fontWeight <= 200 ? "Ultra Light" : fontWeight <= 300 ? "Light" : fontWeight <= 400 ? "Book" : fontWeight <= 500 ? "Medium" : fontWeight <= 600 ? "Semi Bold" : fontWeight <= 700 ? "Bold" : fontWeight <= 800 ? "Extra Bold" : "Black") + fontSlope == "normal") {
			return "";
		} else {
			return HxOverrides.substr(fontSlope,0,1).toUpperCase() + HxOverrides.substr(fontSlope,1,fontSlope.length - 1);
		}
	} else {
		return fontFamily;
	}
};
TextClip.fontWeightToString = function(fontWeight) {
	if(fontWeight <= 100) {
		return "Thin";
	} else if(fontWeight <= 200) {
		return "Ultra Light";
	} else if(fontWeight <= 300) {
		return "Light";
	} else if(fontWeight <= 400) {
		return "Book";
	} else if(fontWeight <= 500) {
		return "Medium";
	} else if(fontWeight <= 600) {
		return "Semi Bold";
	} else if(fontWeight <= 700) {
		return "Bold";
	} else if(fontWeight <= 800) {
		return "Extra Bold";
	} else {
		return "Black";
	}
};
TextClip.isJapaneseFont = function(st) {
	if(st.fontFamily != "Meiryo") {
		return st.fontFamily == "MeiryoBold";
	} else {
		return true;
	}
};
TextClip.useHTMLMeasurementJapaneseFont = function(st) {
	if(TextClip.isMeiryoAvailable) {
		return false;
	}
	var checkMeyrioFont = function() {
		var res = false;
		document.fonts.forEach(v => {
				if (!res) {
					res = v.family == "Meiryo";
				}
			});
		if(res) {
			TextClip.isMeiryoAvailable = true;
		}
		return res;
	};
	if(TextClip.isJapaneseFont(st)) {
		return !checkMeyrioFont();
	} else {
		return false;
	}
};
TextClip.getTextNodeMetrics = function(nativeWidget,useCheck) {
	var textNodeMetrics = { };
	if(nativeWidget == null || nativeWidget.lastChild == null) {
		textNodeMetrics.width = 0;
		textNodeMetrics.height = 0;
		textNodeMetrics.x = 0;
	} else {
		var textNode = useCheck ? nativeWidget.lastChild : nativeWidget;
		if(useCheck) {
			TextClip.updateTextNodesWidth(nativeWidget.childNodes,textNodeMetrics);
		}
		TextClip.updateTextNodeHeight(textNode,textNodeMetrics,useCheck);
	}
	return textNodeMetrics;
};
TextClip.updateTextNodesWidth = function(children,textNodeMetrics) {
	textNodeMetrics.width = 0;
	textNodeMetrics.updateOffset = true;
	var _g = 0;
	var _g1 = children.length;
	while(_g < _g1) {
		var i = _g++;
		TextClip.updateTextNodeWidth(children[i],textNodeMetrics);
	}
};
TextClip.updateTextNodeWidth = function(textNode,textNodeMetrics) {
	var svg = window.document.createElementNS("http://www.w3.org/2000/svg","svg");
	var textElement = window.document.createElementNS("http://www.w3.org/2000/svg","text");
	var computedStyle = window.getComputedStyle(textNode.parentNode);
	textElement.setAttribute("font-family",computedStyle.fontFamily);
	textElement.setAttribute("font-size",computedStyle.fontSize);
	textElement.setAttribute("font-style",computedStyle.fontStyle);
	textElement.setAttribute("letter-spacing",computedStyle.letterSpacing);
	textElement.textContent = textNode.textContent;
	svg.appendChild(textElement);
	window.document.body.appendChild(svg);
	var bbox = textElement.getBBox();
	window.document.body.removeChild(svg);
	textNodeMetrics.width += bbox.width;
	if(textNodeMetrics.updateOffset && (textNode.classList == null || !textNode.classList.contains("baselineWidget"))) {
		textNodeMetrics.x = bbox.x;
		textNodeMetrics.updateOffset = false;
	}
};
TextClip.updateTextNodeHeight = function(textNode,textNodeMetrics,useCheck) {
	if(window.document.createRange != null) {
		var range = window.document.createRange();
		range.selectNodeContents(textNode);
		if(range.getBoundingClientRect != null) {
			var rect = range.getBoundingClientRect();
			if(rect != null) {
				var viewportScale = RenderSupport.getViewportScale();
				if(!useCheck) {
					textNodeMetrics.width = (rect.right - rect.left) * viewportScale;
				}
				textNodeMetrics.height = (rect.bottom - rect.top) * viewportScale;
			}
		}
	}
};
TextClip.__super__ = NativeWidgetClip;
TextClip.prototype = $extend(NativeWidgetClip.prototype,{
	getCharXPosition: function(charIdx) {
		this.layoutText();
		var _g = 0;
		var _g1 = this.children;
		while(_g < _g1.length) {
			var child = _g1[_g];
			++_g;
			var c = child;
			if(c.text == null) {
				continue;
			}
			if(c.orgCharIdxStart <= charIdx && c.orgCharIdxEnd >= charIdx) {
				var result = TextClip.measureTextModFrag(c.modification,c.style,0,charIdx - c.orgCharIdxStart);
				var ctext = TextClip.bidiUndecorate(c.text);
				if(ctext[1] == "rtl") {
					return c.width - result;
				}
				return result;
			}
		}
		return -1.0;
	}
	,updateNativeWidgetStyle: function() {
		if(this.metrics == null && !this.isInput && this.escapeHTML) {
			return;
		}
		NativeWidgetClip.prototype.updateNativeWidgetStyle.call(this);
		var alpha;
		if((RenderSupport.RendererType == "html" || this.isHTML) && !this.isCanvas && !RenderSupport.RenderContainers) {
			if(this.parentClip && this.parentClip.worldAlpha > 0) {
				alpha = this.worldAlpha / this.parentClip.worldAlpha;
			} else if(this.parent != null && !this.parent.isNativeWidget) {
				var clip = this.parent;
				alpha = this.alpha * ((RenderSupport.RendererType == "html" || clip.isHTML) && !clip.isCanvas && !RenderSupport.RenderContainers ? clip.parentClip && clip.parentClip.worldAlpha > 0 ? clip.worldAlpha / clip.parentClip.worldAlpha : clip.parent != null && !clip.parent.isNativeWidget ? clip.alpha * DisplayObjectHelper.getNativeWidgetAlpha(clip.parent) : clip.alpha : clip.alpha);
			} else {
				alpha = this.alpha;
			}
		} else {
			alpha = this.alpha;
		}
		if(this.isInput) {
			this.nativeWidget.setAttribute("inputMode",this.type == "number" ? "numeric" : this.type);
			if(!this.multiline) {
				this.nativeWidget.setAttribute("type",this.type);
			}
			this.nativeWidget.value = this.text;
			this.nativeWidget.style.whiteSpace = "pre-wrap";
			this.nativeWidget.style.pointerEvents = this.readOnly ? "none" : "auto";
			this.nativeWidget.readOnly = this.readOnly;
			if(this.cursorColor >= 0) {
				this.nativeWidget.style.caretColor = RenderSupport.makeCSSColor(this.cursorColor,this.cursorOpacity);
			}
			if(this.type == "number") {
				this.nativeWidget.step = this.step;
				this.nativeWidget.addEventListener("wheel",function(e) {
					e.preventDefault();
				});
			}
			this.nativeWidget.autocomplete = this.autocomplete != "" ? this.autocomplete : "off";
			if(this.maxChars >= 0) {
				this.nativeWidget.maxLength = this.maxChars;
			}
			if(this.multiline) {
				this.nativeWidget.style.resize = "none";
			}
			this.nativeWidget.style.cursor = this.isFocused ? "text" : "inherit";
			var tmp;
			switch(this.textDirection) {
			case "RTL":
				tmp = "rtl";
				break;
			case "rtl":
				tmp = "rtl";
				break;
			default:
				tmp = null;
			}
			this.nativeWidget.style.direction = tmp;
			if(Platform.isEdge || Platform.isIE) {
				var slicedColor = this.style.fill.split(",");
				var newColor = slicedColor.slice(0,3).join(",") + ",";
				var newColor1 = this.isFocused ? alpha : 0;
				var newColor2 = newColor + parseFloat(slicedColor[3]) * newColor1 + ")";
				this.nativeWidget.style.color = newColor2;
			} else {
				this.nativeWidget.style.opacity = RenderSupport.RendererType != "canvas" || this.isFocused ? alpha : 0;
				this.nativeWidget.style.color = this.style.fill;
			}
		} else {
			if(this.escapeHTML) {
				if(Platform.isIE && this.isMaterialIconFont()) {
					this.nativeWidget.textContent = this.contentGlyphs.modified;
				} else {
					var textContent = this.calculateTextContent();
					this.nativeWidget.textContent = textContent;
					if(this.textBackgroundWidget != null) {
						this.textBackgroundWidget.textContent = textContent;
					}
				}
				var tmp = TextClip.isJapaneseFont(this.style) && this.style.wordWrap;
				this.nativeWidget.style.whiteSpace = tmp ? "pre-wrap" : "pre";
				var tmp;
				switch(this.textDirection) {
				case "RTL":
					tmp = "rtl";
					break;
				case "rtl":
					tmp = "rtl";
					break;
				default:
					tmp = null;
				}
				this.baselineWidget.style.direction = this.nativeWidget.style.direction = tmp;
			} else {
				this.nativeWidget.innerHTML = this.contentGlyphs.modified;
				if(this.textBackgroundWidget != null) {
					this.textBackgroundWidget.innerHTML = this.contentGlyphs.modified;
				}
				this.nativeWidget.style.whiteSpace = Native.isNew && !this.style.wordWrap ? "pre" : "pre-wrap";
				var children = this.nativeWidget.getElementsByTagName("*");
				var _g = 0;
				while(_g < children.length) {
					var child = children[_g];
					++_g;
					if(child != this.baselineWidget) {
						child.className = "inlineWidget";
					}
				}
				var tmp;
				switch(this.textDirection) {
				case "RTL":
					tmp = "rtl";
					break;
				case "rtl":
					tmp = "rtl";
					break;
				default:
					tmp = null;
				}
				this.baselineWidget.style.direction = this.nativeWidget.style.direction = tmp;
			}
			this.nativeWidget.style.opacity = alpha != 1 || Platform.isIE ? alpha : null;
			this.nativeWidget.style.color = this.style.fill;
		}
		this.nativeWidget.style.letterSpacing = !((RenderSupport.RendererType == "html" || this.isHTML) && !this.isCanvas) || this.style.letterSpacing != 0 ? "" + Std.string(this.style.letterSpacing) + "px" : null;
		this.nativeWidget.style.wordSpacing = !((RenderSupport.RendererType == "html" || this.isHTML) && !this.isCanvas) || this.style.wordSpacing != 0 ? "" + Std.string(this.style.wordSpacing) + "px" : null;
		this.nativeWidget.style.fontFamily = !((RenderSupport.RendererType == "html" || this.isHTML) && !this.isCanvas) || Platform.isIE || this.style.fontFamily != "Roboto" ? this.style.fontFamily : null;
		this.nativeWidget.style.fontWeight = !((RenderSupport.RendererType == "html" || this.isHTML) && !this.isCanvas) || this.style.fontWeight != 400 ? this.style.fontWeight : null;
		this.nativeWidget.style.fontStyle = !((RenderSupport.RendererType == "html" || this.isHTML) && !this.isCanvas) || this.style.fontStyle != "normal" ? this.style.fontStyle : null;
		this.nativeWidget.style.fontSize = "" + Std.string(this.style.fontSize) + "px";
		var bg = !((RenderSupport.RendererType == "html" || this.isHTML) && !this.isCanvas) || this.backgroundOpacity > 0 ? RenderSupport.makeCSSColor(this.backgroundColor,this.backgroundOpacity) : null;
		if(this.textBackgroundWidget != null) {
			this.textBackgroundWidget.style.background = bg;
		} else {
			this.nativeWidget.style.background = bg;
		}
		this.nativeWidget.wrap = this.style.wordWrap ? "soft" : "off";
		var n = !this.isMaterialIconFont() || this.metrics == null ? this.style.lineHeight + this.style.leading : this.metrics.height;
		this.nativeWidget.style.lineHeight = "" + (RenderSupport.RoundPixels ? Math.round(n) : Math.round(n * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio)) + "px";
		var tmp;
		switch(this.autoAlign) {
		case "AutoAlignCenter":
			tmp = "center";
			break;
		case "AutoAlignJustify":
			tmp = "justify";
			break;
		case "AutoAlignLeft":
			tmp = null;
			break;
		case "AutoAlignNone":
			tmp = "none";
			break;
		case "AutoAlignRight":
			tmp = "right";
			break;
		default:
			tmp = null;
		}
		this.nativeWidget.style.textAlign = tmp;
		if(this.nativeWidget.style.textAlign == "justify") {
			this.nativeWidget.style.whiteSpace = "normal";
		}
		if(TextClip.useTextBackgroundWidget && this.nativeWidget.firstChild && this.textBackgroundWidget != null && this.textBackgroundWidget.style.background != "") {
			this.nativeWidget.insertBefore(this.textBackgroundWidget,this.nativeWidget.firstChild);
			var tmp = "" + this.getTextMargin();
			this.textBackgroundWidget.style.top = tmp + "px";
		}
		if((RenderSupport.RendererType == "html" || this.isHTML) && !this.isCanvas && this.isNativeWidget && this.needBaseline) {
			if(!this.isInput && this.nativeWidget.firstChild != null && !this.isMaterialIconFont()) {
				if(this.style.fontStyle == "italic") {
					var lineHeightGap = this.getLineHeightGap();
					var transform;
					if((RenderSupport.RendererType == "html" || this.isHTML) && !this.isCanvas) {
						var transform1;
						if(!(!this.parentClip || RenderSupport.RenderContainers)) {
							var clip = this.parent;
							transform1 = clip == null ? false : clip.isHTMLStageContainer;
						} else {
							transform1 = true;
						}
						if(transform1) {
							if(this.localTransformChanged) {
								this.transform.updateLocalTransform();
							}
							transform = this.localTransform;
						} else {
							transform = DisplayObjectHelper.prependInvertedMatrix(this.worldTransform,this.parentClip.worldTransform);
						}
					} else {
						transform = this.accessWidget != null ? this.accessWidget.getAccessWidgetTransform() : this.worldTransform;
					}
					var n = transform.ty;
					var top = RenderSupport.RoundPixels ? Math.round(n) : Math.round(n * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio);
					this.baselineWidget.style.height = "" + Math.round(this.style.fontProperties.fontSize + lineHeightGap + top) + "px";
					var tmp = "" + Math.round(this.getTextMargin() + lineHeightGap + top);
					this.textBackgroundWidget.style.top = tmp + "px";
					this.nativeWidget.style.top = 0;
				} else {
					var tmp = "" + Math.round(this.style.fontProperties.fontSize + this.getLineHeightGap());
					this.baselineWidget.style.height = tmp + "px";
				}
				this.baselineWidget.style.direction = this.textDirection;
				var tmp = "" + -this.getTextMargin();
				this.nativeWidget.style.marginTop = tmp + "px";
				this.nativeWidget.insertBefore(this.baselineWidget,this.nativeWidget.firstChild);
				this.updateAmiriItalicWorkaroundWidget();
			} else if(this.baselineWidget.parentNode != null) {
				this.baselineWidget.parentNode.removeChild(this.baselineWidget);
			}
		}
	}
	,updateBaselineWidget: function() {
		if((RenderSupport.RendererType == "html" || this.isHTML) && !this.isCanvas && this.isNativeWidget && this.needBaseline) {
			if(!this.isInput && this.nativeWidget.firstChild != null && !this.isMaterialIconFont()) {
				if(this.style.fontStyle == "italic") {
					var lineHeightGap = this.getLineHeightGap();
					var transform;
					if((RenderSupport.RendererType == "html" || this.isHTML) && !this.isCanvas) {
						var transform1;
						if(!(!this.parentClip || RenderSupport.RenderContainers)) {
							var clip = this.parent;
							transform1 = clip == null ? false : clip.isHTMLStageContainer;
						} else {
							transform1 = true;
						}
						if(transform1) {
							if(this.localTransformChanged) {
								this.transform.updateLocalTransform();
							}
							transform = this.localTransform;
						} else {
							transform = DisplayObjectHelper.prependInvertedMatrix(this.worldTransform,this.parentClip.worldTransform);
						}
					} else {
						transform = this.accessWidget != null ? this.accessWidget.getAccessWidgetTransform() : this.worldTransform;
					}
					var n = transform.ty;
					var top = RenderSupport.RoundPixels ? Math.round(n) : Math.round(n * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio);
					this.baselineWidget.style.height = "" + Math.round(this.style.fontProperties.fontSize + lineHeightGap + top) + "px";
					var tmp = "" + Math.round(this.getTextMargin() + lineHeightGap + top);
					this.textBackgroundWidget.style.top = tmp + "px";
					this.nativeWidget.style.top = 0;
				} else {
					var tmp = "" + Math.round(this.style.fontProperties.fontSize + this.getLineHeightGap());
					this.baselineWidget.style.height = tmp + "px";
				}
				this.baselineWidget.style.direction = this.textDirection;
				var tmp = "" + -this.getTextMargin();
				this.nativeWidget.style.marginTop = tmp + "px";
				this.nativeWidget.insertBefore(this.baselineWidget,this.nativeWidget.firstChild);
				this.updateAmiriItalicWorkaroundWidget();
			} else if(this.baselineWidget.parentNode != null) {
				this.baselineWidget.parentNode.removeChild(this.baselineWidget);
			}
		}
	}
	,updateAmiriItalicWorkaroundWidget: function() {
		if((Platform.isChrome || Platform.isEdge) && this.style.fontFamily == "Amiri" && this.style.fontStyle == "italic" && this.nativeWidget.textContent[0] != "" && !this.isCharLetter(this.nativeWidget.textContent[0])) {
			if(this.amiriItalicWorkaroundWidget == null) {
				var txt = "t";
				var charMetrics = PIXI.TextMetrics.measureText(txt,this.style);
				this.amiriItalicWorkaroundWidget = window.document.createElement("span");
				this.amiriItalicWorkaroundWidget.style.position = "relative";
				this.amiriItalicWorkaroundWidget.style.marginRight = "" + -charMetrics.width + "px";
				this.amiriItalicWorkaroundWidget.style.opacity = "0";
				this.amiriItalicWorkaroundWidget.textContent = txt;
				this.nativeWidget.insertBefore(this.amiriItalicWorkaroundWidget,this.nativeWidget.firstChild);
			}
		}
	}
	,isCharLetter: function(char) {
		return char.toLowerCase() != char.toUpperCase();
	}
	,updateTextBackgroundWidget: function() {
		if(TextClip.useTextBackgroundWidget && this.nativeWidget.firstChild && this.textBackgroundWidget != null && this.textBackgroundWidget.style.background != "") {
			this.nativeWidget.insertBefore(this.textBackgroundWidget,this.nativeWidget.firstChild);
			var tmp = "" + this.getTextMargin();
			this.textBackgroundWidget.style.top = tmp + "px";
		}
	}
	,getTextMargin: function() {
		var n = this.style.fontProperties.descent;
		var n1;
		if((RenderSupport.RendererType == "html" || this.isHTML) && !this.isCanvas) {
			var n2;
			if(!(!this.parentClip || RenderSupport.RenderContainers)) {
				var clip = this.parent;
				n2 = clip == null ? false : clip.isHTMLStageContainer;
			} else {
				n2 = true;
			}
			if(n2) {
				if(this.localTransformChanged) {
					this.transform.updateLocalTransform();
				}
				n1 = this.localTransform;
			} else {
				n1 = DisplayObjectHelper.prependInvertedMatrix(this.worldTransform,this.parentClip.worldTransform);
			}
		} else {
			n1 = this.accessWidget != null ? this.accessWidget.getAccessWidgetTransform() : this.worldTransform;
		}
		var n2 = n * n1.d;
		if(RenderSupport.RoundPixels) {
			return Math.round(n2);
		} else {
			return Math.round(n2 * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio);
		}
	}
	,getLineHeightGap: function() {
		return (this.style.lineHeight - Math.ceil(this.style.fontSize * 1.15)) / 2.0;
	}
	,calculateTextContent: function() {
		var textContent = "";
		var textLines = this.metrics.lines;
		var _g = 0;
		while(_g < textLines.length) {
			var line = textLines[_g];
			++_g;
			textContent = textContent + line + "\n";
		}
		if(textLines.length > 0) {
			textContent = textContent.substring(0,textContent.length - 1);
		}
		return textContent;
	}
	,setTextAndStyle: function(text,fontFamilies,fontSize,fontWeight,fontSlope,fillColor,fillOpacity,letterSpacing,backgroundColor,backgroundOpacity) {
		RenderSupport.emitUserStyleChanged();
		if(fontWeight > 0 || fontSlope != "") {
			
			if (TextClip.ffMap === undefined) TextClip.ffMap = {}
			if (TextClip.ffMap[fontFamilies] === undefined) {
				TextClip.ffMap[fontFamilies] = fontFamilies.split(',').map(function(fontFamily){ return TextClip.recognizeBuiltinFont(fontFamily, fontWeight, fontSlope); }).join(',');
			}
			fontFamilies = TextClip.ffMap[fontFamilies];
			;
		}
		if(Platform.isFirefox && RenderSupport.RendererType == "html" && window.document.documentElement.lang == "ar" && StringTools.startsWith(fontFamilies,"Roboto")) {
			if(Platform.isWindows) {
				fontFamilies += ", Segoe UI";
			} else if(Platform.isLinux) {
				fontFamilies += ", DejaVu Sans";
			} else if(Platform.isMacintosh) {
				fontFamilies += ", Geeza Pro";
			}
		}
		if(Platform.isSafari) {
			fontSize = Math.round(fontSize);
		}
		var fontStyle = FlowFontStyle.fromFlowFonts(fontFamilies);
		this.doNotRemap = fontStyle.doNotRemap;
		this.style.fontSize = Math.max(fontSize,0.6);
		this.style.fill = RenderSupport.makeCSSColor(fillColor,fillOpacity);
		var f = RenderSupport.UserDefinedLetterSpacingPercent;
		if(isFinite(f) && RenderSupport.UserDefinedLetterSpacingPercent != 0.0) {
			this.style.letterSpacing = RenderSupport.UserDefinedLetterSpacingPercent * this.style.fontSize;
		} else {
			var f = RenderSupport.UserDefinedLetterSpacing;
			if(isFinite(f) && RenderSupport.UserDefinedLetterSpacing != 0.0) {
				this.style.letterSpacing = RenderSupport.UserDefinedLetterSpacing;
			} else {
				this.style.letterSpacing = letterSpacing;
			}
		}
		this.style.fontFamily = fontStyle.family;
		this.style.fontWeight = fontWeight != 400 ? "" + fontWeight : fontStyle.weight;
		this.style.fontStyle = fontSlope != "" ? fontSlope : fontStyle.style;
		var lineHeightPercent = this.style.lineHeightPercent != null ? this.style.lineHeightPercent : RenderSupport.UserDefinedLineHeightPercent;
		this.style.lineHeight = Math.ceil(lineHeightPercent * this.style.fontSize);
		this.style.align = this.autoAlign == "AutoAlignRight" ? "right" : this.autoAlign == "AutoAlignCenter" ? "center" : "left";
		this.style.padding = Math.ceil(fontSize * 0.2);
		var f = RenderSupport.UserDefinedWordSpacingPercent;
		if(isFinite(f) && RenderSupport.UserDefinedWordSpacingPercent != 0.0) {
			this.style.wordSpacing = RenderSupport.UserDefinedWordSpacingPercent * this.style.fontSize;
		}
		this.measureFont();
		this.text = (text !== '' && text.charAt(text.length-1) === '\n') ? text.slice(0, text.length-1) : text;
		this.contentGlyphs = this.applyTextMappedModification((RenderSupport.RendererType == "html" || this.isHTML) && !this.isCanvas ? TextClip.adaptWhitespaces(this.text) : this.text);
		this.contentGlyphsDirection = TextClip.getStringDirection(this.contentGlyphs.text,this.textDirection);
		this.backgroundColor = backgroundColor;
		this.backgroundOpacity = backgroundOpacity;
		if(this.nativeWidget != null && this.isInput) {
			var selectionStartPrev = this.nativeWidget.selectionStart;
			var selectionEndPrev = this.nativeWidget.selectionEnd;
			this.nativeWidget.value = text;
			this.setSelection(selectionStartPrev,selectionEndPrev);
		}
		if((RenderSupport.RendererType == "html" || this.isHTML) && !this.isCanvas) {
			DisplayObjectHelper.initNativeWidget(this,this.isInput ? this.multiline ? "textarea" : "input" : "p");
		}
		this.invalidateMetrics();
	}
	,setLineHeightPercent: function(lineHeightPercent) {
		this.style.lineHeightPercent = lineHeightPercent;
	}
	,setEscapeHTML: function(escapeHTML) {
		if(this.escapeHTML != escapeHTML) {
			this.escapeHTML = escapeHTML;
			this.invalidateMetrics();
		}
	}
	,setTextWordSpacing: function(spacing) {
		if(this.style.wordSpacing != spacing) {
			this.style.wordSpacing = spacing;
			this.updateTextMetrics();
			DisplayObjectHelper.emitEvent(this,"textwidthchanged",this.metrics != null ? this.metrics.width : 0.0);
		}
	}
	,setNeedBaseline: function(need) {
		if(this.needBaseline != need) {
			this.needBaseline = need;
			if((RenderSupport.RendererType == "html" || this.isHTML) && !this.isCanvas && this.isNativeWidget && this.needBaseline) {
				if(!this.isInput && this.nativeWidget.firstChild != null && !this.isMaterialIconFont()) {
					if(this.style.fontStyle == "italic") {
						var lineHeightGap = this.getLineHeightGap();
						var transform;
						if((RenderSupport.RendererType == "html" || this.isHTML) && !this.isCanvas) {
							var transform1;
							if(!(!this.parentClip || RenderSupport.RenderContainers)) {
								var clip = this.parent;
								transform1 = clip == null ? false : clip.isHTMLStageContainer;
							} else {
								transform1 = true;
							}
							if(transform1) {
								if(this.localTransformChanged) {
									this.transform.updateLocalTransform();
								}
								transform = this.localTransform;
							} else {
								transform = DisplayObjectHelper.prependInvertedMatrix(this.worldTransform,this.parentClip.worldTransform);
							}
						} else {
							transform = this.accessWidget != null ? this.accessWidget.getAccessWidgetTransform() : this.worldTransform;
						}
						var n = transform.ty;
						var top = RenderSupport.RoundPixels ? Math.round(n) : Math.round(n * 10.0 * RenderSupport.backingStoreRatio) / (10.0 * RenderSupport.backingStoreRatio);
						this.baselineWidget.style.height = "" + Math.round(this.style.fontProperties.fontSize + lineHeightGap + top) + "px";
						var tmp = "" + Math.round(this.getTextMargin() + lineHeightGap + top);
						this.textBackgroundWidget.style.top = tmp + "px";
						this.nativeWidget.style.top = 0;
					} else {
						var tmp = "" + Math.round(this.style.fontProperties.fontSize + this.getLineHeightGap());
						this.baselineWidget.style.height = tmp + "px";
					}
					this.baselineWidget.style.direction = this.textDirection;
					var tmp = "" + -this.getTextMargin();
					this.nativeWidget.style.marginTop = tmp + "px";
					this.nativeWidget.insertBefore(this.baselineWidget,this.nativeWidget.firstChild);
					this.updateAmiriItalicWorkaroundWidget();
				} else if(this.baselineWidget.parentNode != null) {
					this.baselineWidget.parentNode.removeChild(this.baselineWidget);
				}
			}
		}
	}
	,setPreventCheckTextNodeWidth: function(prevent) {
		if(this.preventCheckTextNodeWidth != prevent) {
			this.preventCheckTextNodeWidth = prevent;
			this.updateTextMetrics();
			DisplayObjectHelper.emitEvent(this,"textwidthchanged",this.metrics != null ? this.metrics.width : 0.0);
		}
	}
	,measureFont: function() {
		this.style.fontProperties = PIXI.TextMetrics.measureFont(this.style.toFontString(), this.style.fontSize);
	}
	,layoutText: function() {
		if(this.isFocused || this.text == "") {
			if(this.textClip != null) {
				var clip = this.textClip;
				if(clip._visible != false) {
					clip._visible = false;
					DisplayObjectHelper.invalidateVisible(clip);
				}
			}
		} else if(this.textClipChanged) {
			var modification = this.contentGlyphs;
			var text = modification.modified;
			var chrIdx = 0;
			var texts = this.style.wordWrap ? [[text]] : TextClip.checkTextLength(text);
			if(this.textClip == null) {
				this.textClip = this.createTextClip(modification.substr(0,texts[0][0].length),chrIdx,this.style);
				var _g = 0;
				var _g1 = modification.difPositionMapping;
				while(_g < _g1.length) {
					var difPos = _g1[_g];
					++_g;
					this.textClip.orgCharIdxEnd += difPos;
				}
				this.addChild(this.textClip);
			} else {
				this.textClip.update(modification.substr(0,texts[0][0].length),this.style,this.textDirection);
			}
			this.textClip.orgCharIdxStart = chrIdx;
			this.textClip.orgCharIdxEnd = chrIdx + texts[0][0].length;
			var child = this.textClip.children.length > 0 ? this.textClip.children[0] : null;
			while(child != null) {
				this.textClip.removeChild(child);
				child.destroy({ children : true, texture : true, baseTexture : true});
				child = this.textClip.children.length > 0 ? this.textClip.children[0] : null;
			}
			if(texts.length > 1 || texts[0].length > 1) {
				var currentHeight = 0.0;
				var firstTextClip = true;
				var _g = 0;
				while(_g < texts.length) {
					var line = texts[_g];
					++_g;
					var currentWidth = 0.0;
					var lineHeight = 0.0;
					var _g1 = 0;
					while(_g1 < line.length) {
						var txt = line[_g1];
						++_g1;
						if(firstTextClip) {
							firstTextClip = false;
							currentWidth = this.textClip.getLocalBounds().width;
							lineHeight = this.textClip.getLocalBounds().height;
						} else {
							var newTextClip = this.createTextClip(modification.substr(chrIdx,txt.length),chrIdx,this.style);
							var x = currentWidth;
							if(newTextClip.scrollRect != null) {
								x -= newTextClip.scrollRect.x;
							}
							if(!newTextClip.destroyed && newTextClip.x != x) {
								var from = DisplayObjectHelper.DebugUpdate ? "setClipX " + newTextClip.x + " : " + x : null;
								newTextClip.x = x;
								DisplayObjectHelper.invalidateTransform(newTextClip,from);
							}
							var y = currentHeight;
							if(newTextClip.scrollRect != null) {
								y -= newTextClip.scrollRect.y;
							}
							if(!newTextClip.destroyed && newTextClip.y != y) {
								var from1 = DisplayObjectHelper.DebugUpdate ? "setClipY " + newTextClip.y + " : " + y : null;
								newTextClip.y = y;
								DisplayObjectHelper.invalidateTransform(newTextClip,from1);
							}
							this.textClip.addChild(newTextClip);
							currentWidth += newTextClip.getLocalBounds().width;
							lineHeight = Math.max(lineHeight,newTextClip.getLocalBounds().height);
						}
						chrIdx += txt.length;
					}
					currentHeight += lineHeight;
				}
			}
			var anchorX;
			switch(this.autoAlign) {
			case "AutoAlignCenter":
				anchorX = 0.5;
				break;
			case "AutoAlignLeft":
				anchorX = 0;
				break;
			case "AutoAlignRight":
				anchorX = 1;
				break;
			default:
				anchorX = this.textDirection == "rtl" ? 1 : 0;
			}
			var clip = this.textClip;
			var widgetBounds = this.widgetBounds;
			var widgetWidth;
			var widgetWidth1;
			if(widgetBounds != null) {
				var f = widgetBounds.minX;
				widgetWidth1 = isFinite(f);
			} else {
				widgetWidth1 = false;
			}
			if(widgetWidth1) {
				var f = widgetBounds.minX;
				widgetWidth = isFinite(f) ? widgetBounds.maxX - widgetBounds.minX : -1;
			} else {
				widgetWidth = this.isFlowContainer && this.mask == null ? this.localBounds.maxX : this.getWidth != null ? this.getWidth() : this.getLocalBounds().width;
			}
			var x = anchorX * Math.max(0,widgetWidth - this.getClipWidth());
			if(clip.scrollRect != null) {
				x -= clip.scrollRect.x;
			}
			if(!clip.destroyed && clip.x != x) {
				var from = DisplayObjectHelper.DebugUpdate ? "setClipX " + clip.x + " : " + x : null;
				clip.x = x;
				DisplayObjectHelper.invalidateTransform(clip,from);
			}
			if(this.isMaterialIconFont()) {
				if(this.style.fontProperties == null) {
					this.measureFont();
				}
				var clip = this.textClip;
				var y = this.style.fontProperties.descent / (Platform.isIOS ? 2.0 : Platform.isMacintosh ? RenderSupport.backingStoreRatio : 1.0);
				if(clip.scrollRect != null) {
					y -= clip.scrollRect.y;
				}
				if(!clip.destroyed && clip.y != y) {
					var from = DisplayObjectHelper.DebugUpdate ? "setClipY " + clip.y + " : " + y : null;
					clip.y = y;
					DisplayObjectHelper.invalidateTransform(clip,from);
				}
			}
			this.setTextBackground(new PIXI.Rectangle(0,0,this.getWidth(),this.getHeight()));
			var clip = this.textClip;
			if(clip._visible != true) {
				clip._visible = true;
				DisplayObjectHelper.invalidateVisible(clip);
			}
			this.textClipChanged = false;
		}
	}
	,createTextClip: function(textMod,chrIdx,style) {
		var textClip = new Text(TextClip.bidiDecorate(textMod.text,TextClip.getStringDirection(textMod.modified,this.textDirection)),style);
		textClip.charIdx = chrIdx;
		textClip.modification = textMod;
		if(textClip._visible != true) {
			textClip._visible = true;
			DisplayObjectHelper.invalidateVisible(textClip);
		}
		return textClip;
	}
	,invalidateStyle: function() {
		if(!this.doNotInvalidateStage) {
			if(!((RenderSupport.RendererType == "html" || this.isHTML) && !this.isCanvas)) {
				if(this.isInput) {
					DisplayObjectHelper.setScrollRect(this,0,0,this.getWidth(),this.getHeight());
				}
			}
			NativeWidgetClip.prototype.invalidateStyle.call(this);
		}
	}
	,invalidateMetrics: function() {
		this.metrics = null;
		this.textClipChanged = true;
		this.invalidateStyle();
	}
	,setTextBackground: function(text_bounds) {
		if(this.background != null) {
			this.removeChild(this.background);
		}
		if(this.backgroundOpacity > 0.0) {
			var text_bounds1 = text_bounds != null ? text_bounds : this.getLocalBounds();
			this.background = new FlowGraphics();
			this.background.beginFill(this.backgroundColor,this.backgroundOpacity);
			this.background.drawRect(0.0,0.0,text_bounds1.width,text_bounds1.height);
			this.addChildAt(this.background,0);
		} else {
			this.background = null;
		}
	}
	,setTextInputType: function(type) {
		if(this.type != type) {
			this.type = type;
			this.invalidateStyle();
		}
	}
	,setTextInputAutoCompleteType: function(type) {
		if(this.autocomplete != type) {
			this.autocomplete = type;
			this.invalidateStyle();
		}
	}
	,setTextInputStep: function(step) {
		if(this.step != step) {
			this.step = step;
			this.invalidateStyle();
		}
	}
	,setWordWrap: function(wordWrap) {
		if(this.style.wordWrap != wordWrap) {
			this.style.wordWrap = wordWrap;
			this.invalidateMetrics();
		}
	}
	,setDoNotInvalidateStage: function(doNotInvalidateStage) {
		if(this.doNotInvalidateStage != doNotInvalidateStage) {
			this.doNotInvalidateStage = doNotInvalidateStage;
		}
	}
	,setWidth: function(widgetWidth) {
		var tmp = widgetWidth > 0 ? this.isMaterialIconFont() ? widgetWidth : Math.ceil(widgetWidth) : 2048.0;
		this.style.wordWrapWidth = tmp;
		NativeWidgetClip.prototype.setWidth.call(this,widgetWidth);
		this.invalidateMetrics();
	}
	,setCropWords: function(cropWords) {
		if(this.cropWords != cropWords) {
			this.cropWords = cropWords;
			this.style.breakWords = cropWords;
			this.invalidateMetrics();
		}
	}
	,setCursorColor: function(cursorColor,cursorOpacity) {
		if(this.cursorColor != cursorColor || this.cursorOpacity != cursorOpacity) {
			this.cursorColor = cursorColor;
			this.cursorOpacity = cursorOpacity;
			this.invalidateStyle();
		}
	}
	,setCursorWidth: function(cursorWidth) {
		if(this.cursorWidth != cursorWidth) {
			this.cursorWidth = cursorWidth;
			this.invalidateStyle();
		}
	}
	,setEllipsis: function(lines,cb) {
		this.style.truncate = lines;
		this.style.truncateCallback = cb;
		this.invalidateMetrics();
	}
	,setInterlineSpacing: function(interlineSpacing) {
		if(this.style.leading != interlineSpacing) {
			this.style.leading = interlineSpacing;
			this.invalidateMetrics();
		}
	}
	,setTextDirection: function(textDirection) {
		if(this.textDirection != textDirection) {
			this.textDirection = textDirection.toLowerCase();
			this.contentGlyphsDirection = TextClip.getStringDirection(this.contentGlyphs.text,this.textDirection);
			this.invalidateStyle();
			this.invalidateMetrics();
			this.layoutText();
		}
	}
	,setTextSkipOrderCheck: function(skip) {
		this.skipOrderCheck = skip;
	}
	,getTextDirection: function() {
		if(this.textDirection != "") {
			return this.textDirection;
		} else {
			return this.contentGlyphsDirection;
		}
	}
	,setResolution: function(resolution) {
		if(this.style.resolution != resolution) {
			this.style.resolution = resolution;
			this.invalidateStyle();
		}
	}
	,setAutoAlign: function(autoAlign) {
		if(this.autoAlign != autoAlign) {
			this.autoAlign = autoAlign;
			if(autoAlign == "AutoAlignRight") {
				this.style.align = "right";
			} else if(autoAlign == "AutoAlignCenter") {
				this.style.align = "center";
			} else {
				this.style.align = "left";
			}
			this.invalidateMetrics();
		}
	}
	,setTabIndex: function(tabIndex) {
		if(this.tabIndex != tabIndex) {
			this.tabIndex = tabIndex;
			this.invalidateStyle();
		}
	}
	,setReadOnly: function(readOnly) {
		if(this.readOnly != readOnly) {
			this.readOnly = readOnly;
			this.invalidateStyle();
		}
	}
	,setPreventContextMenu: function(preventContextMenu) {
		if(this.preventContextMenu != preventContextMenu) {
			this.preventContextMenu = preventContextMenu;
			this.invalidateStyle();
		}
	}
	,setMaxChars: function(maxChars) {
		if(this.maxChars != maxChars) {
			this.maxChars = maxChars;
			this.invalidateStyle();
		}
	}
	,setTextInput: function() {
		var _gthis = this;
		this.isInput = true;
		if(this.multiline) {
			this.setWordWrap(true);
		}
		if(!this.keepNativeWidget) {
			this.keepNativeWidget = true;
			DisplayObjectHelper.updateKeepNativeWidgetChildren(this);
		}
		DisplayObjectHelper.initNativeWidget(this,this.multiline ? "textarea" : "input");
		this.isInteractive = true;
		DisplayObjectHelper.invalidateInteractive(this);
		this.renderStage = RenderSupport.PixiStage;
		if(Platform.isMobile) {
			if(Platform.isAndroid || Platform.isSafari && Platform.browserMajorVersion >= 13) {
				this.nativeWidget.onpointermove = $bind(this,this.onMouseMove);
				this.nativeWidget.onpointerdown = $bind(this,this.onMouseDown);
				this.nativeWidget.onpointerup = $bind(this,this.onMouseUp);
			}
			this.nativeWidget.ontouchmove = $bind(this,this.onMouseMove);
			this.nativeWidget.ontouchstart = $bind(this,this.onMouseDown);
			this.nativeWidget.ontouchend = $bind(this,this.onMouseUp);
		} else if(Platform.isSafari) {
			this.nativeWidget.onmousemove = $bind(this,this.onMouseMove);
			this.nativeWidget.onmousedown = $bind(this,this.onMouseDown);
			this.nativeWidget.onmouseup = $bind(this,this.onMouseUp);
		} else {
			this.nativeWidget.onpointermove = $bind(this,this.onMouseMove);
			this.nativeWidget.onpointerdown = $bind(this,this.onMouseDown);
			this.nativeWidget.onpointerup = $bind(this,this.onMouseUp);
		}
		this.nativeWidget.onfocus = $bind(this,this.onFocus);
		this.nativeWidget.onblur = $bind(this,this.onBlur);
		this.nativeWidget.addEventListener("input",$bind(this,this.onInput));
		this.nativeWidget.oninput = $bind(this,this.onInput);
		this.nativeWidget.addEventListener("compositionend",function() {
			_gthis.emit("compositionend");
		});
		this.nativeWidget.addEventListener("scroll",$bind(this,this.onScroll));
		this.nativeWidget.addEventListener("keydown",$bind(this,this.onKeyDown));
		this.nativeWidget.addEventListener("keyup",$bind(this,this.onKeyUp));
		this.nativeWidget.addEventListener("contextmenu",$bind(this,this.onContextMenu));
		if(TextClip.IosOnSelectWorkaroundEnabled) {
			this.nativeWidget.addEventListener("select",$bind(this,this.onSelect));
		}
		this.invalidateStyle();
	}
	,checkPositionSelection: function() {
		var hasChanges = false;
		var cursorPosition = this.getCursorPosition();
		var selectionStart = this.getSelectionStart();
		var selectionEnd = this.getSelectionEnd();
		if(this.cursorPosition != cursorPosition) {
			this.cursorPosition = cursorPosition;
			hasChanges = true;
		}
		if(this.selectionStart != selectionStart) {
			this.selectionStart = selectionStart;
			hasChanges = true;
		}
		if(this.selectionEnd != selectionEnd) {
			this.selectionEnd = selectionEnd;
			hasChanges = true;
		}
		if(hasChanges) {
			this.emit("input");
		}
	}
	,onMouseMove: function(e) {
		var rootPos = RenderSupport.getRenderRootPos(this.renderStage);
		var mousePos = RenderSupport.getMouseEventPosition(e,rootPos);
		if(this.isFocused) {
			this.checkPositionSelection();
		}
		if(e.touches != null) {
			if(e.touches.length == 1) {
				var touchPos = RenderSupport.getMouseEventPosition(e.touches[0],rootPos);
				RenderSupport.setMousePosition(touchPos);
				this.renderStage.emit("mousemove");
			} else if(e.touches.length > 1) {
				var touchPos1 = RenderSupport.getMouseEventPosition(e.touches[0],rootPos);
				var touchPos2 = RenderSupport.getMouseEventPosition(e.touches[1],rootPos);
				GesturesDetector.processPinch(touchPos1,touchPos2);
			}
		} else if(!Platform.isMobile || e.pointerType == null || e.pointerType != "touch" || !RenderSupport.isMousePositionEqual(mousePos)) {
			RenderSupport.setMousePosition(mousePos);
			this.renderStage.emit("mousemove");
		}
		this.nativeWidget.style.cursor = RenderSupport.PixiView.style.cursor;
		e.stopPropagation();
	}
	,onMouseDown: function(e) {
		var rootPos = RenderSupport.getRenderRootPos(this.renderStage);
		var mousePos = RenderSupport.getMouseEventPosition(e,rootPos);
		if(this.isFocused) {
			this.checkPositionSelection();
		} else {
			var point = e.touches != null && e.touches.length > 0 ? RenderSupport.getMouseEventPosition(e.touches[0],rootPos) : mousePos;
			var pointScaled = new PIXI.Point(point.x * RenderSupport.getViewportScale(),point.y * RenderSupport.getViewportScale());
			RenderSupport.setMousePosition(point);
			if(RenderSupport.getClipAt(this.renderStage,pointScaled,true,0.16) != this) {
				e.preventDefault();
			}
		}
		if(e.touches != null) {
			RenderSupport.TouchPoints = e.touches;
			RenderSupport.emit("touchstart");
			if(e.touches.length == 1) {
				var touchPos = RenderSupport.getMouseEventPosition(e.touches[0],rootPos);
				RenderSupport.setMousePosition(touchPos);
				if(RenderSupport.MouseUpReceived) {
					this.renderStage.emit("mousedown");
				}
			} else if(e.touches.length > 1) {
				var touchPos1 = RenderSupport.getMouseEventPosition(e.touches[0],rootPos);
				var touchPos2 = RenderSupport.getMouseEventPosition(e.touches[1],rootPos);
				GesturesDetector.processPinch(touchPos1,touchPos2);
			}
		} else if(!Platform.isMobile || e.pointerType == null || e.pointerType != "touch" || !RenderSupport.isMousePositionEqual(mousePos)) {
			RenderSupport.setMousePosition(mousePos);
			if(e.which == 3 || e.button == 2) {
				this.renderStage.emit("mouserightdown");
			} else if(e.which == 2 || e.button == 1) {
				this.renderStage.emit("mousemiddledown");
			} else if(e.which == 1 || e.button == 0) {
				if(RenderSupport.MouseUpReceived) {
					this.renderStage.emit("mousedown");
				}
			}
		}
		e.stopPropagation();
	}
	,onMouseUp: function(e) {
		var rootPos = RenderSupport.getRenderRootPos(this.renderStage);
		var mousePos = RenderSupport.getMouseEventPosition(e,rootPos);
		if(this.isFocused) {
			this.checkPositionSelection();
		}
		if(e.touches != null) {
			RenderSupport.TouchPoints = e.touches;
			RenderSupport.emit("touchend");
			GesturesDetector.endPinch();
			if(e.touches.length == 0) {
				if(!RenderSupport.MouseUpReceived) {
					this.renderStage.emit("mouseup");
				}
			}
		} else if(!Platform.isMobile || e.pointerType == null || e.pointerType != "touch" || !RenderSupport.isMousePositionEqual(mousePos)) {
			RenderSupport.setMousePosition(mousePos);
			if(e.which == 3 || e.button == 2) {
				this.renderStage.emit("mouserightup");
			} else if(e.which == 2 || e.button == 1) {
				this.renderStage.emit("mousemiddleup");
			} else if(e.which == 1 || e.button == 0) {
				if(!RenderSupport.MouseUpReceived) {
					this.renderStage.emit("mouseup");
				}
			}
		}
		e.stopPropagation();
		if(this.preventMouseUpEvent) {
			e.preventDefault();
			this.preventMouseUpEvent = false;
		}
	}
	,onFocus: function(e) {
		var _gthis = this;
		this.isFocused = true;
		if(RenderSupport.Animating) {
			RenderSupport.once("stagechanged",function() {
				if(_gthis.nativeWidget != null && _gthis.isFocused) {
					_gthis.nativeWidget.focus();
				}
			});
			return;
		}
		if(Platform.isEdge || Platform.isIE) {
			var slicedColor = this.style.fill.split(",");
			var newColor = slicedColor.slice(0,3).join(",") + ",";
			var newColor1 = this.isFocused ? this.alpha : 0;
			var newColor2 = newColor + parseFloat(slicedColor[3]) * newColor1 + ")";
			this.nativeWidget.style.color = newColor2;
		}
		this.emit("focus");
		if(this.parent != null) {
			DisplayObjectHelper.emitEvent(this.parent,"childfocused",this);
		}
		if(this.nativeWidget == null || this.parent == null) {
			return;
		}
		if(Platform.isIOS && (Platform.browserMajorVersion < 13 || TextClip.EnsureInputIOS)) {
			if(!this.preventEnsureCurrentInputVisible) {
				RenderSupport.ensureCurrentInputVisible();
				this.preventEnsureCurrentInputVisible = true;
			}
		}
		if(TextClip.IosOnSelectWorkaroundEnabled) {
			window.document.addEventListener("selectionchange",$bind(this,this.onSelectionChange));
		}
		this.invalidateMetrics();
	}
	,onBlur: function(e) {
		var _gthis = this;
		this.preventEnsureCurrentInputVisible = false;
		if(RenderSupport.Animating || this.preventBlur) {
			RenderSupport.once("stagechanged",function() {
				if(_gthis.nativeWidget != null && _gthis.isFocused) {
					_gthis.nativeWidget.focus();
				}
			});
			return;
		}
		this.isFocused = false;
		if(Platform.isEdge || Platform.isIE) {
			var slicedColor = this.style.fill.split(",");
			var newColor = slicedColor.slice(0,3).join(",") + ",";
			var newColor1 = this.isFocused ? this.alpha : 0;
			var newColor2 = newColor + parseFloat(slicedColor[3]) * newColor1 + ")";
			this.nativeWidget.style.color = newColor2;
		}
		this.emit("blur");
		if(this.nativeWidget == null || this.parent == null) {
			return;
		}
		if(TextClip.IosOnSelectWorkaroundEnabled) {
			window.document.removeEventListener("selectionchange",$bind(this,this.onSelectionChange));
		}
		this.invalidateMetrics();
	}
	,onInput: function(e) {
		var _gthis = this;
		if(Platform.isIOS && this.type == "number" && this.nativeWidget.value == "") {
			this.nativeWidget.value = "";
		}
		if(this.nativeWidget.value == this.text) {
			return;
		}
		var decimalSeparatorFix = this.type == "number" && (e.data == "." || e.data == ",");
		var nativeWidgetValue = decimalSeparatorFix ? this.nativeWidget.value + e.data : this.nativeWidget.value;
		var newValue = nativeWidgetValue;
		if(this.maxChars > 0) {
			newValue = HxOverrides.substr(newValue,0,this.maxChars);
		}
		var _g = 0;
		var _g1 = this.TextInputFilters;
		while(_g < _g1.length) {
			var f = _g1[_g];
			++_g;
			newValue = f(newValue);
		}
		if(e != null && (e.inputType != null || Platform.isIE)) {
			var _g = 0;
			var _g1 = this.TextInputEventFilters;
			while(_g < _g1.length) {
				var f = _g1[_g];
				++_g;
				newValue = f(newValue,Platform.isIE ? "insertText" : e.inputType);
			}
		}
		if(this.nativeWidget == null) {
			return;
		}
		var setNewValue = function(val) {
			if((Platform.isChrome || Platform.isEdge) && decimalSeparatorFix) {
				_gthis.nativeWidget.value = "";
			}
			_gthis.nativeWidget.value = val;
		};
		if(newValue != nativeWidgetValue) {
			if(e != null && e.data != null && e.data.length != null) {
				var newCursorPosition = this.cursorPosition + newValue.length - this.nativeWidget.value.length + e.data.length;
				setNewValue(newValue);
				this.setSelection(newCursorPosition,newCursorPosition);
			} else {
				setNewValue(newValue);
			}
		} else {
			var selectionStart = this.getSelectionStart();
			var selectionEnd = this.getSelectionEnd();
			this.setSelection(selectionStart,selectionEnd);
		}
		this.text = newValue;
		this.contentGlyphs = this.applyTextMappedModification(TextClip.adaptWhitespaces(this.text));
		this.contentGlyphsDirection = TextClip.getStringDirection(this.contentGlyphs.text,this.textDirection);
		this.emit("input",newValue);
		if(Platform.isAndroid) {
			Native.timer(0,function() {
				RenderSupport.ensureCurrentInputVisible();
			});
		}
	}
	,onScroll: function(e) {
		this.emit("scroll",e);
	}
	,setMultiline: function(multiline) {
		if(this.multiline != multiline) {
			this.multiline = multiline;
			this.setTextInput();
		}
	}
	,onKeyDown: function(e) {
		if(this.TextInputKeyDownFilters.length > 0) {
			var ke = RenderSupport.parseKeyEvent(e);
			var _g = 0;
			var _g1 = this.TextInputKeyDownFilters;
			while(_g < _g1.length) {
				var f = _g1[_g];
				++_g;
				if(!f(ke.key,ke.ctrl,ke.shift,ke.alt,ke.meta,ke.keyCode)) {
					ke.preventDefault();
					e.stopPropagation();
					RenderSupport.emit("keydown",ke);
					break;
				}
			}
		}
		if(this.isFocused) {
			this.checkPositionSelection();
		}
	}
	,onKeyUp: function(e) {
		var ke = RenderSupport.parseKeyEvent(e);
		if(this.TextInputKeyUpFilters.length > 0) {
			var _g = 0;
			var _g1 = this.TextInputKeyUpFilters;
			while(_g < _g1.length) {
				var f = _g1[_g];
				++_g;
				if(!f(ke.key,ke.ctrl,ke.shift,ke.alt,ke.meta,ke.keyCode)) {
					ke.preventDefault();
					e.stopPropagation();
					RenderSupport.emit("keyup",ke);
					break;
				}
			}
		}
		if(ke.keyCode == 13 && Platform.isMobile && !this.multiline) {
			this.nativeWidget.blur();
		}
		if(this.isFocused) {
			this.checkPositionSelection();
		}
	}
	,onContextMenu: function(e) {
		if(this.preventContextMenu) {
			e.preventDefault();
		}
	}
	,onSelect: function(e) {
		this.emit("selectall");
		this.preventSelectEvent = true;
	}
	,onSelectionChange: function() {
		if(this.isFocused) {
			this.checkPositionSelection();
			if(!this.preventSelectEvent && this.getCursorPosition() != this.getSelectionEnd()) {
				this.emit("selectionchange");
			}
			this.preventSelectEvent = false;
		}
	}
	,temporarilyPreventBlur: function() {
		var _gthis = this;
		if(this.isFocused) {
			this.preventBlur = true;
			RenderSupport.once("stagechanged",function() {
				_gthis.preventBlur = false;
			});
		}
	}
	,getDescription: function() {
		if(this.isInput) {
			return "TextClip (text = \"" + Std.string(this.nativeWidget.value) + "\")";
		} else {
			return "TextClip (text = \"" + this.text + "\")";
		}
	}
	,getWidth: function() {
		if(this.widgetWidth > 0) {
			return this.widgetWidth;
		} else {
			return this.getClipWidth();
		}
	}
	,getMaxWidth: function() {
		this.updateTextMetrics();
		if(this.metrics != null) {
			return this.metrics.maxWidth;
		} else {
			return 0;
		}
	}
	,getHeight: function() {
		if(this.widgetHeight > 0) {
			return this.widgetHeight;
		} else {
			return this.getClipHeight();
		}
	}
	,getClipWidth: function() {
		this.updateTextMetrics();
		if(this.metrics != null) {
			if(Platform.isSafari && !this.isInput && !this.escapeHTML) {
				return Math.ceil(this.metrics.width);
			} else {
				return this.metrics.width;
			}
		} else {
			return 0;
		}
	}
	,getClipHeight: function() {
		this.updateTextMetrics();
		if(this.metrics != null) {
			return this.metrics.height;
		} else {
			return 0;
		}
	}
	,getContent: function() {
		return this.text;
	}
	,getContentGlyphs: function() {
		return this.contentGlyphs;
	}
	,applyTextMappedModification: function(text) {
		if(this.isInput && this.type == "password") {
			return TextClip.getBulletsString(text);
		} else {
			return TextMappedModification.createInvariantForString(text);
		}
	}
	,getStyle: function() {
		return this.style;
	}
	,getCursorPosition: function() {
		try {
			if(this.nativeWidget.selectionStart != null) {
				return this.nativeWidget.selectionStart;
			}
		} catch( _g ) {
			haxe_NativeStackTrace.lastError = _g;
		}
		if(window.document.selection != null) {
			this.nativeWidget.focus();
			var r = window.document.selection.createRange();
			if(r == null) {
				return 0;
			}
			var re = this.nativeWidget.createTextRange();
			var rc = re.duplicate();
			re.moveToBookmark(r.getBookmark());
			rc.setEndPoint("EndToStart",re);
			return rc.text.length;
		}
		return 0;
	}
	,getSelectionStart: function() {
		try {
			if(this.nativeWidget.selectionStart == null) {
				return this.nativeWidget.value.length;
			} else {
				return this.nativeWidget.selectionStart;
			}
		} catch( _g ) {
			haxe_NativeStackTrace.lastError = _g;
			return 0;
		}
	}
	,getSelectionEnd: function() {
		try {
			if(this.nativeWidget.selectionEnd == null) {
				return this.nativeWidget.value.length;
			} else {
				return this.nativeWidget.selectionEnd;
			}
		} catch( _g ) {
			haxe_NativeStackTrace.lastError = _g;
			return 0;
		}
	}
	,setSelection: function(start,end) {
		if(Platform.isSafari && (start == -1 || end == -1 || start == this.nativeWidget.selectionStart && end == this.nativeWidget.selectionEnd)) {
			return;
		}
		try {
			this.nativeWidget.setSelectionRange(start,end);
			if(start == this.nativeWidget.value.length && end == this.nativeWidget.value.length) {
				this.nativeWidget.scrollLeft = this.nativeWidget.scrollWidth;
			}
			if(!(Platform.isIOS && Platform.isChrome)) {
				this.preventMouseUpEvent = true;
			}
		} catch( _g ) {
			haxe_NativeStackTrace.lastError = _g;
			return;
		}
	}
	,addTextInputFilter: function(filter) {
		var _gthis = this;
		this.TextInputFilters.push(filter);
		return function() {
			HxOverrides.remove(_gthis.TextInputFilters,filter);
		};
	}
	,addTextInputEventFilter: function(filter) {
		var _gthis = this;
		this.TextInputEventFilters.push(filter);
		return function() {
			HxOverrides.remove(_gthis.TextInputEventFilters,filter);
		};
	}
	,addTextInputKeyDownEventFilter: function(filter) {
		var _gthis = this;
		this.TextInputKeyDownFilters.push(filter);
		return function() {
			HxOverrides.remove(_gthis.TextInputKeyDownFilters,filter);
		};
	}
	,addTextInputKeyUpEventFilter: function(filter) {
		var _gthis = this;
		this.TextInputKeyUpFilters.push(filter);
		return function() {
			HxOverrides.remove(_gthis.TextInputKeyUpFilters,filter);
		};
	}
	,addOnCopyEventListener: function(fn) {
		var _gthis = this;
		var onCopy = function(e) {
			var setClipboardData = function(newText) {
				e.preventDefault();
				e.clipboardData.setData("text/plain",newText);
			};
			fn(setClipboardData);
		};
		if(this.nativeWidget) {
			this.nativeWidget.addEventListener("copy",onCopy);
		}
		return function() {
			if(_gthis.nativeWidget) {
				_gthis.nativeWidget.removeEventListener("copy",onCopy);
			}
		};
	}
	,updateTextMetrics: function() {
		var _gthis = this;
		if(this.metrics == null && (this.text != "" && this.style.fontSize > 1.0)) {
			if(!this.escapeHTML) {
				var contentGlyphsModified = this.contentGlyphs.modified.replace(/<\/?[^>]+(>|$)/g, '');
				this.metrics = PIXI.TextMetrics.measureText(contentGlyphsModified,this.style);
				if((RenderSupport.RendererType == "html" || this.isHTML) && !this.isCanvas) {
					this.measureHTMLWidthAndHeight();
				}
			} else {
				this.metrics = PIXI.TextMetrics.measureText(this.contentGlyphs.modified,this.style);
				if((RenderSupport.RendererType == "html" || this.isHTML) && !this.isCanvas) {
					if(TextClip.useHTMLMeasurementJapaneseFont(this.style)) {
						this.measureHTMLSize();
					} else if(TextClip.checkTextNodeWidth && !this.preventCheckTextNodeWidth && this.style.fontStyle == "italic") {
						this.measureHTMLWidth();
					}
				}
			}
			this.metrics.maxWidth = 0.0;
			var lineWidths = this.metrics.lineWidths;
			var _g = 0;
			while(_g < lineWidths.length) {
				var lineWidth = lineWidths[_g];
				++_g;
				this.metrics.maxWidth += lineWidth;
			}
			this.metrics.maxWidth = Math.max(this.metrics.width,this.metrics.maxWidth);
			if(!this.cropWords && this.widgetWidth > 0 && this.metrics.width > this.widgetWidth) {
				NativeWidgetClip.prototype.setWidth.call(this,this.metrics.width);
			}
		}
		if(TextClip.useForcedUpdateTextWidth) {
			try {
				if(window.document.fonts.status == "loading") {
					window.document.fonts.addEventListener("loadingdone",function() {
						RenderSupport.defer(function() {
							_gthis.updateTextWidth();
							if(_gthis.style.wordWrap) {
								_gthis.updateTextMetrics();
								DisplayObjectHelper.emitEvent(_gthis,"textwidthchanged",_gthis.metrics.width);
							}
						},600);
					});
				}
			} catch( _g ) {
				haxe_NativeStackTrace.lastError = _g;
			}
		}
		if(Platform.isSafari && Platform.isMacintosh && RenderSupport.getAccessibilityZoom() == 1.0 && (this.text != "" && !this.isMaterialIconFont())) {
			RenderSupport.defer($bind(this,this.updateTextWidth),0);
		}
	}
	,updateTextWidth: function() {
		if(this.nativeWidget != null && this.metrics != null) {
			var useCheck = TextClip.checkTextNodeWidth && !this.preventCheckTextNodeWidth;
			var textNodeMetrics = TextClip.getTextNodeMetrics(this.nativeWidget,useCheck);
			var textNodeWidth0 = textNodeMetrics.width;
			var textNodeHeight = textNodeMetrics.height;
			if(textNodeWidth0 != null && textNodeWidth0 > 0 && textNodeHeight != null && textNodeHeight > 0) {
				var textNodeWidth = TextClip.useLetterSpacingFix ? textNodeWidth0 - this.style.letterSpacing : textNodeWidth0;
				var textWidth = this.transform ? textNodeWidth * (1 - Math.pow(this.transform.worldTransform.c,2)) / this.transform.worldTransform.a + Math.abs(textNodeHeight * this.transform.worldTransform.c) : textNodeWidth;
				if(textWidth > 0 && textWidth != this.metrics.width) {
					this.metrics.width = textWidth;
					DisplayObjectHelper.emitEvent(this,"textwidthchanged",textWidth);
				}
			}
		}
	}
	,measureHTMLSize: function() {
		if(window.document.createRange == null && this.nativeWidget == null) {
			return;
		}
		if(TextClip.measureElement == null) {
			TextClip.measureElement = window.document.createElement("p");
			TextClip.measureElement.id = "measureTextElement";
			TextClip.measureElement.classList.add("nativeWidget");
			TextClip.measureElement.classList.add("textWidget");
			TextClip.measureElement.setAttribute("aria-hidden","true");
			window.document.body.appendChild(TextClip.measureElement);
		}
		if(TextClip.measureRange == null) {
			TextClip.measureRange = window.document.createRange();
		}
		var measureElement = TextClip.measureElement;
		var measureRange = TextClip.measureRange;
		this.updateNativeWidgetStyle();
		var cacheKey = Std.string(this.nativeWidget.textContent) + ("\n" + Std.string(this.nativeWidget.style.fontSize) + "\n" + Std.string(this.nativeWidget.style.fontWeight));
		var cachedMetrics = TextClip.metricsCache.h[cacheKey];
		if(cachedMetrics != null) {
			this.metrics.width = cachedMetrics.width;
			this.metrics.height = cachedMetrics.height;
			return;
		}
		measureElement.style.fontFamily = this.nativeWidget.style.fontFamily;
		measureElement.style.fontSize = this.nativeWidget.style.fontSize;
		measureElement.style.fontWeight = this.nativeWidget.style.fontWeight;
		measureElement.style.wrap = this.nativeWidget.style.wrap;
		measureElement.style.whiteSpace = this.nativeWidget.style.whiteSpace;
		measureElement.style.display = this.nativeWidget.style.display;
		var wordWrap = this.style.wordWrapWidth != null && this.style.wordWrap && this.style.wordWrapWidth > 0;
		if(wordWrap) {
			measureElement.style.width = "" + Std.string(this.style.wordWrapWidth) + "px";
		} else {
			measureElement.style.width = "max-content";
		}
		measureElement.textContent = this.nativeWidget.textContent;
		measureRange.selectNodeContents(measureElement);
		if(measureRange.getBoundingClientRect != null) {
			var rect = measureRange.getBoundingClientRect();
			if(rect != null) {
				var viewportScale = RenderSupport.getViewportScale();
				var textNodeWidth = (rect.right - rect.left) * viewportScale;
				var textNodeHeight = (rect.bottom - rect.top) * viewportScale;
				if(textNodeWidth >= 0.) {
					this.metrics.width = textNodeWidth;
				}
				if(textNodeHeight >= 0. && this.metrics.lineHeight > 0) {
					var textNodeLines = Math.round(textNodeHeight / this.metrics.lineHeight);
					var currentLines = Math.round(this.metrics.height / this.metrics.lineHeight);
					if(currentLines > 0 && textNodeLines != currentLines) {
						this.metrics.height = this.metrics.height * textNodeLines / currentLines;
					}
				}
				if(textNodeWidth >= 0. && textNodeHeight >= 0.) {
					TextClip.metricsCache.h[cacheKey] = { width : textNodeWidth, height : textNodeHeight};
				}
			}
		}
		measureElement.style.display = "none";
	}
	,measureHTMLWidth: function() {
		this.measureHTMLWidthAndHeight(false);
	}
	,measureHTMLWidthAndHeight: function(shouldUpdateHeight) {
		if(shouldUpdateHeight == null) {
			shouldUpdateHeight = true;
		}
		if(this.nativeWidget == null) {
			this.isNativeWidget = true;
			this.createNativeWidget(this.isInput ? this.multiline ? "textarea" : "input" : "p");
		}
		var textNodeMetrics = null;
		var wordWrap = this.style.wordWrapWidth != null && this.style.wordWrap && this.style.wordWrapWidth > 0;
		var parentNode = this.nativeWidget.parentNode;
		var nextSibling = this.nativeWidget.nextSibling;
		var useCheck = TextClip.checkTextNodeWidth && !this.preventCheckTextNodeWidth;
		this.updateNativeWidgetStyle();
		var tempDisplay = this.nativeWidget.style.display;
		if(!Platform.isIE) {
			this.nativeWidget.style.display = null;
		} else {
			this.nativeWidget.style.display = "block";
		}
		if(wordWrap) {
			this.nativeWidget.style.width = "" + Std.string(this.style.wordWrapWidth) + "px";
		} else {
			this.nativeWidget.style.width = "max-content";
		}
		window.document.body.appendChild(this.nativeWidget);
		textNodeMetrics = TextClip.getTextNodeMetrics(this.nativeWidget,useCheck);
		if(parentNode != null) {
			if(nextSibling == null || nextSibling.parentNode != parentNode) {
				parentNode.appendChild(this.nativeWidget);
			} else {
				parentNode.insertBefore(this.nativeWidget,nextSibling);
			}
		} else {
			window.document.body.removeChild(this.nativeWidget);
		}
		this.nativeWidget.style.display = tempDisplay;
		if((!wordWrap || TextClip.isJapaneseFont(this.style)) && textNodeMetrics.width != null && textNodeMetrics.width >= 0) {
			var textNodeWidth = textNodeMetrics.width;
			this.metrics.width = textNodeWidth;
		}
		if(useCheck) {
			this.nativeWidget.style.paddingLeft = "" + -textNodeMetrics.x + "px";
		}
		if(shouldUpdateHeight && textNodeMetrics.height != null && textNodeMetrics.height >= 0 && this.metrics.lineHeight > 0) {
			var textNodeLines = Math.round(textNodeMetrics.height / this.metrics.lineHeight);
			var currentLines = Math.round(this.metrics.height / this.metrics.lineHeight);
			if(currentLines > 0 && textNodeLines != currentLines) {
				this.metrics.height = this.metrics.height * textNodeLines / currentLines;
			}
		}
		if(!((RenderSupport.RendererType == "html" || this.isHTML) && !this.isCanvas) && !this.isInput) {
			DisplayObjectHelper.deleteNativeWidget(this);
		}
	}
	,getTextMetrics: function() {
		if(this.style.fontProperties == null) {
			var ascent = 0.9 * this.style.fontSize;
			var descent = 0.1 * this.style.fontSize;
			var leading = 0.15 * this.style.fontSize;
			return [ascent,descent,leading];
		} else {
			return [this.style.fontProperties.ascent,this.style.fontProperties.descent,this.style.fontProperties.descent];
		}
	}
	,isMaterialIconFont: function() {
		return this.style.fontFamily.startsWith("Material Icons");
	}
	,createNativeWidget: function(tagName) {
		if(tagName == null) {
			tagName = "p";
		}
		if((RenderSupport.RendererType == "html" || this.isHTML) && !this.isCanvas) {
			if(!this.isNativeWidget) {
				return;
			}
			var tagName2 = this.tagName != null && this.tagName != "" ? this.tagName : tagName;
			DisplayObjectHelper.deleteNativeWidget(this);
			this.nativeWidget = window.document.createElement(tagName2);
			if(tagName2 != "span") {
				DisplayObjectHelper.updateClipID(this);
			}
			this.nativeWidget.classList.add("nativeWidget");
			this.nativeWidget.classList.add("textWidget");
			if(this.className != null && this.className != "") {
				this.nativeWidget.classList.add(this.className);
			}
			this.baselineWidget = window.document.createElement("span");
			this.baselineWidget.classList.add("baselineWidget");
			this.baselineWidget.role = "presentation";
			if(TextClip.useTextBackgroundWidget && !this.isInput) {
				this.textBackgroundWidget = window.document.createElement("span");
				this.textBackgroundWidget.classList.add("textBackgroundWidget");
				this.textBackgroundWidget.classList.add("textBackgroundLayer");
			}
			this.isNativeWidget = true;
		} else {
			NativeWidgetClip.prototype.createNativeWidget.call(this,tagName);
		}
	}
	,__class__: TextClip
});
var WebClip = function(url,domain,useCache,reloadBlock,cb,ondone,shrinkToFit) {
	this.passEvents = false;
	this.noScroll = false;
	this.shrinkToFit = null;
	this.htmlPageHeight = null;
	this.htmlPageWidth = null;
	this.iframe = null;
	var _gthis = this;
	NativeWidgetClip.call(this);
	if(domain != "") {
		try {
			window.document.domain = domain;
		} catch( _g ) {
			haxe_NativeStackTrace.lastError = _g;
			var e = haxe_Exception.caught(_g).unwrap();
			Errors.report("Can not set RealHTML domain" + Std.string(e));
		}
	}
	this.keepNativeWidget = true;
	DisplayObjectHelper.initNativeWidget(this);
	if(Platform.isIOS) {
		this.nativeWidget.style.webkitOverflowScrolling = "touch";
		this.nativeWidget.style.overflowY = "scroll";
	}
	this.shrinkToFit = shrinkToFit;
	this.iframe = window.document.createElement("iframe");
	this.iframe.style.visibility = "hidden";
	if((RenderSupport.RendererType == "html" || this.isHTML) && !this.isCanvas) {
		this.iframe.className = "nativeWidget";
		this.iframe.style.pointerEvents = "auto";
	}
	if(WebClip.isUrl(url) || Platform.isIE || Platform.isEdge) {
		this.iframe.src = url;
	} else {
		this.iframe.srcdoc = url;
	}
	this.iframe.allowFullscreen = true;
	this.iframe.frameBorder = "no";
	this.iframe.callflow = cb;
	this.iframe.id = Std.string(this.nativeWidget.id) + "_iframe";
	this.nativeWidget.appendChild(this.iframe);
	if(reloadBlock) {
		this.appendReloadBlock();
	}
	this.iframe.onload = function() {
		try {
			var iframeDocument = _gthis.iframe.contentWindow.document;
			try {
				if(!((RenderSupport.RendererType == "html" || _gthis.isHTML) && !_gthis.isCanvas)) {
					iframeDocument.addEventListener("mousemove",$bind(_gthis,_gthis.onContentMouseMove),false);
					if(Native.isTouchScreen()) {
						iframeDocument.addEventListener("touchstart",$bind(_gthis,_gthis.onContentMouseMove),false);
					}
				} else if(_gthis.passEvents) {
					var listenAndDispatch = function(eventName) {
						iframeDocument.addEventListener(eventName,function(e) {
							var pos0 = Util.getPointerEventPosition(e);
							var iframeBoundingRect = _gthis.iframe.getBoundingClientRect();
							var pos = new PIXI.Point(pos0.x * _gthis.worldTransform.a + iframeBoundingRect.x,pos0.y * _gthis.worldTransform.d + iframeBoundingRect.y);
							var emittedEventName;
							if(Platform.isSafari && Platform.isMobile) {
								switch(eventName) {
								case "pointerdown":
									emittedEventName = "mousedown";
									break;
								case "pointermove":
									emittedEventName = "mousemove";
									break;
								case "pointerup":
									emittedEventName = "mouseup";
									break;
								default:
									emittedEventName = eventName;
								}
							} else {
								emittedEventName = eventName;
							}
							RenderSupport.emitMouseEvent(RenderSupport.PixiStage,emittedEventName,pos.x,pos.y);
						},false);
					};
					if(Platform.isSafari && !Platform.isMobile) {
						listenAndDispatch("mousedown");
						listenAndDispatch("mouseup");
						listenAndDispatch("mousemove");
					} else {
						listenAndDispatch("pointerdown");
						listenAndDispatch("pointerup");
						listenAndDispatch("pointermove");
					}
				}
				if(_gthis.noScroll) {
					iframeDocument.body.style["overflow"] = "hidden";
				}
				if(_gthis.noScroll || _gthis.passEvents) {
					iframeDocument.addEventListener("wheel",function(e) {
						RenderSupport.provideEvent(e);
					},true);
				}
				if(shrinkToFit) {
					try {
						_gthis.htmlPageWidth = iframeDocument.body.scrollWidth;
						_gthis.htmlPageHeight = iframeDocument.body.scrollHeight;
						_gthis.applyShrinkToFit();
					} catch( _g ) {
						haxe_NativeStackTrace.lastError = _g;
						var e = haxe_Exception.caught(_g).unwrap();
						_gthis.shrinkToFit = false;
						Errors.report(e);
						_gthis.applyNativeWidgetSize();
					}
				}
				ondone("OK");
				if(Platform.isIOS && (url.indexOf("flowjs") >= 0 || url.indexOf("lslti_provider") >= 0)) {
					_gthis.iframe.scrolling = "no";
				}
				_gthis.iframe.contentWindow.callflow = cb;
				if(_gthis.iframe.contentWindow.pushCallflowBuffer) {
					_gthis.iframe.contentWindow.pushCallflowBuffer();
				}
				if(Platform.isIOS && _gthis.iframe.contentWindow.setSplashScreen != null) {
					_gthis.iframe.scrolling = "no";
				}
			} catch( _g ) {
				haxe_NativeStackTrace.lastError = _g;
				var e = haxe_Exception.caught(_g).unwrap();
				Errors.report(e);
				ondone(e);
			}
		} catch( _g ) {
			haxe_NativeStackTrace.lastError = _g;
			ondone("OK");
		}
	};
};
WebClip.__name__ = true;
WebClip.isUrl = function(str) {
	return new EReg("^(\\S+[.?][^/\\s]+(/\\S+|/|))$","g").match(str);
};
WebClip.__super__ = NativeWidgetClip;
WebClip.prototype = $extend(NativeWidgetClip.prototype,{
	appendReloadBlock: function() {
		var _gthis = this;
		var div = window.document.createElement("div");
		div.style.cssText = "z-index: 101; position: absolute; top: 0; left: 0; width: 100%; height: 20px; opacity: 0.6;";
		var img = window.document.createElement("img");
		img.style.cssText = "position: absolute; height: 20px; width: 20px; top: 0; right: 0; background: #BEBEBE;";
		img.src = "images/realhtml_reload.png";
		div.appendChild(img);
		var span = window.document.createElement("span");
		span.style.cssText = "position: absolute; right: 25px; top: 0px; color: white; display: none;";
		span.innerHTML = "Reload the page";
		div.appendChild(span);
		img.onmouseover = function(e) {
			div.style.background = "linear-gradient(to bottom right, #36372F, #ACA9A4)";
			span.style.display = "block";
			img.style.background = "none";
		};
		img.onmouseleave = function(e) {
			div.style.background = "none";
			span.style.display = "none";
			img.style.background = "#BEBEBE";
		};
		div.onclick = function(e) {
			_gthis.iframe.src = _gthis.iframe.src;
		};
		this.nativeWidget.appendChild(div);
	}
	,applyShrinkToFit: function() {
		if(this.clipVisible && this.nativeWidget != null && this.iframe != null && this.shrinkToFit && this.htmlPageHeight != null && this.htmlPageWidth != null) {
			var scaleH = this.nativeWidget.clientHeight / this.htmlPageHeight;
			var scaleW = this.nativeWidget.clientWidth / this.htmlPageWidth;
			var scaleWH = Math.min(1.0,Math.min(scaleH,scaleW));
			this.iframe.border = "0";
			this.iframe.style.position = "relative";
			this.iframe.style["-ms-zoom"] = scaleWH;
			this.iframe.style["-moz-transform"] = "scale(" + scaleWH + ")";
			this.iframe.style["-moz-transform-origin"] = "0 0";
			this.iframe.style["-o-transform"] = "scale(" + scaleWH + ")";
			this.iframe.style["-o-transform-origin"] = "0 0";
			this.iframe.style["-webkit-transform"] = "scale(" + scaleWH + ")";
			this.iframe.style["-webkit-transform-origin"] = "0 0";
			this.iframe.style["transform"] = "scale(" + scaleWH + ")";
			this.iframe.style["transform-origin"] = "0 0";
			this.iframe.width = this.iframe.clientWidth = this.htmlPageWidth;
			this.iframe.height = this.iframe.clientHeight = this.htmlPageHeight;
			this.iframe.style.width = this.htmlPageWidth;
			this.iframe.style.height = this.htmlPageHeight;
			this.iframe.style.visibility = "visible";
		}
	}
	,applyNativeWidgetSize: function() {
		if(this.clipVisible && this.nativeWidget != null && this.iframe != null) {
			this.iframe.style.width = this.nativeWidget.style.width;
			this.iframe.style.height = this.nativeWidget.style.height;
			this.iframe.style.visibility = "visible";
		}
	}
	,onContentMouseMove: function(e) {
		var iframeZorder = Math.floor(Std.parseInt(this.nativeWidget.style.zIndex) / 1000);
		var localStages = RenderSupport.PixiStage.children;
		var i = localStages.length - 1;
		while(i > iframeZorder) {
			var pos = Util.getPointerEventPosition(e);
			RenderSupport.setMousePosition(pos);
			if(RenderSupport.getClipAt(localStages[i],RenderSupport.MousePos,true,0.0) != null) {
				localStages[i].view.style.pointerEvents = "all";
				localStages[iframeZorder].view.style.pointerEvents = "none";
				RenderSupport.PixiRenderer.view = localStages[i].view;
				if(e.type == "touchstart") {
					RenderSupport.emitMouseEvent(RenderSupport.PixiStage,"mousedown",pos.x,pos.y);
					RenderSupport.emitMouseEvent(RenderSupport.PixiStage,"mouseup",pos.x,pos.y);
				}
				return;
			}
			--i;
		}
	}
	,updateNativeWidgetStyle: function() {
		NativeWidgetClip.prototype.updateNativeWidgetStyle.call(this);
		if(this.nativeWidget.getAttribute("tabindex") != null) {
			this.iframe.setAttribute("tabindex",this.nativeWidget.getAttribute("tabindex"));
			this.nativeWidget.removeAttribute("tabindex");
		}
		if(this.clipVisible) {
			if(this.shrinkToFit) {
				this.applyShrinkToFit();
			} else {
				this.applyNativeWidgetSize();
			}
		}
	}
	,getDescription: function() {
		return "WebClip (url = " + Std.string(this.iframe.src) + ")";
	}
	,hostCall: function(name,args) {
		try {
			return this.iframe.contentWindow[name].apply(this.iframe.contentWindow,args);
		} catch( _g ) {
			haxe_NativeStackTrace.lastError = _g;
			var e = haxe_Exception.caught(_g).unwrap();
			Errors.report("Error in hostCall: " + name + ", arg: " + Std.string(args));
			Errors.report(e);
		}
		return "";
	}
	,setDisabled: function(disable) {
		this.iframe.style.pointerEvents = disable ? "none" : "auto";
	}
	,setNoScroll: function() {
		this.noScroll = true;
	}
	,setPassEvents: function() {
		this.passEvents = true;
	}
	,setSandBox: function(value) {
		this.iframe.sandbox = value;
	}
	,evalJS: function(code) {
		if(this.iframe.contentWindow != null) {
			this.iframe.contentWindow.postMessage(code,"*");
		}
	}
	,__class__: WebClip
});
var haxe_Exception = function(message,previous,native) {
	Error.call(this,message);
	this.message = message;
	this.__previousException = previous;
	this.__nativeException = native != null ? native : this;
	this.__skipStack = 0;
	var old = Error.prepareStackTrace;
	Error.prepareStackTrace = function(e) { return e.stack; }
	if(((native) instanceof Error)) {
		this.stack = native.stack;
	} else {
		var e = null;
		if(Error.captureStackTrace) {
			Error.captureStackTrace(this,haxe_Exception);
			e = this;
		} else {
			e = new Error();
			if(typeof(e.stack) == "undefined") {
				try { throw e; } catch(_) {}
				this.__skipStack++;
			}
		}
		this.stack = e.stack;
	}
	Error.prepareStackTrace = old;
};
haxe_Exception.__name__ = true;
haxe_Exception.caught = function(value) {
	if(((value) instanceof haxe_Exception)) {
		return value;
	} else if(((value) instanceof Error)) {
		return new haxe_Exception(value.message,null,value);
	} else {
		return new haxe_ValueException(value,null,value);
	}
};
haxe_Exception.thrown = function(value) {
	if(((value) instanceof haxe_Exception)) {
		return value.get_native();
	} else if(((value) instanceof Error)) {
		return value;
	} else {
		var e = new haxe_ValueException(value);
		e.__skipStack++;
		return e;
	}
};
haxe_Exception.__super__ = Error;
haxe_Exception.prototype = $extend(Error.prototype,{
	unwrap: function() {
		return this.__nativeException;
	}
	,__shiftStack: function() {
		this.__skipStack++;
	}
	,get_native: function() {
		return this.__nativeException;
	}
	,get_stack: function() {
		var _g = this.__exceptionStack;
		if(_g == null) {
			var value = haxe_NativeStackTrace.toHaxe(haxe_NativeStackTrace.normalize(this.stack),this.__skipStack);
			this.setProperty("__exceptionStack",value);
			return value;
		} else {
			var s = _g;
			return s;
		}
	}
	,setProperty: function(name,value) {
		try {
			Object.defineProperty(this,name,{ value : value});
		} catch( _g ) {
			this[name] = value;
		}
	}
	,__class__: haxe_Exception
});
var haxe_Log = function() { };
haxe_Log.__name__ = true;
haxe_Log.formatOutput = function(v,infos) {
	var str = Std.string(v);
	if(infos == null) {
		return str;
	}
	var pstr = infos.fileName + ":" + infos.lineNumber;
	if(infos.customParams != null) {
		var _g = 0;
		var _g1 = infos.customParams;
		while(_g < _g1.length) {
			var v = _g1[_g];
			++_g;
			str += ", " + Std.string(v);
		}
	}
	return pstr + ": " + str;
};
haxe_Log.trace = function(v,infos) {
	var str = haxe_Log.formatOutput(v,infos);
	if(typeof(console) != "undefined" && console.log != null) {
		console.log(str);
	}
};
var haxe_Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
haxe_Timer.__name__ = true;
haxe_Timer.delay = function(f,time_ms) {
	var t = new haxe_Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
};
haxe_Timer.prototype = {
	stop: function() {
		if(this.id == null) {
			return;
		}
		clearInterval(this.id);
		this.id = null;
	}
	,run: function() {
	}
	,__class__: haxe_Timer
};
var haxe_ValueException = function(value,previous,native) {
	haxe_Exception.call(this,String(value),previous,native);
	this.value = value;
	this.__skipStack++;
};
haxe_ValueException.__name__ = true;
haxe_ValueException.__super__ = haxe_Exception;
haxe_ValueException.prototype = $extend(haxe_Exception.prototype,{
	unwrap: function() {
		return this.value;
	}
	,__class__: haxe_ValueException
});
var haxe_ds__$StringMap_StringMapValueIterator = function(h) {
	this.h = h;
	this.keys = Object.keys(h);
	this.length = this.keys.length;
	this.current = 0;
};
haxe_ds__$StringMap_StringMapValueIterator.__name__ = true;
haxe_ds__$StringMap_StringMapValueIterator.prototype = {
	hasNext: function() {
		return this.current < this.length;
	}
	,next: function() {
		return this.h[this.keys[this.current++]];
	}
	,__class__: haxe_ds__$StringMap_StringMapValueIterator
};
var haxe_io_Error = $hxEnums["haxe.io.Error"] = { __ename__:true,__constructs__:null
	,Blocked: {_hx_name:"Blocked",_hx_index:0,__enum__:"haxe.io.Error",toString:$estr}
	,Overflow: {_hx_name:"Overflow",_hx_index:1,__enum__:"haxe.io.Error",toString:$estr}
	,OutsideBounds: {_hx_name:"OutsideBounds",_hx_index:2,__enum__:"haxe.io.Error",toString:$estr}
	,Custom: ($_=function(e) { return {_hx_index:3,e:e,__enum__:"haxe.io.Error",toString:$estr}; },$_._hx_name="Custom",$_.__params__ = ["e"],$_)
};
haxe_io_Error.__constructs__ = [haxe_io_Error.Blocked,haxe_io_Error.Overflow,haxe_io_Error.OutsideBounds,haxe_io_Error.Custom];
var haxe_iterators_ArrayIterator = function(array) {
	this.current = 0;
	this.array = array;
};
haxe_iterators_ArrayIterator.__name__ = true;
haxe_iterators_ArrayIterator.prototype = {
	hasNext: function() {
		return this.current < this.array.length;
	}
	,next: function() {
		return this.array[this.current++];
	}
	,__class__: haxe_iterators_ArrayIterator
};
var js_BinaryBuffer = function(bigEndian,buffer) {
	this.bigEndian = bigEndian;
	this.buffer = [];
	this.setBuffer(buffer);
};
js_BinaryBuffer.__name__ = true;
js_BinaryBuffer.prototype = {
	readBits: function(start,length) {
		//shl fix: Henri Torgemane ~1996 (compressed by Jonas Raoni)
			    function shl(a, b){
				for(++b; --b; a = ((a %= 0x7fffffff + 1) & 0x40000000) == 0x40000000 ? a * 2 : (a - 0x40000000) * 2 + 0x7fffffff + 1);
				return a;
			    }
			    if(start < 0 || length <= 0)
				return 0;
			    this.checkBuffer(start + length);
			    for(var offsetLeft, offsetRight = start % 8, curByte = this.buffer.length - (start >> 3) - 1,
				lastByte = this.buffer.length + (-(start + length) >> 3), diff = curByte - lastByte,
				sum = ((this.buffer[ curByte ] >> offsetRight) & ((1 << (diff ? 8 - offsetRight : length)) - 1))
				+ (diff && (offsetLeft = (start + length) % 8) ? (this.buffer[ lastByte++ ] & ((1 << offsetLeft) - 1))
				<< (diff-- << 3) - offsetRight : 0); diff; sum += shl(this.buffer[ lastByte++ ], (diff-- << 3) - offsetRight)
			    );
			    return sum;
		;
	}
	,setBuffer: function(data) {
		if(data){
			for(var l, i = l = data.length, b = this.buffer = new Array(l); i; b[l - i] = data.charCodeAt(--i));
			this.bigEndian && b.reverse();
		    }
	}
	,hasNeededBits: function(neededBits) {
		return this.buffer.length >= -(-neededBits >> 3);
	}
	,checkBuffer: function(neededBits) {
		if(!this.hasNeededBits(neededBits)) {
			throw new Error("checkBuffer::missing bytes");
		}
	}
	,__class__: js_BinaryBuffer
};
var js_Browser = function() { };
js_Browser.__name__ = true;
js_Browser.get_supported = function() {
	if(typeof(window) != "undefined" && typeof(window.location) != "undefined") {
		return typeof(window.location.protocol) == "string";
	} else {
		return false;
	}
};
js_Browser.createXMLHttpRequest = function() {
	if(typeof XMLHttpRequest != "undefined") {
		return new XMLHttpRequest();
	}
	if(typeof ActiveXObject != "undefined") {
		return new ActiveXObject("Microsoft.XMLHTTP");
	}
	throw haxe_Exception.thrown("Unable to create XMLHttpRequest object.");
};
function $getIterator(o) { if( o instanceof Array ) return new haxe_iterators_ArrayIterator(o); else return o.iterator(); }
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $global.$haxeUID++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = m.bind(o); o.hx__closures__[m.__id__] = f; } return f; }
$global.$haxeUID |= 0;
if(typeof(performance) != "undefined" ? typeof(performance.now) == "function" : false) {
	HxOverrides.now = performance.now.bind(performance);
}
Native.initBinarySerialization();
if( String.fromCodePoint == null ) String.fromCodePoint = function(c) { return c < 0x10000 ? String.fromCharCode(c) : String.fromCharCode((c>>10)+0xD7C0)+String.fromCharCode((c&0x3FF)+0xDC00); }
String.prototype.__class__ = String;
String.__name__ = true;
Array.__name__ = true;
Date.prototype.__class__ = Date;
Date.__name__ = "Date";
var Int = { };
var Dynamic = { };
var Float = Number;
var Bool = Boolean;
var Class = { };
var Enum = { };
js_Boot.__toStr = ({ }).toString;
if(typeof window !== 'undefined' && (window.matchMedia("(display-mode: fullscreen)").matches || window.matchMedia("(display-mode: standalone)").matches || new EReg("CapacitorJS","i").match(window.navigator.userAgent))) {
	var viewport = window.document.querySelector("meta[name=\"viewport\"]");
	if(viewport != null && viewport.getAttribute("content").indexOf("viewport-fit") < 0) {
		viewport.setAttribute("content",viewport.getAttribute("content") + ",viewport-fit=cover");
	}
}
haxe_Resource.content = [{ name : "fontstyles", data : "eyJSb2JvdG9MaWdodCI6eyJmYW1pbHkiOiJSb2JvdG8iLCJ3ZWlnaHQiOjMwMCwic3R5bGUiOiJub3JtYWwifSwiUm9ib3RvTGlnaHRJdGFsaWMiOnsiZmFtaWx5IjoiUm9ib3RvIiwid2VpZ2h0IjozMDAsInN0eWxlIjoiaXRhbGljIn0sIlJvYm90byI6eyJmYW1pbHkiOiJSb2JvdG8iLCJ3ZWlnaHQiOjQwMCwic3R5bGUiOiJub3JtYWwifSwiUm9ib3RvSXRhbGljIjp7ImZhbWlseSI6IlJvYm90byIsIndlaWdodCI6NDAwLCJzdHlsZSI6Iml0YWxpYyJ9LCJSb2JvdG9NZWRpdW0iOnsiZmFtaWx5IjoiUm9ib3RvIiwid2VpZ2h0Ijo1MDAsInN0eWxlIjoibm9ybWFsIn0sIlJvYm90b01lZGl1bUl0YWxpYyI6eyJmYW1pbHkiOiJSb2JvdG8iLCJ3ZWlnaHQiOjUwMCwic3R5bGUiOiJpdGFsaWMifSwiUm9ib3RvQm9sZCI6eyJmYW1pbHkiOiJSb2JvdG8iLCJ3ZWlnaHQiOjcwMCwic3R5bGUiOiJub3JtYWwifSwiUm9ib3RvQm9sZEl0YWxpYyI6eyJmYW1pbHkiOiJSb2JvdG8iLCJ3ZWlnaHQiOjcwMCwic3R5bGUiOiJpdGFsaWMifSwiTWF0ZXJpYWxJY29ucyI6eyJmYW1pbHkiOiJNYXRlcmlhbCBJY29ucyIsIndlaWdodCI6NDAwLCJzdHlsZSI6Im5vcm1hbCJ9fQ"},{ name : "webfontconfig", data : "eyJnb29nbGUiOnsiZmFtaWxpZXMiOlsiTWF0ZXJpYWwgSWNvbnMiLCJNYXRlcmlhbCBJY29ucyBPdXRsaW5lZCIsIk1hdGVyaWFsIEljb25zIFJvdW5kIiwiTWF0ZXJpYWwgSWNvbnMgU2hhcnAiLCJNYXRlcmlhbCBJY29ucyBUd28gVG9uZSIsIlJvYm90bzozMDAsNDAwLDUwMCw3MDAsMzAwaXRhbGljLDQwMGl0YWxpYyw1MDBpdGFsaWMsNzAwaXRhbGljIl19fQ"}];
SoundSupport.UseAudioStream = "1" == Util.getParameter("mp3stream");
SoundSupport.hasSpeechSupport = 'speechSynthesis' in window;
if(SoundSupport.hasSpeechSupport) {
	window.addEventListener("beforeunload",function() {
		SoundSupport.clearSpeechSynthesisQueueNative();
	});
}
AccessWidget.accessRoleMap = (function($this) {
	var $r;
	var _g = new haxe_ds_StringMap();
	_g.h["button"] = "button";
	_g.h["checkbox"] = "button";
	_g.h["combobox"] = "button";
	_g.h["slider"] = "button";
	_g.h["alertdialog"] = "dialog";
	_g.h["dialog"] = "dialog";
	_g.h["radio"] = "button";
	_g.h["tab"] = "button";
	_g.h["tabpanel"] = "button";
	_g.h["link"] = "button";
	_g.h["banner"] = "header";
	_g.h["main"] = "section";
	_g.h["navigation"] = "nav";
	_g.h["contentinfo"] = "footer";
	_g.h["form"] = "form";
	_g.h["textbox"] = "input";
	_g.h["switch"] = "button";
	_g.h["menuitem"] = "button";
	_g.h["option"] = "button";
	_g.h["table"] = "table";
	_g.h["row"] = "tr";
	_g.h["columnheader"] = "th";
	_g.h["cell"] = "td";
	$r = _g;
	return $r;
}(this));
AccessWidget.zIndexValues = { "canvas" : 0, "droparea" : 1, "nativeWidget" : 2};
AccessWidget.tree = new AccessWidgetTree(0);
Util.filesCache = new haxe_ds_StringMap();
Util.filesHashCache = new haxe_ds_StringMap();
HaxeRuntime.regexCharsToReplaceForString = /[\\\"\n\t]/g;
HaxeRuntime.regexCharsToReplaceForJson = /[\\\"\n\t\x00-\x08\x0B-\x1F]/g;
Platform.isChrome = new EReg("chrome|crios","i").match(window.navigator.userAgent);
Platform.isSafari = new EReg("safari","i").match(window.navigator.userAgent) ? !Platform.isChrome : false;
Platform.isIE = new EReg("MSIE|Trident","i").match(window.navigator.userAgent);
Platform.isEdge = new EReg("Edge","i").match(window.navigator.userAgent);
Platform.isFirefox = new EReg("firefox","i").match(window.navigator.userAgent);
Platform.isSamsung = new EReg("samsungbrowser","i").match(window.navigator.userAgent);
Platform.isIEMobile = new EReg("iemobile","i").match(window.navigator.userAgent);
Platform.isAndroid = new EReg("android","i").match(window.navigator.userAgent);
Platform.isIOS = !(new EReg("ipad|iphone|ipod","i").match(window.navigator.userAgent) || HaxeRuntime.typeof(navigator.standalone) != "undefined" && window.navigator.standalone) ? window.navigator.platform == "MacIntel" && window.navigator.maxTouchPoints > 1 ? !window.MSStream : false : true;
Platform.isMobile = !(new EReg("webOS|BlackBerry|Windows Phone","i").match(window.navigator.userAgent) || Platform.isIEMobile || Platform.isAndroid) ? Platform.isIOS : true;
Platform.isRetinaDisplay = Platform.getIsRetinaDisplay();
Platform.isHighDensityDisplay = !Platform.isRetinaDisplay ? Platform.getIsHighDensityDisplay() : true;
Platform.isWKWebView = Platform.isIOS ? window.webkit ? window.webkit.messageHandlers : false : false;
Platform.isMacintosh = new EReg("Mac","i").match(window.navigator.platform);
Platform.isWindows = new EReg("Win","i").match(window.navigator.platform);
Platform.isLinux = new EReg("Linux","i").match(window.navigator.platform);
Platform.isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
Platform.isMouseSupported = window.matchMedia("(any-pointer: fine)").matches;
Platform.browserMajorVersion = function() {
		var version = window.navigator.userAgent.match(/version\/(\d+)/i);
		return version && version.length > 1 ? parseInt(version[1]) || 0 : 0;
	}();
Platform.SupportsVideoTexture = !Platform.isIEMobile;
Platform.AccessiblityAllowed = Util.getParameter("accessenabled") != "1" ? Platform.isFirefox || Platform.isChrome || Platform.isSafari ? !Platform.isEdge : false : true;
DisplayObjectHelper.Redraw = Util.getParameter("redraw") == "1";
DisplayObjectHelper.DebugUpdate = Util.getParameter("debugupdate") == "1";
DisplayObjectHelper.BoxShadow = (Platform.isChrome || Platform.isFirefox) && !Platform.isMobile ? Util.getParameter("boxshadow") != "0" : Util.getParameter("boxshadow") == "1";
DisplayObjectHelper.InvalidateRenderable = Util.getParameter("renderable") != "0";
DisplayObjectHelper.DebugAccessOrder = Util.getParameter("accessorder") == "1";
DisplayObjectHelper.SkipOrderCheckEnabled = Util.getParameter("skip_order_check") != "0";
DisplayObjectHelper.UseOptimization = Util.getParameter("remove_listener_optimization") != "0";
DisplayObjectHelper.ScreenreaderDialog = Util.getParameter("screenreader_dialog") != "0";
DisplayObjectHelper.CheckUniqueClipID = Util.getParameter("check_unique_clip_id") == "1";
DisplayObjectHelper.UniqueClipIds = [];
DisplayObjectHelper.InvalidateStage = true;
FlowContainer.lastId = 0;
Native.isNew = Util.getParameter("new") == "1";
Native.complainedMissingExternal = false;
Native.clipboardData = "";
Native.clipboardDataHtml = "";
Native.useConcatForPush = !Platform.isChrome ? Platform.isSafari : true;
Native.DeferQueue = [];
Native.deferTolerance = 250;
Native.deferActive = false;
Native.FlowCrashHandlers = [];
Native.PlatformEventListeners = new haxe_ds_StringMap();
Native.LastUserAction = -1;
Native.IdleLimit = 60000.;
Native.parseJsonFirstCall = true;
VideoClip.playingVideos = [];
FlowSprite.MAX_CHACHED_IMAGES = 50;
FlowSprite.cachedImagesUrls = new haxe_ds_StringMap();
GesturesDetector.IsPinchInProgress = false;
GesturesDetector.PinchInitialDistance = 1.0;
GesturesDetector.PinchListeners = [];
GesturesDetector.CurrentPinchScaleFactor = 1.0;
GesturesDetector.CurrentPinchFocus = { x : 0.0, y : 0.0};
FontLoader.FontLoadingTimeout = 30000;
FontLoader.wsReg = new EReg("([0-9]+)([A-Za-z]*)","");
haxe_crypto_Base64.CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
haxe_crypto_Base64.BYTES = haxe_io_Bytes.ofString(haxe_crypto_Base64.CHARS);
RenderSupport.RendererType = Util.getParameter("renderer") != null ? Util.getParameter("renderer") : window.useRenderer;
RenderSupport.RenderContainers = Util.getParameter("containers") == "1";
RenderSupport.FiltersEnabled = Util.getParameter("filters") != "0";
RenderSupport.FlowInstances = [];
RenderSupport.MousePos = new PIXI.Point(0.0,0.0);
RenderSupport.PixiStageChanged = true;
RenderSupport.TransformChanged = true;
RenderSupport.isEmulating = false;
RenderSupport.AnimationFrameId = -1;
RenderSupport.PageWasHidden = false;
RenderSupport.IsLoading = true;
RenderSupport.AccessibilityEnabled = Util.getParameter("accessenabled") == "1";
RenderSupport.EnableFocusFrame = false;
RenderSupport.Antialias = Util.getParameter("antialias") != null ? Util.getParameter("antialias") == "1" : !Native.isTouchScreen() ? RenderSupport.RendererType == "webgl" ? Native.detectDedicatedGPU() : true : false;
RenderSupport.RoundPixels = Util.getParameter("roundpixels") != null ? Util.getParameter("roundpixels") != "0" : RenderSupport.RendererType != "html";
RenderSupport.TransparentBackground = Util.getParameter("transparentbackground") == "1";
RenderSupport.ScrollCatcherEnabled = Platform.isIOS && Platform.isSafari && Platform.isMouseSupported ? Util.getParameter("trackpad_scroll") != "0" : false;
RenderSupport.backingStoreRatio = RenderSupport.getBackingStoreRatio();
RenderSupport.browserZoom = 1.0;
RenderSupport.viewportScaleWorkaroundEnabled = Util.getParameter("viewport_scale_disabled") != "0" ? RenderSupport.isViewportScaleWorkaroundEnabled() : false;
RenderSupport.mainNoDelay = Util.getParameter("main_no_delay") != "0";
RenderSupport.HandlePointerTouchEvent = Util.getParameter("pointer_touch_event") != "0";
RenderSupport.WindowTopHeightPortrait = -1;
RenderSupport.WindowTopHeightLandscape = -1;
RenderSupport.InnerHeightAtRenderTime = -1.0;
RenderSupport.hadUserInteracted = false;
RenderSupport.RenderSupportInitialised = RenderSupport.init();
RenderSupport.accessibilityZoom = parseFloat(Native.getKeyValue("accessibility_zoom","1.0"));
RenderSupport.accessibilityZoomValues = [0.25,0.33,0.5,0.66,0.75,0.8,0.9,1.0,1.1,1.25,1.5,1.75,2.0,2.5,3.0,4.0,5.0];
RenderSupport.onMouseWheelAccessibilityZoomEnabled = true;
RenderSupport.UserDefinedLetterSpacing = 0.0;
RenderSupport.UserDefinedLineHeightPercent = 1.15;
RenderSupport.UserDefinedWordSpacingPercent = 0.0;
RenderSupport.UserDefinedLetterSpacingPercent = 0.0;
RenderSupport.UserStylePending = false;
RenderSupport.keysPending = new haxe_ds_IntMap();
RenderSupport.printMode = false;
RenderSupport.forceOnAfterprint = Platform.isChrome;
RenderSupport.prevInvalidateRenderable = false;
RenderSupport.MouseUpReceived = true;
RenderSupport.PreventDefault = true;
RenderSupport.FlowMainFunction = "$8Y";
RenderSupport.rendering = false;
RenderSupport.Animating = false;
RenderSupport.onPasteEnabled = true;
RenderSupport.pointerOverClips = [];
RenderSupport.PIXEL_STEP = 10;
RenderSupport.LINE_HEIGHT = 40;
RenderSupport.PAGE_HEIGHT = 800;
RenderSupport.IsFullScreen = false;
RenderSupport.IsFullWindow = false;
RenderSupport.clipSnapshotRequests = 0;
FlowJsProgram.globals__ = (function($this) {
	var $r;
	HaxeRuntime._structnames_ = new haxe_ds_IntMap();
	HaxeRuntime._structids_ = new haxe_ds_StringMap();
	HaxeRuntime._structargs_ = new haxe_ds_IntMap();
	HaxeRuntime._structargtypes_ = new haxe_ds_IntMap();
	$r = new RenderSupport();
	return $r;
}(this));
HttpSupport.TimeoutInterval = 1200000;
HttpSupport.XMLHttpRequestOverriden = false;
HttpSupport.CORSCredentialsEnabled = true;
JSBinflowBuffer.DoubleSwapBuffer = new DataView(new ArrayBuffer(8));
Md5.inst = new Md5();
SoundSupport.AudioStreamUrl = "php/mp3stream/stream.php";
SoundSupport.utterancesArray = [];
UnicodeTranslation.map = new haxe_ds_StringMap();
TextClip.KeepTextClips = Util.getParameter("wcag") == "1";
TextClip.EnsureInputIOS = Util.getParameter("ensure_input_ios") != "0";
TextClip.useLetterSpacingFix = Util.getParameter("letter_spacing_fix") != "0";
TextClip.useForcedUpdateTextWidth = Util.getParameter("forced_textwidth_update") != "0";
TextClip.checkTextNodeWidth = Util.getParameter("text_node_width") != "0";
TextClip.IosOnSelectWorkaroundEnabled = Platform.isIOS && Platform.isSafari ? Platform.browserMajorVersion < 15 : false;
TextClip.UPM = 2048.0;
TextClip.dummyContentGlyphs = new TextMappedModification("","",[],[]);
TextClip.useTextBackgroundWidget = false;
TextClip.LIGATURES = (function($this) {
	var $r;
	var _g = new haxe_ds_StringMap();
	_g.h["لآ"] = "ﻵ";
	_g.h["لأ"] = "ﻷ";
	_g.h["لإ"] = "ﻹ";
	_g.h["لا"] = "ﻻ";
	$r = _g;
	return $r;
}(this));
TextClip.LIGA_LENGTHS = [2];
TextClip.GV_ISOLATED = 0;
TextClip.GV_FINAL = 1;
TextClip.GV_INITIAL = 2;
TextClip.GV_MEDIAL = 3;
TextClip.isMeiryoAvailable = false;
TextClip.metricsCache = new haxe_ds_StringMap();

(function() {
var S = HaxeRuntime.initStruct;
var t=true;var f=false;function CR_(v){this.__v=v}var CMP = HaxeRuntime.compareByValue;
var CME = HaxeRuntime.compareEqual;