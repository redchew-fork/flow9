import js.Browser;
import js.html.CanvasElement;

import pixi.core.display.Bounds;
import pixi.core.math.shapes.Rectangle;
import pixi.core.display.Container;
import pixi.core.display.DisplayObject;
import pixi.core.renderers.canvas.CanvasRenderer;

using DisplayObjectHelper;

class FlowContainer extends Container {
	public var scrollRect : FlowGraphics;
	private var _visible : Bool = true;
	private var clipVisible : Bool = false;

	private var stage : FlowContainer;
	private var view : CanvasElement;
	private var context : Dynamic;

	public var transformChanged : Bool = false;
	public var stageChanged : Bool = false;
	private var worldTransformChanged : Bool = false;

	private var localBounds = new Bounds();
	private var _bounds = new Bounds();

	private var nativeWidget : Dynamic;
	private var accessWidget : AccessWidget;

	public function new(?worldVisible : Bool = false) {
		super();

		visible = worldVisible;
		clipVisible = worldVisible;
		interactiveChildren = false;

		if (RenderSupportJSPixi.DomRenderer) {
			if (worldVisible) {
				nativeWidget = Browser.document.body;
			} else {
				createNativeWidget();
			}
		}
	}

	public function createView(?zorder : Int) : Void {
		if (zorder == null) {
			zorder = parent.children.indexOf(this) + 1;
		}

		if (zorder == 1) {
			view = RenderSupportJSPixi.PixiView;
			context = view.getContext("2d", { alpha: false });
			return;
		}

		view = cast(Browser.document.createElement('canvas'), CanvasElement);

		view.style.zIndex = 1000 * (zorder - 1) + AccessWidget.zIndexValues.canvas + "";
		untyped view.style.pointerEvents = "none";

		context = view.getContext("2d", { alpha : true });

		updateView(zorder);
		onResize();

		RenderSupportJSPixi.on("resize", onResize);
		on("removed", destroyView);
	}

	private function updateView(?zorder : Int) : Void {
		if (zorder == null) {
			zorder = parent.children.indexOf(this) + 1;
		}

		if (zorder > 0) {
			if (Browser.document.body.children.length > zorder) {
				if (Browser.document.body.children[zorder - 1] != view) { // - 1 because first layer renders to PixiView
					if (Browser.document.body.children.length > zorder) {
						Browser.document.body.insertBefore(view, Browser.document.body.children[zorder]);
					} else {
						Browser.document.body.appendChild(view);
					}
				}
			} else {
				Browser.document.body.appendChild(view);
			}
		}
	}

	private function destroyView() : Void {
		RenderSupportJSPixi.off("resize", onResize);

		if (view.parentNode == Browser.document.body) {
			Browser.document.body.removeChild(view);
		}

		view = null;
		context = null;
	}

	private function onResize() : Void {
		if (view == RenderSupportJSPixi.PixiRenderer.view) {
			return;
		}

		view.width = RenderSupportJSPixi.PixiView.width;
		view.height = RenderSupportJSPixi.PixiView.height;

		view.style.width = view.width / RenderSupportJSPixi.backingStoreRatio + "px";
		view.style.height = view.height / RenderSupportJSPixi.backingStoreRatio + "px";
	}

	public override function addChild<T:DisplayObject>(child : T) : T {
		if (child.parent != null) {
			untyped child.parent.removeChild(child);
		}

		var newChild = super.addChild(child);

		if (newChild != null) {
			newChild.invalidate();
			emitEvent("childrenchanged");
		}

		return newChild;
	}

	public override function addChildAt<T:DisplayObject>(child : T, index : Int) : T {
		if (child.parent != null) {
			untyped child.parent.removeChild(child);
		}

		var newChild = super.addChildAt(child, index > children.length ? children.length : index);

		if (newChild != null) {
			newChild.invalidate();
			emitEvent("childrenchanged");
		}

		return newChild;
	}

	public override function removeChild(child : DisplayObject) : DisplayObject {
		var oldChild = super.removeChild(child);

		if (oldChild != null) {
			oldChild.invalidate();

			invalidateInteractive();
			invalidateStage();

			emitEvent("childrenchanged");
		}

		return oldChild;
	}

	public function invalidateStage() : Void {
		if (stage != null) {
			if (stage != this) {
				stage.invalidateStage();
			} else {
				stageChanged = true;
				RenderSupportJSPixi.PixiStageChanged = true;
			}
		}
	}

	public function render(renderer : CanvasRenderer) {
		if (RenderSupportJSPixi.DomRenderer) {
			if (stageChanged) {
				stageChanged = false;

				if (transformChanged) {
					updateTransform();
				}
			}
		} else if (stageChanged && view != null) {
			stageChanged = false;

			renderer.view = view;
			renderer.context = context;
			untyped renderer.rootContext = context;
			renderer.transparent = parent.children.indexOf(this) != 0;

			DisplayObjectHelper.InvalidateStage = !transformChanged;
			renderer.render(this, null, true, null, !transformChanged);
			DisplayObjectHelper.InvalidateStage = true;
		}
	}

	public override function getLocalBounds(?rect : Rectangle) : Rectangle {
		if (RenderSupportJSPixi.DomRenderer) {
			updateTransform();
			localBounds.clear();

			if (this.mask || untyped this.alphaMask) {
				var mask = this.mask != null ? this.mask : untyped this.alphaMask;

				if (untyped mask.worldTransformChanged) {
					untyped mask.transform.updateLocalTransform();
				}

				var maskRect = mask.getLocalBounds();

				localBounds.minX = maskRect.x * mask.localTransform.a + maskRect.y * mask.localTransform.c + mask.localTransform.tx;
				localBounds.minY = maskRect.x * mask.localTransform.b + maskRect.y * mask.localTransform.d + mask.localTransform.ty;
				localBounds.maxX = (maskRect.x + maskRect.width) * mask.localTransform.a + (maskRect.y + maskRect.height) * mask.localTransform.c + mask.localTransform.tx;
				localBounds.maxY = (maskRect.x + maskRect.width) * mask.localTransform.b + (maskRect.y + maskRect.height) * mask.localTransform.d + mask.localTransform.ty;
			} else if (children.length > 0) {
				var firstChild = children[0];

				if (untyped firstChild.worldTransformChanged) {
					untyped firstChild.transform.updateLocalTransform();
				}

				var childRect = firstChild.getLocalBounds();

				localBounds.minX = childRect.x * firstChild.localTransform.a + childRect.y * firstChild.localTransform.c + firstChild.localTransform.tx;
				localBounds.minY = childRect.x * firstChild.localTransform.b + childRect.y * firstChild.localTransform.d + firstChild.localTransform.ty;
				localBounds.maxX = (childRect.x + childRect.width) * firstChild.localTransform.a + (childRect.y + childRect.height) * firstChild.localTransform.c + firstChild.localTransform.tx;
				localBounds.maxY = (childRect.x + childRect.width) * firstChild.localTransform.b + (childRect.y + childRect.height) * firstChild.localTransform.d + firstChild.localTransform.ty;

				for (child in children.slice(1)) {
					if (untyped child.worldTransformChanged) {
						untyped child.transform.updateLocalTransform();
					}

					childRect = child.getLocalBounds();

					localBounds.minX = Math.min(localBounds.minX, childRect.x * child.localTransform.a + childRect.y * child.localTransform.c + child.localTransform.tx);
					localBounds.minY = Math.min(localBounds.minY, childRect.x * child.localTransform.b + childRect.y * child.localTransform.d + child.localTransform.ty);
					localBounds.maxX = Math.max(localBounds.maxX, (childRect.x + childRect.width) * child.localTransform.a + (childRect.y + childRect.height) * child.localTransform.c + child.localTransform.tx);
					localBounds.maxY = Math.max(localBounds.maxY, (childRect.x + childRect.width) * child.localTransform.b + (childRect.y + childRect.height) * child.localTransform.d + child.localTransform.ty);
				}
			}
			return localBounds.getRectangle(rect);
		} else {
			return super.getLocalBounds(rect);
		}
	}

	public override function getBounds(?skipUpdate : Bool, ?rect : Rectangle) : Rectangle {
		if (RenderSupportJSPixi.DomRenderer) {
			if (!skipUpdate) {
				getLocalBounds();
			}

			if (untyped this._boundsID != untyped this._lastBoundsID)
			{
				untyped this.calculateBounds();
			}

			return _bounds.getRectangle(rect);
		} else {
			return super.getBounds(skipUpdate, rect);
		}
	}

	public function calculateBounds() : Void {
		if (RenderSupportJSPixi.DomRenderer) {
			_bounds.minX = localBounds.minX * worldTransform.a + localBounds.minY * worldTransform.c + worldTransform.tx;
			_bounds.minY = localBounds.minX * worldTransform.b + localBounds.minY * worldTransform.d + worldTransform.ty;
			_bounds.maxX = localBounds.maxX * worldTransform.a + localBounds.maxY * worldTransform.c + worldTransform.tx;
			_bounds.maxY = localBounds.maxX * worldTransform.b + localBounds.maxY * worldTransform.d + worldTransform.ty;
		} else {
			untyped super.calculateBounds();
		}
	}

	private function createNativeWidget(?node_name : String = "div") : Void {
		deleteNativeWidget();

		nativeWidget = Browser.document.createElement(node_name);
		nativeWidget.setAttribute('id', getClipUUID());
		nativeWidget.style.transformOrigin = 'top left';
		nativeWidget.style.position = 'fixed';
		// nativeWidget.style.willChange = 'transform, display, opacity';
		nativeWidget.style.pointerEvents = 'none';

		updateNativeWidgetDisplay();

		onAdded(function() { addNativeWidget(); return removeNativeWidget; });
	}

	private function deleteNativeWidget() : Void {
		removeNativeWidget();

		if (accessWidget != null) {
			AccessWidget.removeAccessWidget(accessWidget);
		}

		nativeWidget = null;
	}

	private function updateNativeWidget() : Void {
		if (nativeWidget != null) {
			var transform = untyped this.transform.localTransform;

			var tx = Math.floor(transform.tx);
			var ty = Math.floor(transform.ty);

			if (tx != 0 || ty != 0 || transform.a != 1 || transform.b != 0 || transform.c != 0 || transform.d != 1) {
				if (Platform.isIE) {
					nativeWidget.style.transform = 'matrix(${transform.a}, ${transform.b}, ${transform.c}, ${transform.d}, 0, 0)';

					nativeWidget.style.left = '${tx}px';
					nativeWidget.style.top = '${ty}px';
				} else {
					nativeWidget.style.transform = 'matrix(${transform.a}, ${transform.b}, ${transform.c}, ${transform.d}, ${tx}, ${ty})';
				}
			} else {
				nativeWidget.style.transform = null;

				if (Platform.isIE) {
					nativeWidget.style.left = null;
					nativeWidget.style.top = null;
				}
			}

			if (alpha != 1) {
				nativeWidget.style.opacity = alpha;
			} else {
				nativeWidget.style.opacity = null;
			}

			if (scrollRect != null) {
				if (Platform.isIE || Platform.isEdge) {
					nativeWidget.style.clip = 'rect(
						${scrollRect.y}px,
						${scrollRect.x + scrollRect.width}px,
						${scrollRect.y + scrollRect.height}px,
						${scrollRect.x}px
					)';
				} else {
					nativeWidget.style.clipPath = 'polygon(
						${scrollRect.x}px ${scrollRect.y}px,
						${scrollRect.x}px ${scrollRect.y + scrollRect.height}px,
						${scrollRect.x + scrollRect.width}px ${scrollRect.y + scrollRect.height}px,
						${scrollRect.x + scrollRect.width}px ${scrollRect.y}px
					)';
				}
			} else if (mask != null) {
				if (Platform.isIE || Platform.isEdge) {
					nativeWidget.style.clip = 'rect(
						${mask.y}px,
						${mask.x + mask.getWidth()}px,
						${mask.y + mask.getHeight()}px,
						${mask.x}px
					)';
				} else {
					nativeWidget.style.clipPath = cast(mask, DisplayObject).getClipPath();
				}
			} else {
				nativeWidget.style.clipPath = null;
			}
		}
	}

	private function addNativeWidget() : Void {
		if (nativeWidget != null && parent != null && untyped parent.nativeWidget != null) {
			untyped parent.nativeWidget.appendChild(nativeWidget);
		}
	}

	private function removeNativeWidget() : Void {
		if (nativeWidget != null && nativeWidget.parentNode != null) {
			nativeWidget.parentNode.removeChild(nativeWidget);
		}
	}

	public function updateNativeWidgetDisplay() : Void {
		if (nativeWidget != null) {
			if (visible) {
				nativeWidget.style.display = "block";
			} else if (parent == null || (untyped parent.nativeWidget != null && untyped parent.nativeWidget.style.display == "block")) {
				nativeWidget.style.display = "none";
			}
		}
	}
}