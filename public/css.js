/******/ (function(modules) { // webpackBootstrap
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var filename = require("path").join(__dirname, "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		require("fs").readFile(filename, "utf-8", function(err, content) {
/******/ 			if (err) {
/******/ 				if (__webpack_require__.onError) return __webpack_require__.oe(err);
/******/ 				throw err;
/******/ 			}
/******/ 			var chunk = {};
/******/ 			require("vm").runInThisContext(
/******/ 				"(function(exports) {" + content + "\n})",
/******/ 				{ filename: filename }
/******/ 			)(chunk);
/******/ 			hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest() {
/******/ 		var filename = require("path").join(__dirname, "" + hotCurrentHash + ".hot-update.json");
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			require("fs").readFile(filename, "utf-8", function(err, content) {
/******/ 				if (err) return resolve();
/******/ 				try {
/******/ 					var update = JSON.parse(content);
/******/ 				} catch (e) {
/******/ 					return reject(e);
/******/ 				}
/******/ 				resolve(update);
/******/ 			});
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "cc5914bf485ab506d235";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "css";
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted
/******/ 			)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/Users/claudio/baboon/public/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire("./src/css/App.css")(__webpack_require__.s = "./src/css/App.css");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/css-loader/index.js!./node_modules/sass-loader/lib/loader.js!./src/css/App.css":
/*!********************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/sass-loader/lib/loader.js!./src/css/App.css ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".react-datepicker-popper[data-placement^=\"bottom\"] .react-datepicker__triangle, .react-datepicker-popper[data-placement^=\"top\"] .react-datepicker__triangle, .react-datepicker__year-read-view--down-arrow,\n.react-datepicker__month-read-view--down-arrow,\n.react-datepicker__month-year-read-view--down-arrow {\n  margin-left: -8px;\n  position: absolute; }\n\n.react-datepicker-popper[data-placement^=\"bottom\"] .react-datepicker__triangle, .react-datepicker-popper[data-placement^=\"top\"] .react-datepicker__triangle, .react-datepicker__year-read-view--down-arrow,\n.react-datepicker__month-read-view--down-arrow,\n.react-datepicker__month-year-read-view--down-arrow, .react-datepicker-popper[data-placement^=\"bottom\"] .react-datepicker__triangle::before, .react-datepicker-popper[data-placement^=\"top\"] .react-datepicker__triangle::before, .react-datepicker__year-read-view--down-arrow::before,\n.react-datepicker__month-read-view--down-arrow::before,\n.react-datepicker__month-year-read-view--down-arrow::before {\n  box-sizing: content-box;\n  position: absolute;\n  border: 8px solid transparent;\n  height: 0;\n  width: 1px; }\n\n.react-datepicker-popper[data-placement^=\"bottom\"] .react-datepicker__triangle::before, .react-datepicker-popper[data-placement^=\"top\"] .react-datepicker__triangle::before, .react-datepicker__year-read-view--down-arrow::before,\n.react-datepicker__month-read-view--down-arrow::before,\n.react-datepicker__month-year-read-view--down-arrow::before {\n  content: \"\";\n  z-index: -1;\n  border-width: 8px;\n  left: -8px;\n  border-bottom-color: #aeaeae; }\n\n.react-datepicker-popper[data-placement^=\"bottom\"] .react-datepicker__triangle {\n  top: 0;\n  margin-top: -8px; }\n\n.react-datepicker-popper[data-placement^=\"bottom\"] .react-datepicker__triangle, .react-datepicker-popper[data-placement^=\"bottom\"] .react-datepicker__triangle::before {\n  border-top: none;\n  border-bottom-color: #f0f0f0; }\n\n.react-datepicker-popper[data-placement^=\"bottom\"] .react-datepicker__triangle::before {\n  top: -1px;\n  border-bottom-color: #aeaeae; }\n\n.react-datepicker-popper[data-placement^=\"top\"] .react-datepicker__triangle, .react-datepicker__year-read-view--down-arrow,\n.react-datepicker__month-read-view--down-arrow,\n.react-datepicker__month-year-read-view--down-arrow {\n  bottom: 0;\n  margin-bottom: -8px; }\n\n.react-datepicker-popper[data-placement^=\"top\"] .react-datepicker__triangle, .react-datepicker__year-read-view--down-arrow,\n.react-datepicker__month-read-view--down-arrow,\n.react-datepicker__month-year-read-view--down-arrow, .react-datepicker-popper[data-placement^=\"top\"] .react-datepicker__triangle::before, .react-datepicker__year-read-view--down-arrow::before,\n.react-datepicker__month-read-view--down-arrow::before,\n.react-datepicker__month-year-read-view--down-arrow::before {\n  border-bottom: none;\n  border-top-color: #fff; }\n\n.react-datepicker-popper[data-placement^=\"top\"] .react-datepicker__triangle::before, .react-datepicker__year-read-view--down-arrow::before,\n.react-datepicker__month-read-view--down-arrow::before,\n.react-datepicker__month-year-read-view--down-arrow::before {\n  bottom: -1px;\n  border-top-color: #aeaeae; }\n\n.react-datepicker-wrapper {\n  display: inline-block; }\n\n.react-datepicker {\n  font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: 0.8rem;\n  background-color: #fff;\n  color: #000;\n  border: 1px solid #aeaeae;\n  border-radius: 0.3rem;\n  display: inline-block;\n  position: relative; }\n\n.react-datepicker--time-only .react-datepicker__triangle {\n  left: 35px; }\n\n.react-datepicker--time-only .react-datepicker__time-container {\n  border-left: 0; }\n\n.react-datepicker--time-only .react-datepicker__time {\n  border-radius: 0.3rem; }\n\n.react-datepicker--time-only .react-datepicker__time-box {\n  border-radius: 0.3rem; }\n\n.react-datepicker__triangle {\n  position: absolute;\n  left: 50px; }\n\n.react-datepicker-popper {\n  z-index: 1; }\n\n.react-datepicker-popper[data-placement^=\"bottom\"] {\n  margin-top: 10px; }\n\n.react-datepicker-popper[data-placement^=\"top\"] {\n  margin-bottom: 10px; }\n\n.react-datepicker-popper[data-placement^=\"right\"] {\n  margin-left: 8px; }\n\n.react-datepicker-popper[data-placement^=\"right\"] .react-datepicker__triangle {\n  left: auto;\n  right: 42px; }\n\n.react-datepicker-popper[data-placement^=\"left\"] {\n  margin-right: 8px; }\n\n.react-datepicker-popper[data-placement^=\"left\"] .react-datepicker__triangle {\n  left: 42px;\n  right: auto; }\n\n.react-datepicker__header {\n  text-align: center;\n  background-color: #f0f0f0;\n  border-bottom: 1px solid #aeaeae;\n  border-top-left-radius: 0.3rem;\n  border-top-right-radius: 0.3rem;\n  padding-top: 8px;\n  position: relative; }\n\n.react-datepicker__header--time {\n  padding-bottom: 8px;\n  padding-left: 5px;\n  padding-right: 5px; }\n\n.react-datepicker__year-dropdown-container--select,\n.react-datepicker__month-dropdown-container--select,\n.react-datepicker__month-year-dropdown-container--select,\n.react-datepicker__year-dropdown-container--scroll,\n.react-datepicker__month-dropdown-container--scroll,\n.react-datepicker__month-year-dropdown-container--scroll {\n  display: inline-block;\n  margin: 0 2px; }\n\n.react-datepicker__current-month,\n.react-datepicker-time__header {\n  margin-top: 0;\n  color: #000;\n  font-weight: bold;\n  font-size: 0.944rem; }\n\n.react-datepicker-time__header {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden; }\n\n.react-datepicker__navigation {\n  background: none;\n  line-height: 1.7rem;\n  text-align: center;\n  cursor: pointer;\n  position: absolute;\n  top: 10px;\n  width: 0;\n  padding: 0;\n  border: 0.45rem solid transparent;\n  z-index: 1; }\n\n.react-datepicker__navigation--previous {\n  left: 10px;\n  border-right-color: #ccc; }\n\n.react-datepicker__navigation--previous:hover {\n  border-right-color: #b3b3b3; }\n\n.react-datepicker__navigation--previous--disabled, .react-datepicker__navigation--previous--disabled:hover {\n  border-right-color: #e6e6e6;\n  cursor: default; }\n\n.react-datepicker__navigation--next {\n  right: 10px;\n  border-left-color: #ccc; }\n\n.react-datepicker__navigation--next--with-time:not(.react-datepicker__navigation--next--with-today-button) {\n  right: 80px; }\n\n.react-datepicker__navigation--next:hover {\n  border-left-color: #b3b3b3; }\n\n.react-datepicker__navigation--next--disabled, .react-datepicker__navigation--next--disabled:hover {\n  border-left-color: #e6e6e6;\n  cursor: default; }\n\n.react-datepicker__navigation--years {\n  position: relative;\n  top: 0;\n  display: block;\n  margin-left: auto;\n  margin-right: auto; }\n\n.react-datepicker__navigation--years-previous {\n  top: 4px;\n  border-top-color: #ccc; }\n\n.react-datepicker__navigation--years-previous:hover {\n  border-top-color: #b3b3b3; }\n\n.react-datepicker__navigation--years-upcoming {\n  top: -4px;\n  border-bottom-color: #ccc; }\n\n.react-datepicker__navigation--years-upcoming:hover {\n  border-bottom-color: #b3b3b3; }\n\n.react-datepicker__month-container {\n  float: left; }\n\n.react-datepicker__month {\n  margin: 0.4rem;\n  text-align: center; }\n\n.react-datepicker__time-container {\n  float: right;\n  border-left: 1px solid #aeaeae;\n  width: 70px; }\n\n.react-datepicker__time-container--with-today-button {\n  display: inline;\n  border: 1px solid #aeaeae;\n  border-radius: 0.3rem;\n  position: absolute;\n  right: -72px;\n  top: 0; }\n\n.react-datepicker__time-container .react-datepicker__time {\n  position: relative;\n  background: white; }\n\n.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box {\n  width: 70px;\n  overflow-x: hidden;\n  margin: 0 auto;\n  text-align: center; }\n\n.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list {\n  list-style: none;\n  margin: 0;\n  height: calc(195px + (1.7rem / 2));\n  overflow-y: scroll;\n  padding-right: 30px;\n  width: 100%;\n  box-sizing: content-box; }\n\n.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item {\n  padding: 5px 10px; }\n\n.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item:hover {\n  cursor: pointer;\n  background-color: #f0f0f0; }\n\n.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--selected {\n  background-color: #216ba5;\n  color: white;\n  font-weight: bold; }\n\n.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--selected:hover {\n  background-color: #216ba5; }\n\n.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--disabled {\n  color: #ccc; }\n\n.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--disabled:hover {\n  cursor: default;\n  background-color: transparent; }\n\n.react-datepicker__week-number {\n  color: #ccc;\n  display: inline-block;\n  width: 1.7rem;\n  line-height: 1.7rem;\n  text-align: center;\n  margin: 0.166rem; }\n\n.react-datepicker__week-number.react-datepicker__week-number--clickable {\n  cursor: pointer; }\n\n.react-datepicker__week-number.react-datepicker__week-number--clickable:hover {\n  border-radius: 0.3rem;\n  background-color: #f0f0f0; }\n\n.react-datepicker__day-names,\n.react-datepicker__week {\n  white-space: nowrap; }\n\n.react-datepicker__day-name,\n.react-datepicker__day,\n.react-datepicker__time-name {\n  color: #000;\n  display: inline-block;\n  width: 1.7rem;\n  line-height: 1.7rem;\n  text-align: center;\n  margin: 0.166rem; }\n\n.react-datepicker__day {\n  cursor: pointer; }\n\n.react-datepicker__day:hover {\n  border-radius: 0.3rem;\n  background-color: #f0f0f0; }\n\n.react-datepicker__day--today {\n  font-weight: bold; }\n\n.react-datepicker__day--highlighted {\n  border-radius: 0.3rem;\n  background-color: #3dcc4a;\n  color: #fff; }\n\n.react-datepicker__day--highlighted:hover {\n  background-color: #32be3f; }\n\n.react-datepicker__day--highlighted-custom-1 {\n  color: magenta; }\n\n.react-datepicker__day--highlighted-custom-2 {\n  color: green; }\n\n.react-datepicker__day--selected, .react-datepicker__day--in-selecting-range, .react-datepicker__day--in-range {\n  border-radius: 0.3rem;\n  background-color: #216ba5;\n  color: #fff; }\n\n.react-datepicker__day--selected:hover, .react-datepicker__day--in-selecting-range:hover, .react-datepicker__day--in-range:hover {\n  background-color: #1d5d90; }\n\n.react-datepicker__day--keyboard-selected {\n  border-radius: 0.3rem;\n  background-color: #2a87d0;\n  color: #fff; }\n\n.react-datepicker__day--keyboard-selected:hover {\n  background-color: #1d5d90; }\n\n.react-datepicker__day--in-selecting-range:not(.react-datepicker__day--in-range) {\n  background-color: rgba(33, 107, 165, 0.5); }\n\n.react-datepicker__month--selecting-range .react-datepicker__day--in-range:not(.react-datepicker__day--in-selecting-range) {\n  background-color: #f0f0f0;\n  color: #000; }\n\n.react-datepicker__day--disabled {\n  cursor: default;\n  color: #ccc; }\n\n.react-datepicker__day--disabled:hover {\n  background-color: transparent; }\n\n.react-datepicker__input-container {\n  position: relative;\n  display: inline-block; }\n\n.react-datepicker__year-read-view,\n.react-datepicker__month-read-view,\n.react-datepicker__month-year-read-view {\n  border: 1px solid transparent;\n  border-radius: 0.3rem; }\n\n.react-datepicker__year-read-view:hover,\n.react-datepicker__month-read-view:hover,\n.react-datepicker__month-year-read-view:hover {\n  cursor: pointer; }\n\n.react-datepicker__year-read-view:hover .react-datepicker__year-read-view--down-arrow,\n.react-datepicker__year-read-view:hover .react-datepicker__month-read-view--down-arrow,\n.react-datepicker__month-read-view:hover .react-datepicker__year-read-view--down-arrow,\n.react-datepicker__month-read-view:hover .react-datepicker__month-read-view--down-arrow,\n.react-datepicker__month-year-read-view:hover .react-datepicker__year-read-view--down-arrow,\n.react-datepicker__month-year-read-view:hover .react-datepicker__month-read-view--down-arrow {\n  border-top-color: #b3b3b3; }\n\n.react-datepicker__year-read-view--down-arrow,\n.react-datepicker__month-read-view--down-arrow,\n.react-datepicker__month-year-read-view--down-arrow {\n  border-top-color: #ccc;\n  float: right;\n  margin-left: 20px;\n  top: 8px;\n  position: relative;\n  border-width: 0.45rem; }\n\n.react-datepicker__year-dropdown,\n.react-datepicker__month-dropdown,\n.react-datepicker__month-year-dropdown {\n  background-color: #f0f0f0;\n  position: absolute;\n  width: 50%;\n  left: 25%;\n  top: 30px;\n  z-index: 1;\n  text-align: center;\n  border-radius: 0.3rem;\n  border: 1px solid #aeaeae; }\n\n.react-datepicker__year-dropdown:hover,\n.react-datepicker__month-dropdown:hover,\n.react-datepicker__month-year-dropdown:hover {\n  cursor: pointer; }\n\n.react-datepicker__year-dropdown--scrollable,\n.react-datepicker__month-dropdown--scrollable,\n.react-datepicker__month-year-dropdown--scrollable {\n  height: 150px;\n  overflow-y: scroll; }\n\n.react-datepicker__year-option,\n.react-datepicker__month-option,\n.react-datepicker__month-year-option {\n  line-height: 20px;\n  width: 100%;\n  display: block;\n  margin-left: auto;\n  margin-right: auto; }\n\n.react-datepicker__year-option:first-of-type,\n.react-datepicker__month-option:first-of-type,\n.react-datepicker__month-year-option:first-of-type {\n  border-top-left-radius: 0.3rem;\n  border-top-right-radius: 0.3rem; }\n\n.react-datepicker__year-option:last-of-type,\n.react-datepicker__month-option:last-of-type,\n.react-datepicker__month-year-option:last-of-type {\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  border-bottom-left-radius: 0.3rem;\n  border-bottom-right-radius: 0.3rem; }\n\n.react-datepicker__year-option:hover,\n.react-datepicker__month-option:hover,\n.react-datepicker__month-year-option:hover {\n  background-color: #ccc; }\n\n.react-datepicker__year-option:hover .react-datepicker__navigation--years-upcoming,\n.react-datepicker__month-option:hover .react-datepicker__navigation--years-upcoming,\n.react-datepicker__month-year-option:hover .react-datepicker__navigation--years-upcoming {\n  border-bottom-color: #b3b3b3; }\n\n.react-datepicker__year-option:hover .react-datepicker__navigation--years-previous,\n.react-datepicker__month-option:hover .react-datepicker__navigation--years-previous,\n.react-datepicker__month-year-option:hover .react-datepicker__navigation--years-previous {\n  border-top-color: #b3b3b3; }\n\n.react-datepicker__year-option--selected,\n.react-datepicker__month-option--selected,\n.react-datepicker__month-year-option--selected {\n  position: absolute;\n  left: 15px; }\n\n.react-datepicker__close-icon {\n  background-color: transparent;\n  border: 0;\n  cursor: pointer;\n  display: inline-block;\n  height: 0;\n  outline: 0;\n  padding: 0;\n  vertical-align: middle; }\n\n.react-datepicker__close-icon::after {\n  background-color: #216ba5;\n  border-radius: 50%;\n  bottom: 0;\n  box-sizing: border-box;\n  color: #fff;\n  content: \"\\D7\";\n  cursor: pointer;\n  font-size: 12px;\n  height: 16px;\n  width: 16px;\n  line-height: 1;\n  margin: -8px auto 0;\n  padding: 2px;\n  position: absolute;\n  right: 7px;\n  text-align: center;\n  top: 50%; }\n\n.react-datepicker__today-button {\n  background: #f0f0f0;\n  border-top: 1px solid #aeaeae;\n  cursor: pointer;\n  text-align: center;\n  font-weight: bold;\n  padding: 5px 0;\n  clear: left; }\n\n.react-datepicker__portal {\n  position: fixed;\n  width: 100vw;\n  height: 100vh;\n  background-color: rgba(0, 0, 0, 0.8);\n  left: 0;\n  top: 0;\n  justify-content: center;\n  align-items: center;\n  display: flex;\n  z-index: 2147483647; }\n\n.react-datepicker__portal .react-datepicker__day-name,\n.react-datepicker__portal .react-datepicker__day,\n.react-datepicker__portal .react-datepicker__time-name {\n  width: 3rem;\n  line-height: 3rem; }\n\n@media (max-width: 400px), (max-height: 550px) {\n  .react-datepicker__portal .react-datepicker__day-name,\n  .react-datepicker__portal .react-datepicker__day,\n  .react-datepicker__portal .react-datepicker__time-name {\n    width: 2rem;\n    line-height: 2rem; } }\n\n.react-datepicker__portal .react-datepicker__current-month,\n.react-datepicker__portal .react-datepicker-time__header {\n  font-size: 1.44rem; }\n\n.react-datepicker__portal .react-datepicker__navigation {\n  border: 0.81rem solid transparent; }\n\n.react-datepicker__portal .react-datepicker__navigation--previous {\n  border-right-color: #ccc; }\n\n.react-datepicker__portal .react-datepicker__navigation--previous:hover {\n  border-right-color: #b3b3b3; }\n\n.react-datepicker__portal .react-datepicker__navigation--previous--disabled, .react-datepicker__portal .react-datepicker__navigation--previous--disabled:hover {\n  border-right-color: #e6e6e6;\n  cursor: default; }\n\n.react-datepicker__portal .react-datepicker__navigation--next {\n  border-left-color: #ccc; }\n\n.react-datepicker__portal .react-datepicker__navigation--next:hover {\n  border-left-color: #b3b3b3; }\n\n.react-datepicker__portal .react-datepicker__navigation--next--disabled, .react-datepicker__portal .react-datepicker__navigation--next--disabled:hover {\n  border-left-color: #e6e6e6;\n  cursor: default; }\n\n/* parameters */\n/*colors*/\n/*font sizes*/\n/*spacings*/\n/*media sizes*/\n/*** Functions ***/\n/*Example*/\n/* Set text color based on background color*/\n/*Button Mixins*/\n:root {\n  --json-font-size: 14px; }\n\n#minifiedContainer {\n  margin-top: 30px;\n  margin-left: 50px;\n  margin-right: 50px; }\n\n#minifiedContainer p {\n  font-family: Menlo, Monaco, Consolas, \"Courier New\", monospace;\n  color: #ccd;\n  line-height: 1.5em;\n  line-break: auto;\n  word-wrap: break-word;\n  font-weight: 600;\n  font-style: normal; }\n\n#mongo_results {\n  position: relative;\n  left: 7%;\n  background-color: rgba(0, 0, 0, 0) !important; }\n\n.json-pretty {\n  color: #b7b8b6;\n  font-weight: 600;\n  font-size: var(--json-font-size);\n  border: solid 0px rgba(0, 0, 0, 0) !important;\n  outline-color: rgba(0, 0, 0, 0); }\n\n.json-key {\n  color: #66a5ad;\n  font-weight: inherit; }\n\n.json-value {\n  color: #a482f1;\n  /* #7da3a1;*/\n  font-weight: inherit; }\n\n.json-string {\n  color: #6fb98f;\n  font-weight: inherit; }\n\nh1 {\n  color: white; }\n\nh4 {\n  font-size: 24px;\n  font-weight: 100;\n  color: #d6d6df;\n  font-style: italic; }\n\nh5 {\n  font-family: \"Courier New\", Courier, \"Lucida Sans Typewriter\", \"Lucida Typewriter\", monospace;\n  font-size: 16.5px;\n  font-weight: 800;\n  color: #003c44;\n  letter-spacing: 1px;\n  margin: 0px !important; }\n\nh6 {\n  font-family: \"Courier New\", Courier, \"Lucida Sans Typewriter\", \"Lucida Typewriter\", monospace;\n  font-size: 16.5px;\n  font-weight: 600;\n  color: white;\n  letter-spacing: 1px;\n  margin: 0px !important; }\n\n.success {\n  color: #00cc00; }\n\n.error {\n  color: #FF0000; }\n\n.warning {\n  color: #FFA500; }\n\n.h7 {\n  font-size: 16px;\n  font-weight: 400;\n  color: white; }\n\n.h8 {\n  font-size: 18px;\n  font-weight: 100;\n  color: #d6d6df;\n  font-style: italic; }\n\np.h9 {\n  font-size: 14px;\n  font-weight: 100;\n  color: #d6d6df;\n  font-style: italic;\n  line-height: 1.4em; }\n\np {\n  font-size: 14px;\n  font-weight: 100;\n  color: #f6f6f6;\n  font-style: italic;\n  line-height: 0.5em; }\n\nstrong {\n  line-height: inherit;\n  font-style: normal; }\n\n.browntext {\n  color: #835c3b; }\n\nlabel {\n  font-size: 16px; }\n\n.validField {\n  border: solid 1px #00cc00 !important;\n  background-color: #c3e8d3 !important; }\n\n.validField:active {\n  background-color: #c3e8d3 !important; }\n\n.validField:focus {\n  background-color: #d1f0de !important; }\n\n.not_validField {\n  border: solid 1px red !important;\n  background-color: #e2c3c3 !important; }\n\n.not_validField:active {\n  background-color: #e2c3c3 !important; }\n\n.not_validField:focus {\n  background-color: #e7d8d8 !important; }\n\n.noBorder {\n  border: 0px; }\n\n.hidden {\n  display: none;\n  visibility: hidden; }\n\n.noVisibility {\n  visibility: hidden; }\n\n.show {\n  display: inline-block; }\n\n.block {\n  display: block; }\n\n.flexBox {\n  display: flex; }\n\n.inline {\n  display: inline-block; }\n\n.display_none {\n  display: none !important; }\n\n.max-content {\n  width: max-content; }\n\nbody {\n  font: 14px \"Century Gothic\", Futura, sans-serif;\n  margin: 20px;\n  background-color: #1d1d24;\n  background-repeat: no-repeat;\n  background-attachment: fixed;\n  background-size: cover;\n  -webkit-font-smoothing: antialiased; }\n\n::selection {\n  background: #ddd1e7; }\n\n.baboonLogo {\n  width: 33%;\n  max-width: 250px;\n  min-width: 100px;\n  position: fixed;\n  bottom: 2%;\n  right: 2%;\n  opacity: .3; }\n\n.headerTitle {\n  margin-left: 350px; }\n\n.button2 {\n  width: auto;\n  min-width: 100px;\n  background-color: #2f2f2f;\n  border-radius: 8px;\n  border: solid 0.5px #8354EC;\n  padding: 0px 10px; }\n\n.button2 h4 {\n  font-weight: bold;\n  color: #bbbbbb; }\n\n.button2:hover {\n  background-color: #3f3f3f;\n  box-shadow: 0px 0px 2 0px #545454; }\n\n::-webkit-scrollbar-thumb {\n  background: rgba(0, 0, 0, 0.3) !important;\n  border-radius: 6px; }\n\n::-webkit-scrollbar-thumb:hover {\n  background: rgba(0, 0, 0, 0.45) !important;\n  transition: 1s; }\n\n.react-datepicker {\n  background-color: #d7e6ef !important;\n  border-radius: 7px;\n  z-index: 101; }\n\n.react-datepicker-popper {\n  z-index: 101;\n  min-width: 222.5px  !important;\n  width: 222.5px !important; }\n\n.react-datepicker__day--selected, .react-datepicker__time-list-item--selected {\n  background-color: #396f8e !important;\n  font-weight: 800; }\n\n/* .react-datetime-picker button {\n    color: black;\n}*/\n.react-datepicker__triangle {\n  border-top-color: #aeaeae !important; }\n\n.react-datepicker__day-name {\n  color: #c000ff !important;\n  font-weight: 800;\n  font-size: 11px; }\n\n.react-datepicker__day--today {\n  background: rgba(247, 152, 97, 0.8) !important;\n  border-radius: 3px; }\n\n.react-datepicker__day {\n  font-size: 10px; }\n\n.react-datepicker__input-container {\n  /* background-color: #c6e4e8 !important; */\n  color: #555;\n  /* font-size: 16px;\n    border-radius: 10px; */\n  width: fit-content !important;\n  height: fit-content !important; }\n\n.react-datepicker__input-container button {\n  padding-left: 2px;\n  padding-right: 3px;\n  padding-top: 1px;\n  padding-bottom: 3px;\n  border-radius: 6px;\n  max-height: 26px;\n  width: 26px; }\n\n.react-datepicker__input-container button span {\n  line-height: .75em;\n  vertical-align: -.0667em; }\n\n.react-datepicke_gmtzone-select {\n  position: absolute;\n  z-index: inherit;\n  bottom: 0;\n  right: 0;\n  height: 25px;\n  width: 70px;\n  font-size: 10.5px;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n  padding: 5px;\n  outline-color: transparent;\n  outline-width: 0px;\n  border-color: #E8662D;\n  background-color: #fdf4ef;\n  border-radius: 2.5px; }\n\n.react-datepicke_gmtzone-select option {\n  padding-left: 1px !important;\n  padding-right: 1px !important; }\n\n.react-datepicker__input-container input {\n  background-color: #c6e4e8;\n  border: 0px;\n  color: #555; }\n\nul.react-datepicker__time-list {\n  height: 95px !important; }\n\n.react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list {\n  padding: 0px;\n  background-color: #d7e6ef !important;\n  font-size: 10px; }\n\n.pickerButton {\n  color: #E8662D;\n  background-color: rgba(82, 84, 91, 0.7);\n  border-color: #bbd5e4; }\n\n.spacePicker {\n  padding-left: 3px; }\n\n#mongoTooltip {\n  position: absolute;\n  top: -51px;\n  left: 15px;\n  display: inline;\n  word-wrap: nowrap;\n  background-color: #f4b397;\n  color: black;\n  border-radius: 5px;\n  font-size: 14px;\n  padding: 1px 5px;\n  min-height: 40px; }\n\n#mongoTooltip::after {\n  border-top: 10px solid #f4b397;\n  border-left: 10px solid transparent;\n  border-right: 10px solid transparent;\n  bottom: 0px;\n  content: \"\";\n  position: absolute;\n  top: 40px;\n  left: 25%;\n  margin-left: -21px;\n  width: 0;\n  height: 0; }\n\n.cursorWrapper {\n  margin-top: 4% !important; }\n\n.cursorWrapper .querycheck {\n  position: absolute !important; }\n\n.cursorWrapper .h7 {\n  display: table-cell; }\n\n.cursorWrapper .checkmark {\n  padding-right: 10px; }\n\n.cursorSelect {\n  position: relative;\n  bottom: 10px;\n  margin: 0px 3px; }\n\n.cursorWrapper .inputSelect {\n  padding-bottom: 10px; }\n\n.cursorGridWrapper {\n  margin-top: 15px;\n  min-width: 300px; }\n\n.cursorText {\n  position: relative;\n  /* padding-top: 12%; */\n  margin-bottom: 10px;\n  margin-left: 10px;\n  height: 25px;\n  max-height: 25px;\n  min-height: 25px; }\n\n.flexContainer {\n  display: inline-flex;\n  flex-direction: row;\n  justify-content: flex-start; }\n\n.flexItem {\n  margin-right: 20px; }\n\n.cursorText .h7 {\n  font-size: 18px;\n  font-weight: 600;\n  color: white; }\n\n.cursorTitle {\n  left: 0px !important; }\n\n.contentTable {\n  background-color: rgba(0, 0, 0, 0);\n  position: relative; }\n\n.queryCollectionTable {\n  margin-top: 5px;\n  padding-right: 15px;\n  margin-bottom: 5px; }\n\n.keysTable,\n.keysTable td {\n  font-size: 20px;\n  text-align: center;\n  border: solid 0px;\n  padding-bottom: 3px;\n  padding-left: 7px;\n  /* max-height: 113px !important; */ }\n\n.keysTable {\n  width: unset !important;\n  padding-top: 0px;\n  display: inline-table; }\n\n.keysTable td {\n  padding-top: 6px; }\n\n.keysTable td > * {\n  vertical-align: middle; }\n\n/****************** INPUTS *********************/\n.inputText, .inputSelect {\n  background-color: #c6e4e8;\n  size: 100%;\n  /* line-height: 1.5; */\n  height: 25.5px;\n  width: auto; }\n\n.inputText:focus,\n.inputText:active {\n  background-color: #f1fcf9; }\n\n.inActive {\n  background-color: #396f8e !important;\n  text-decoration: line-through;\n  pointer-events: none; }\n\n.inActiveDB {\n  background-color: #396f8e !important;\n  font-weight: 400;\n  color: black;\n  pointer-events: none; }\n\n/* .inputSelect.inActive{\n   outline: 2px solid #396f8e !important;\n} */\n.inputText::placeholder {\n  /* Chrome, Firefox, Opera, Safari 10.1+ */\n  color: #333333;\n  opacity: 0.7;\n  font-style: italic;\n  font-weight: 200;\n  /* Firefox */ }\n\n.inputText {\n  width: 260px;\n  font-size: 15px;\n  padding-left: 3px;\n  border: 0px;\n  border-radius: 10px; }\n\n@media (max-width: 320px) {\n  .inputText {\n    width: 96%; } }\n\n.inputSelect {\n  /* max-width: 60px ; */\n  height: 25px;\n  line-height: 2;\n  font-size: 16px;\n  border: 0;\n  outline-offset: -2px;\n  /* outline: 2px solid #c6e4e8 !important; */\n  text-align-last: center;\n  cursor: pointer;\n  padding: 0px 6px;\n  color: #333;\n  border-radius: 10px; }\n\n.largeSelect {\n  width: 200px;\n  max-width: 150px; }\n\n.collectionSelect {\n  width: auto;\n  max-width: 300px; }\n\n.fieldTitle {\n  text-align: left;\n  float: left; }\n\ntextarea,\ninput,\nbutton, .inputSelect {\n  outline-color: transparent;\n  outline-width: 0px; }\n\n/****************** BUTTONS *********************/\n.addRemoveLineBtn {\n  background-color: white;\n  color: #396f8e;\n  font-weight: 600;\n  font-size: 16px;\n  width: 25px;\n  height: 25px;\n  margin-left: 5px;\n  cursor: pointer;\n  vertical-align: middle;\n  border: 2px solid #E8662D;\n  -webkit-box-shadow: 2px 2px 7px rgba(11, 11, 11, 0.4);\n  box-shadow: 2px 2px 7px rgba(11, 11, 11, 0.4);\n  border-radius: 100%;\n  padding: 0px; }\n\n.addRemoveLineBtn:active {\n  background-color: #f5dbc2; }\n\n@media (max-width: 668px) {\n  .addRemoveLineBtn {\n    width: 20px;\n    height: 20px;\n    font-size: 14px;\n    margin-left: 3px;\n    padding: 0px;\n    margin-top: 3px; } }\n\n.addRemoveStageBtn {\n  background-color: white;\n  color: #396f8e;\n  font-weight: 400;\n  font-size: 24px;\n  width: 34px;\n  height: 34px;\n  margin-left: 5px;\n  cursor: pointer;\n  vertical-align: middle;\n  border: 2px solid #E8662D;\n  box-shadow: 2px 2px 7px rgba(11, 11, 11, 0.4);\n  border-radius: 6px;\n  padding: 0px; }\n\n.addRemoveStageBtn:active {\n  background-color: #f5dbc2; }\n\n.addRemove {\n  text-align: left;\n  display: inline-flex; }\n\n.comma {\n  width: 10px;\n  vertical-align: bottom;\n  color: white; }\n\n.comma > b {\n  padding: 0px;\n  border: 0px; }\n\n/****************** CHECKBOX *********************/\n.querycheck, .stagecheck {\n  position: relative;\n  padding-left: 35px;\n  margin-bottom: 12px;\n  cursor: pointer;\n  font-size: 22px;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.stagecheck {\n  display: inline-table;\n  margin-left: 10px;\n  top: -15px;\n  position: absolute; }\n\n.querycheck {\n  display: block;\n  margin-top: 6px; }\n\n/* Hide the browser's default checkbox */\n.stagecheck input, .querycheck input {\n  position: absolute;\n  opacity: 0;\n  cursor: pointer; }\n\n/* Create a custom checkbox */\n.large_checkmark {\n  height: 21px !important;\n  width: 21px !important;\n  border-radius: 5px !important; }\n\n.checkmark {\n  position: absolute;\n  top: 0;\n  left: 0;\n  height: 13px;\n  width: 13px;\n  background-color: #eee;\n  border: solid 1px;\n  border-color: #c8f2e6;\n  border-radius: 3px; }\n\n/* On mouse-over, add a grey background color */\n.stagecheck:hover input ~ .checkmark, .querycheck:hover input ~ .checkmark {\n  background-color: #ccc; }\n\n/* When the checkbox is checked, add a blue background */\n.stagecheck input:checked ~ .checkmark, .querycheck input:checked ~ .checkmark {\n  /* background-color: rgb(131, 92, 59); */\n  background-color: #E8662D;\n  /*29ab87*/ }\n\n.checkmark:after {\n  content: \"\";\n  position: absolute;\n  display: none; }\n\n/* Show the checkmark when checked */\n.stagecheck input:checked ~ .checkmark:after, .querycheck input:checked ~ .checkmark:after {\n  display: block; }\n\n/* Style the checkmark/indicator */\n.querycheck .checkmark:after {\n  left: 5.5px;\n  bottom: 4px;\n  width: 5px;\n  height: 12px;\n  border: solid white;\n  border-width: 0 3px 3px 0;\n  -webkit-transform: rotate(0deg);\n  -ms-transform: rotate(0deg);\n  transform: rotate(45deg); }\n\n.stagecheck .checkmark:after {\n  left: 8.5px;\n  bottom: 6.5px;\n  width: 9px;\n  height: 19px;\n  border: solid white;\n  border-width: 0 4px 4px 0;\n  -webkit-transform: rotate(0deg);\n  -ms-transform: rotate(0deg);\n  transform: rotate(45deg); }\n\n#queryComponent {\n  position: relative;\n  width: fit-content;\n  top: -50px; }\n\n#querySetupTable {\n  margin-top: 70px;\n  margin-left: unset !important;\n  width: fit-content; }\n\n#interrogator {\n  position: relative; }\n\n#error {\n  position: absolute;\n  bottom: 80px;\n  left: 0px;\n  white-space: nowrap; }\n\n/* @import url(https://fonts.googleapis.com/csshFileWrapperss?family=Poiret+One|Varela+Round); */\n.mainContainer {\n  width: 65% !important;\n  margin-left: 0px;\n  min-width: 880px; }\n\n.toggle {\n  text-decoration: none;\n  font-size: 2em;\n  color: white;\n  position: fixed;\n  left: 20px;\n  z-index: 1;\n  cursor: pointer;\n  height: 0px !important; }\n\n#slide:checked + .container .toggle {\n  left: 97.5%;\n  position: relative; }\n\n#slide:checked + .container .sidebar {\n  left: 0px; }\n\n#slide:checked + .container .sidebar #tabs {\n  margin-top: -23px !important; }\n\n#slide {\n  display: none; }\n\n.sidebar {\n  position: fixed;\n  top: 0px;\n  bottom: 0px;\n  left: -4250px;\n  -webkit-transition: 0.5s;\n  -moz-transition: 0.5s;\n  transition: 0.5s;\n  width: auto;\n  padding: 1.5em;\n  /* background: rgba(0,0,0,0.1);\nborder-right: solid 1px rgb(0,0,0); */\n  overflow-y: hidden;\n  height: auto; }\n\n#connectorContainer .h7 {\n  font-size: 16px;\n  padding-top: 2%;\n  color: #d6d6df; }\n\n.sshWrapper {\n  display: flex; }\n\n#sshCol {\n  min-width: fit-content;\n  display: inline-flex;\n  max-height: 28px; }\n\n#sshCol .buttonIcon {\n  margin-right: 6px;\n  padding-left: 5px;\n  padding-top: 2px;\n  width: 28px !important;\n  min-width: 28px !important;\n  height: 28px; }\n\n#sshCol .sshFilePath span {\n  position: absolute;\n  margin-left: 3.5px;\n  margin-top: 3px; }\n\n#sshCol .sshDetails {\n  position: relative;\n  margin-left: 5px; }\n\n#sshCol .sshDetails .h9 {\n  margin-left: 3px;\n  margin-bottom: 5px !important;\n  margin-top: 2px !important; }\n\n#sshPath {\n  position: relative; }\n\n#connectorContainer .h7 span {\n  font-style: italic; }\n\n#sshFileWrapper {\n  position: relative;\n  top: 0px;\n  margin-left: 0px !important;\n  margin-bottom: 0px !important;\n  max-height: 28px !important; }\n\n#sshFileWrapper .uploaded {\n  margin-bottom: 0px !important;\n  margin-top: 2px; }\n\n.deleteSshFileWrapper {\n  position: relative;\n  left: -6px;\n  top: -8px; }\n\n.deleteSshFileWrapper .deleteSSHIcon {\n  color: #ff4c4c;\n  cursor: pointer; }\n\n.noFileUploaded .h7 {\n  color: #ff4c4c !important;\n  font-size: 14px !important;\n  margin-top: 7px;\n  margin-left: 5px; }\n\n.removeEvents {\n  z-index: 100;\n  pointer-events: none; }\n\n@media (max-width: 768px) {\n  #slide:checked + .container .toggle {\n    left: 94% !important;\n    position: relative; }\n  .sidebar {\n    position: fixed;\n    margin-right: 10%;\n    margin-top: -10px;\n    /* width:95%; */\n    width: 98vw;\n    overflow-x: hidden;\n    overflow-y: scroll; }\n  #slide:checked + .container .toggle {\n    left: 50%;\n    position: relative; }\n  .tab {\n    position: absolute !important;\n    /* width: 94%; */ }\n  .connectorRow {\n    padding-bottom: 2.5%; }\n  .featureContainer {\n    max-width: 100% !important;\n    width: 100% !important;\n    padding-left: 10px; }\n  #connectorContainer .h7 span {\n    display: block;\n    padding-top: 4%;\n    padding-bottom: 3%; }\n  #connectorContainer .h7 {\n    display: block;\n    padding-top: 1.5%;\n    padding-bottom: 2%;\n    font-size: 15px;\n    margin-bottom: 2%;\n    padding-top: 1%; }\n  .toggleLabel {\n    padding-top: 5px !important; } }\n\n@media (max-width: 668px) {\n  #slide:checked + .container .toggle {\n    left: 92% !important;\n    position: relative; } }\n\n@media (max-width: 576px) {\n  /* #slide:checked + .container .toggle {\n        left: 90% !important;\n    } */\n  .connectorRow {\n    padding-bottom: 2.5%; }\n  #connectorContainer .h7 {\n    padding-top: 1%;\n    padding-bottom: 2%; } }\n\n@media (max-width: 320px) {\n  .tab {\n    width: 92%; } }\n\n#toggleContainer {\n  width: 100%; }\n\n.toggleLabel {\n  top: 3px !important;\n  position: relative; }\n\n.featureContainer {\n  background-color: #3B3E45 !important;\n  border: solid 1px #909090;\n  border-radius: 5px;\n  padding: 2px;\n  /* position: relative; */\n  top: 40px;\n  max-width: 80%;\n  width: 80%;\n  display: -webkit-inline-box;\n  display: -moz-inline-box;\n  display: -ms-inline-flexbox;\n  display: block;\n  padding-left: 10px; }\n\n#connectorTable {\n  display: block; }\n\n#connectorForm {\n  position: relative;\n  top: -30px; }\n\n.connectorRow {\n  padding-bottom: 1.5%; }\n\n.connectorTitle {\n  position: relative;\n  top: -36px;\n  left: -7px;\n  display: inline-block; }\n\n.buttonContainer {\n  padding-right: 5px; }\n\n.buttonContainer label {\n  display: inline; }\n\n.buttonIcon {\n  border: solid 1px #909090;\n  border-radius: 10px;\n  padding: 5px;\n  background-color: rgba(255, 255, 255, 0.1);\n  cursor: pointer;\n  position: relative;\n  min-width: 30px; }\n\n.buttonIcon:hover {\n  background-color: rgba(255, 255, 255, 0.2) !important;\n  color: rgba(255, 255, 255, 0.2) !important; }\n\n.buttonIcon:active {\n  background-color: rgba(0, 0, 0, 0.1); }\n\n.toolListItem {\n  margin: 10px 0; }\n\n.toolIcon {\n  font-size: 250% !important;\n  max-width: 35px; }\n\n.uploaded {\n  margin-top: 5px;\n  margin-bottom: 10px; }\n\n.fileDetails {\n  position: relative;\n  top: -30px; }\n\n/* .uploadedFilesContainerIndicatorWrapper{\n    position: relative;\n    display:block !important;\n    padding-left: 95%;\n    top: 10px;\n}\n\n.QueryfileIcon{\n    color: green;\n    text-shadow: none;\n    position: relative;\n    display: block;\n    opacity: 1.0 !important;\n    top: -100px;\n    left: 100%;\n} */\n.uploadedFilesContainer {\n  border-style: dashed;\n  border-width: 2px;\n  border-radius: 5px;\n  border-color: #909090;\n  background-color: rgba(255, 255, 255, 0.07);\n  padding: 0px;\n  margin-left: 5%;\n  margin-bottom: 10px;\n  top: 10px;\n  position: relative;\n  width: fit-content;\n  max-height: 95px; }\n\n.toolIndicatorStatus {\n  display: none; }\n\n/* .outerWrapper{\n    width: 99%;\n}*/\n#fileList {\n  padding-left: 10px;\n  padding-right: 10px;\n  padding-right: 10px;\n  padding-top: -10px !important; }\n\n.appContent {\n  margin-top: 20px; }\n\n.stage {\n  background-color: #3B3E45 !important;\n  border: solid 1px #1d1d24;\n  border-radius: 5px;\n  padding: 2px;\n  /* max-width: 80%; */\n  width: fit-content;\n  min-width: auto;\n  margin-top: 50px; }\n\n.formLineRow_col {\n  max-height: 29px;\n  height: 29px;\n  min-height: 29px; }\n\n.formLineRow_col .row {\n  max-height: 29px;\n  height: 29px;\n  min-height: 29px; }\n\n.stageWrapper::before {\n  position: relative;\n  content: \" \"; }\n\n.stageWrapper {\n  position: relative;\n  width: fit-content;\n  max-width: fit-content; }\n\n.stageBadgeWrapper {\n  position: absolute;\n  height: 0px !important;\n  max-height: 0px;\n  display: inline-block;\n  width: 100%; }\n\n.stageIcon {\n  color: #d6d6df;\n  text-shadow: none;\n  position: relative;\n  top: -30px;\n  right: 0.8%;\n  /* z-index: 99; */\n  float: right; }\n\n.stageTitle {\n  display: inline-block;\n  position: relative;\n  top: -30px;\n  left: 40px;\n  z-index: 1;\n  margin-left: 5px; }\n\n@media (max-width: 668px) {\n  .stageTitle {\n    margin-left: 15px; } }\n\n.pipelineStage {\n  position: absolute;\n  width: -webkit-fit-content;\n  width: -moz-fit-content;\n  width: fit-content;\n  left: 15%;\n  top: -44px;\n  margin-top: 20px;\n  margin-left: 0px;\n  background-color: rgba(82, 84, 91, 0.7) !important; }\n\n.pipelineStage p {\n  position: relative;\n  line-height: 1;\n  margin: 0px;\n  top: 5px !important; }\n\n@media (max-width: 668px) {\n  .pipelineStage {\n    left: 22%; } }\n\n.titleContainer {\n  padding-left: 0px;\n  max-width: fit-content; }\n\n.inputContainer {\n  padding-left: 0px; }\n\n.roundBorder {\n  border-radius: 10px;\n  background-color: rgba(255, 255, 255, 0.1);\n  border: solid 1px #797979;\n  padding: 0.7%; }\n\n.formLineRow .h7 {\n  font-size: 14px; }\n\n/********* FORM-LINE COlUMNS**********/\n.FormLineTable {\n  border-spacing: 0px;\n  border-collapse: separate;\n  padding-right: 7px;\n  padding-top: 11px; }\n\n.formLineHeader {\n  /* line-height: 1.5em; */\n  padding: 10px 0px 5px 0px;\n  /* width: 100%; */\n  position: relative;\n  margin: 0px !important; }\n\n.formLineRow {\n  padding-right: 10px !important;\n  padding-left: 5px !important;\n  padding-top: 11px !important;\n  padding-bottom: 8.5px !important;\n  padding: 3px 0px;\n  position: relative;\n  margin: 0px !important; }\n\n.formLineRow .inputText {\n  /* width: 240px; */\n  min-width: auto;\n  max-width: auto; }\n\n.formLineRow td {\n  border-bottom-width: 3px;\n  padding-left: 2px;\n  padding-right: 2px; }\n\n.formLineRow td:first-child {\n  padding-left: 10px !important; }\n\n.formLineRow td:last-child {\n  padding-right: 10px !important; }\n\ntr.formLineRow:first-child td:first-child {\n  border-top-left-radius: 5px;\n  border-bottom-left-radius: 5px; }\n\ntr.formLineRow:first-child td:last-child {\n  border-top-right-radius: 5px;\n  border-bottom-right-radius: 5px; }\n\n.secondHalf {\n  padding-left: 0px; }\n\n.formLineRow.oddRow {\n  background-color: #313441; }\n\n.formLineRow.evenRow {\n  background-color: #52545B; }\n\n.activeCol {\n  width: 30px;\n  padding: 0px 10px; }\n\n.keyCol, .valueCol {\n  min-width: 270px;\n  width: fit-content !important; }\n\n@media (max-width: 400px) {\n  .tab {\n    overflow-x: scroll; } }\n\n@media (max-width: 668px) {\n  .activeCol {\n    width: 20px; }\n  /* .formLineHeader .operatorCol{\n        padding-left: -10px;\n    } */\n  .formLineRow .inputSelect {\n    max-width: 65px !important;\n    font-size: 12.9px;\n    padding: 0px 6px; }\n  .valueCol {\n    padding-right: 0px;\n    padding-left: 0px;\n    margin-left: 33px; }\n  .vTypeSynLeftCol {\n    padding-right: 3px !important;\n    padding-left: 10px !important; }\n  .keyCol, .valueCol {\n    width: 100px !important; }\n  .keyCol .inputText, .valueCol .inputText {\n    width: 130px !important;\n    margin-top: 2px; }\n  .typeCol {\n    padding-left: 0px;\n    padding-right: 0px; }\n  .addLineCol {\n    max-width: 30px;\n    /* padding-left: 0px; */ } }\n\n@media (max-width: 768px) {\n  .FormLineTable {\n    padding-left: 20px;\n    position: relative; }\n  .formLineHeader .h7 {\n    font-size: 14px; }\n  .formLineRow .inputText {\n    width: 100%;\n    max-width: 210px;\n    font-size: 14px; }\n  .formLineRow .inputText::placeholder {\n    /* Chrome, Firefox, Opera, Safari 10.1+ */\n    font-size: 12.9px;\n    /* Firefox */ }\n  .formLineRow .inputSelect {\n    max-width: 75px;\n    font-size: 12.9px;\n    padding: 0px 6px; }\n  .valueCol {\n    padding-right: 0px;\n    padding-left: 0px; }\n  .vTypeSynLeftCol {\n    padding-right: 3px !important;\n    padding-left: 35px; }\n  .keyCol, .valueCol {\n    width: fit-content !important;\n    max-width: 200px !important;\n    max-width: 150px;\n    min-width: 150px;\n    width: fit-content !important; }\n  .keyCol .inputText, .valueCol .inputText {\n    width: 100%;\n    margin-top: 2px; }\n  .typeCol {\n    padding-left: 0px;\n    padding-right: 0px; }\n  .addLineCol {\n    max-width: 30px;\n    /* padding-left: 0px; */ } }\n\n@media (max-width: 668px) {\n  .FormLineTable {\n    padding-left: 2px;\n    position: relative; } }\n\n.operatorCol {\n  width: auto;\n  padding-left: 1px;\n  padding-right: 1px; }\n\n.vTypeSynLeftCol {\n  /* max-width: 70px; */\n  padding-top: 7px;\n  /* padding-left: 25px; */\n  padding-right: 0px;\n  /* padding-right: 5px !important; */\n  width: fit-content !important; }\n\n.valueCol {\n  padding: 0px;\n  padding-left: 1px !important; }\n\n.vTypeSynRightCol {\n  max-width: 20px;\n  padding-top: 7px;\n  padding-left: 1px !important; }\n\n.addLineCol {\n  width: fit-content;\n  max-width: 100px; }\n\n.typeCol {\n  max-width: 130px; }\n\n.formLineRow .inputText {\n  width: 100%; }\n\n.webkit-box {\n  display: -webkit-box; }\n\n.selectcollectionWrapper {\n  max-width: fit-content; }\n\n.cursorIcon {\n  z-index: 99; }\n\n#tabs {\n  min-width: 905px;\n  margin-top: 1%;\n  margin-bottom: 2%;\n  border-radius: 3px;\n  height: 100%; }\n\n#tabs .tab {\n  background: rgba(52, 52, 68, 0.8);\n  height: calc(100% - 60px);\n  overflow-y: auto;\n  display: none;\n  padding: 12px;\n  color: rgba(0, 0, 0, 0);\n  border: solid 1px #909090;\n  border-radius: 5px;\n  position: relative;\n  min-width: 975px;\n  /* max-width: 80%; */ }\n\n#tabs input[type=\"radio\"] {\n  display: none; }\n\n#tabs > label {\n  background: #cacaca;\n  display: inline-block;\n  margin-right: 2px;\n  margin-bottom: 3px !important;\n  border-radius: 3px;\n  max-height: 54px !important;\n  padding: 14px 20px !important;\n  font-family: Arial;\n  font-size: 95%;\n  font-weight: 700;\n  color: #777;\n  cursor: pointer;\n  text-shadow: 1px 1px #fff;\n  transition: background .3s;\n  -webkit-transition: background .3s; }\n\n.connectIndicator {\n  color: green;\n  text-shadow: none;\n  position: relative;\n  top: -5px;\n  left: -5px;\n  display: inline-block; }\n\n.zeroVisibility {\n  visibility: hidden; }\n\n.fullVisibility {\n  visibility: visible; }\n\n.connectIndicatorWrapper {\n  height: 0px !important;\n  max-height: 0px; }\n\n.tdAlignRight {\n  text-align: right; }\n\n#connectorContainer {\n  position: relative; }\n\n.connectToggleContainer {\n  position: relative;\n  width: 80%;\n  left: 10%;\n  margin-top: 20px;\n  border-radius: 10px;\n  background-color: rgba(255, 255, 255, 0.1);\n  border: solid 1px #d9d9d9;\n  padding: 3%; }\n\n.connectorMessageContainer {\n  position: relative;\n  padding: 10px;\n  text-align: center;\n  max-width: 600px; }\n\n.connectToggleContainer td {\n  padding: 10px;\n  width: 50%; }\n\n.toogleRow {\n  padding-bottom: 0% !important; }\n\n.messageWrap {\n  margin-top: 5% !important;\n  padding-bottom: 0% !important; }\n\n#tabs label:hover {\n  background: #d9d9d9;\n  color: #909090; }\n\n#tabs #toggle-tab1:checked ~ label[for=\"toggle-tab1\"],\n#toggle-tab2:checked ~ label[for=\"toggle-tab2\"],\n#toggle-shareTab:checked ~ label[for=\"toggle-shareTab\"],\n#toggle-tab3:checked ~ label[for=\"toggle-tab3\"],\n#toggle-tab4:checked ~ label[for=\"toggle-tab4\"] {\n  background: #e9e9e9;\n  margin-bottom: 0;\n  border-bottom-left-radius: 0;\n  border-bottom-right-radius: 0;\n  padding-bottom: 18px;\n  color: #606060;\n  cursor: default; }\n\n#tabs #toggle-tab1:checked ~ #tab1,\n#toggle-tab2:checked ~ #queryTab,\n#toggle-shareTab:checked ~ #shareTab,\n#toggle-tab3:checked ~ #tab3,\n#toggle-tab4:checked ~ #tab4 {\n  display: block; }\n\n.connected {\n  color: green; }\n\n#ReCreateLogoTools {\n  position: absolute;\n  width: 7%;\n  max-width: 65px;\n  min-width: 35px;\n  bottom: 10px;\n  left: 10px; }\n\n/* The switch - the box around the slider */\n.switch, .switch:hover, .switch:active, .switch:focus {\n  position: relative;\n  display: inline-block;\n  width: 70px;\n  height: 18px;\n  background-color: rgba(0, 0, 0, 0) !important;\n  top: 2px;\n  margin-bottom: 0px !important; }\n\n/* Hide default HTML checkbox */\n.switch input {\n  display: none; }\n\n/* The slider */\n.slider, .slider:hover, .slider:active, .slider:focus {\n  position: absolute;\n  cursor: pointer;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background-color: #aaa;\n  -webkit-transition: .2s;\n  -moz-transition: .2s;\n  transition: .2s; }\n\n.slider:before {\n  position: absolute;\n  content: \"\";\n  height: 26px;\n  width: 26px;\n  left: 4px;\n  bottom: -4px;\n  background-color: white;\n  -webkit-transition: .2s;\n  -moz-transition: .2s;\n  transition: .2s;\n  /* border: solid 1px #1D1F23; */ }\n\ninput:checked + .slider {\n  background-color: #8354EC; }\n\ninput:focus + .slider {\n  box-shadow: 0 0 1px #8354EC; }\n\ninput:checked + .slider:before {\n  -webkit-transform: translateX(36px);\n  -ms-transform: translateX(36px);\n  transform: translateX(36px); }\n\n/* Rounded sliders */\n.slider.round {\n  border-radius: 34px; }\n\n.slider.round:before {\n  border-radius: 50%; }\n\n#loginiFrame.loggedInFrame {\n  width: 350px !important;\n  margin-left: calc(-1 * 350px / 2) !important; }\n\n#loggedInGrid {\n  text-align: center;\n  position: relative;\n  width: auto; }\n\n#loggedInGrid .greenText {\n  color: green; }\n\n#loggedInGrid ul {\n  padding-left: 0px !important; }\n\n#loggedInGrid .loginBottomButtons {\n  margin-top: 10px;\n  display: flex;\n  flex-direction: row;\n  justify-content: center; }\n\n#rightSlideOut_toggle {\n  position: absolute;\n  left: -50px;\n  width: 50px;\n  background: rgba(131, 84, 236, 0.5);\n  min-height: 70px;\n  max-width: 50px;\n  border-top-left-radius: 110px;\n  border-bottom-left-radius: 110px;\n  text-align: center;\n  padding-top: 7px;\n  padding-left: 3px;\n  top: 10px; }\n\n#rightSlideOut {\n  position: fixed;\n  background: #999;\n  border-bottom-left-radius: 40px;\n  height: 500px;\n  min-height: 500px;\n  top: 0px;\n  width: 80px;\n  right: -80px;\n  transition: right 0.2s ease-in-out;\n  padding-bottom: 25px; }\n\n#rightSlideOut::selection {\n  background: transparent !important; }\n\n#rightSlideOut_inner {\n  padding: 10px; }\n\n#rightSlideOut:hover {\n  right: 0px !important; }\n\n#rightSlideOut:hover #rightSlideOut_toggle {\n  background: #8354EC; }\n\n.loggedInImage {\n  width: 230px; }\n\n#rightSlideOut_inner {\n  padding: 7px;\n  text-align: center; }\n\n#rightSlideOut_inner .toolContainer {\n  margin-top: 10px;\n  border: solid 1px #777;\n  border-radius: 7px;\n  padding: 5px;\n  background: #bbb; }\n\n#rightSlideOut_inner hr.slideSeparator {\n  border-top: 1px solid #777 !important;\n  margin-bottom: 5px;\n  margin-top: 10px; }\n\n#rightSlideOut_inner hr.slideSeparator:after {\n  content: '\\2665';\n  display: inline-block;\n  position: relative;\n  top: -15px;\n  padding: 0 10px;\n  background: grey;\n  color: #8c8b8b;\n  font-size: 18px;\n  width: 50px; }\n\n#rightSlideOut_inner .slideOutDescriptionContainer {\n  text-align: center; }\n\n#rightSlideOut_inner .slideOutDescriptionContainer p.slideOutDescription {\n  color: #555;\n  font-style: italic;\n  white-space: nowrap; }\n\n#rightSlideOut_inner .fontSize {\n  font-size: 16px;\n  text-shadow: 2px 0 grey, 0 2px grey, 0px 0 grey, 0 0px grey;\n  margin-bottom: 2px !important;\n  top: 2px;\n  position: relative; }\n\n#rightSlideOut_inner ul#quickToolsList {\n  list-style: none;\n  padding-left: 0px;\n  margin-top: 15px; }\n\n#rightSlideOut_inner ul#quickToolsList li {\n  margin-top: 10px; }\n\n#rightSlideOut_inner .inactiveButtonIcon {\n  color: grey;\n  pointer-events: none;\n  cursor: no-drop !important;\n  text-shadow: 0px 0px; }\n\n.imageButton {\n  height: 25px; }\n\n.imageButton.activeImg {\n  cursor: pointer; }\n\n.imageButton.inactiveImg {\n  cursor: normal; }\n\n.fontButton {\n  border-radius: 100%;\n  width: 30px !important;\n  min-width: 30px !important;\n  height: 30px !important;\n  cursor: pointer;\n  margin-left: 12px;\n  margin-bottom: 5px;\n  font-size: 26px;\n  font-weight: 900;\n  color: #333;\n  text-shadow: -1px 0 #8354EC, 0 1px #8354EC, 1px 0 #8354EC, 0 -1px #8354EC; }\n\n.iconButton {\n  cursor: pointer;\n  text-shadow: -1px 0 #8354EC, 0 1px #8354EC, 1px 0 #8354EC, 0 -1px #8354EC; }\n\n.borderlessButton {\n  cursor: pointer;\n  border: solid 3px #333;\n  border-radius: 100%;\n  padding-right: 3.5px;\n  padding-top: 8px;\n  width: 67px;\n  height: 67px; }\n\n.borderlessButton .iconButton {\n  width: 50px;\n  text-shadow: grey 2px 2px; }\n\n.borderlessButton .iconButton:active, .borderlessButton .iconButton:focus {\n  text-shadow: #555 2px 2px;\n  color: #777; }\n\n.borderlessButton:hover {\n  background-color: rgba(0, 0, 0, 0.1); }\n\n.borderlessButton.loggedInBorder {\n  padding-left: 1px;\n  background-color: rgba(3, 242, 63, 0.15); }\n\n.borderlessButton.loggedInBorder .iconButton {\n  color: #015a01;\n  text-shadow: #7b8877 2px 2px;\n  top: -2px;\n  position: relative; }\n\n.borderlessButton.loggedInBorder .iconButton:active, .borderlessButton.loggedInBorder .iconButton:focus {\n  text-shadow: #555 2px 2px;\n  color: #466846; }\n\nul#userPanel {\n  list-style: none;\n  padding-left: 0px;\n  top: -2px;\n  position: relative; }\n\nul#userPanel #nicknameWrapper {\n  margin-top: 11px; }\n\nul#userPanel #nicknameWrapper p {\n  color: #396f8e;\n  word-break: break-all;\n  line-height: 0.7em;\n  font-weight: 900 !important; }\n\n#saveResults {\n  margin-left: 6px; }\n\n#iframeBackdrop {\n  position: absolute;\n  width: 100% !important;\n  height: 100% !important;\n  top: 0px;\n  left: 0px;\n  z-index: 9;\n  background-color: rgba(0, 0, 0, 0.4); }\n\n#loginiFrame {\n  width: 650px;\n  height: 400px;\n  background-color: #30303d;\n  position: fixed;\n  z-index: 10;\n  top: 50%;\n  left: 50%;\n  margin-top: calc(-1 * 400px / 2);\n  margin-left: calc(-1 * 650px / 2);\n  border: solid 1px #3b5c4c;\n  border-radius: 20px;\n  box-shadow: 0px 0px 90px #434e43; }\n\n#loginiFrame input {\n  font-size: 16px; }\n\n#loginiFrame #closeOverlayButton {\n  position: absolute;\n  left: calc(100% - 11px);\n  top: -11px;\n  cursor: pointer; }\n\n#loginiFrame #loginIFrameGrid {\n  width: 100%; }\n\n#loginiFrame .iframeColHeader {\n  top: -10px;\n  position: relative; }\n\n#loginiFrame .iframeCol {\n  margin-top: 15px;\n  text-align: center; }\n\n#loginiFrame #loginCol {\n  padding-left: 0px; }\n\n#loginiFrame #registerCol {\n  border-left: solid 1px #3b5c4c;\n  padding-left: 3px; }\n\n#loginiFrame p strong {\n  color: #8354EC; }\n\n#loginiFrame ul {\n  list-style: none;\n  padding-left: 20px; }\n\n#loginiFrame ul .iframeFiledImgWrap {\n  display: flex; }\n\n#loginiFrame ul li.firstLoginField {\n  padding-top: 20px !important; }\n\n#loginiFrame ul li.loginList {\n  padding-top: 30px; }\n\n#loginiFrame ul li.loginList .loginFields {\n  height: 45px;\n  width: 230px;\n  border-radius: 12px; }\n\n#loginiFrame ul li.registerList {\n  padding-top: 15px; }\n\n#loginiFrame ul li.registerList .registerFields {\n  height: 30px;\n  width: 230px; }\n\n#loginiFrame ul li.validationMessage {\n  height: 10px;\n  min-height: 10px;\n  text-align: left;\n  position: relative;\n  top: 10px;\n  padding-left: 55px; }\n\n#loginiFrame ul li.validationMessage.registerMessage {\n  padding-left: 42px !important; }\n\n#loginiFrame ul li.validationMessage p {\n  color: red;\n  font-size: 12px;\n  margin: 0px; }\n\n#loginiFrame ul li.listSpacer .messageSpacer {\n  height: 10px; }\n\n#loginiFrame ul li.forgotPasswordList {\n  text-align: right; }\n\n#loginiFrame ul li.forgotPasswordList p {\n  color: #c7c7c7;\n  font-size: 11px;\n  margin-top: 0px; }\n\n#loginiFrame ul li.termsAndConditionsList p {\n  color: #c7c7c7;\n  font-size: 11px;\n  margin-top: 14px; }\n\n#loginiFrame ul a {\n  text-decoration: underline; }\n\n#loginiFrame .registerButtonSpacer {\n  margin-top: 5px; }\n\n#loginiFrame .iconWrap {\n  min-width: 40px; }\n\n#loginiFrame .registerFieldImg {\n  color: #d6d6df; }\n\n#loginiFrame .closeOverlayImg {\n  color: #c7c7c7; }\n\n#loginiFrame .monkeyLogin {\n  vertical-align: middle;\n  height: 43px;\n  padding-top: 4px;\n  margin-right: 5px; }\n\n#loginiFrame .bananaLogin {\n  vertical-align: middle;\n  height: 57px;\n  margin-right: 5px;\n  position: relative;\n  top: -8px; }\n\n.__react_component_tooltip.type-success {\n  background-color: #089e83 !important; }\n\n.__react_component_tooltip.type-success.place-right:after {\n  border-right-color: #089e83 !important; }\n\n.__react_component_tooltip.type-success.place-left:after {\n  border-left-color: #089e83 !important; }\n\n.__react_component_tooltip.type-success.place-top:after {\n  border-top-color: #089e83 !important; }\n\n.__react_component_tooltip.type-success.place-bottom:after {\n  border-bottom-color: #089e83 !important; }\n\n#querybox_placeholder {\n  height: 15%;\n  position: relative;\n  max-height: 60px;\n  /* background-color: green; */ }\n\n#queryTabBottomWrapper {\n  display: flex;\n  flex-direction: row;\n  justify-content: flex-start; }\n\n#queryBottomSpacer {\n  height: 80px; }\n\n#bottomWrapper {\n  position: fixed;\n  margin-top: 20px !important;\n  z-index: 99;\n  bottom: 27px !important;\n  height: 70px;\n  padding-left: 0px !important; }\n\n@media (max-width: 668px) {\n  #bottomWrapper {\n    width: 85%;\n    margin-bottom: 1px !important; }\n  #querySetupTable {\n    margin-top: 10% !important; } }\n\n#interrogator {\n  position: sticky;\n  position: RELATIVE;\n  left: 10px;\n  order: 1; }\n\n.querybox {\n  position: RELATIVE;\n  background-color: #eaf5f7;\n  border: solid 1px #c000ff;\n  border-radius: 5px;\n  max-width: 895px;\n  padding: 5px;\n  min-height: 70px;\n  /* width: 100%; */\n  height: 50px !important;\n  max-height: 50px;\n  overflow-y: auto;\n  left: 0px !important;\n  width: calc(100% - 50px);\n  bottom: 0px !important;\n  order: 0; }\n\n.querybox::-webkit-scrollbar {\n  -webkit-appearance: none;\n  width: 7px; }\n\n.querybox::-webkit-scrollbar-thumb {\n  border-radius: 4px;\n  background-color: #396f8e;\n  box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);\n  -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, 0.5); }\n\n.submitButton {\n  cursor: pointer;\n  border-radius: 6px;\n  border: solid 1px #b4faff;\n  /* border: 0px !important; */\n  padding: 3px;\n  height: 70px;\n  width: 44px;\n  background: #c000ff; }\n\n.submitButton:active {\n  background: #C778FF; }\n\n.submitButton span {\n  text-shadow: unset !important;\n  color: #333 !important; }\n\n.submitButton:active span {\n  color: grey !important;\n  text-shadow: rgba(255, 255, 255, 0.7) 0px 1px 0px !important; }\n\n#chatContainer {\n  display: flex;\n  flex-direction: row; }\n\n#chatContainer #messagesAndUsers {\n  display: flex;\n  flex-direction: column; }\n\n#chatContainer #messagesAndUsers .receiver {\n  background-color: #30324A;\n  width: calc( 630px + 15px);\n  border-radius: 5px;\n  border-top-right-radius: 0px;\n  border-bottom-right-radius: 0px;\n  border-bottom-left-radius: 0px;\n  position: absolute;\n  height: 55px;\n  box-shadow: 0 5px 7px -6px #E7F1F5;\n  z-index: 100;\n  padding-top: 20px;\n  padding-left: 10px;\n  display: flex; }\n\n#chatContainer #messagesAndUsers .receiver .receiverTitle {\n  padding-left: 10px;\n  color: white;\n  font-size: 22px; }\n\n#chatContainer #messagesAndUsers .receiver .statusTitle {\n  position: relative;\n  left: 10px;\n  font-size: 16px;\n  top: 3px; }\n\n#chatContainer #messagesAndUsers #messageBox {\n  position: absolute;\n  width: calc( 630px + 15px);\n  height: calc( 100% - 82px);\n  background-color: #E7F1F5;\n  overflow-y: scroll;\n  overflow-x: hidden;\n  padding: 6px;\n  padding-top: 30px;\n  top: 67px;\n  border-bottom-left-radius: 5px; }\n\n#chatContainer #messagesAndUsers #messageBox .messageBottomSpacer {\n  height: 105px; }\n\n#chatContainer #messagesAndUsers #messageBox .messageContainer {\n  margin-top: 26px; }\n\n#chatContainer #messagesAndUsers #messageBox .messageContainer.sent {\n  text-align: right;\n  position: relative;\n  right: 0px; }\n\n#chatContainer #messagesAndUsers #messageBox .messageContainer.sent .message_bubble {\n  background-color: #6746b7;\n  box-shadow: -4px 4px 15px rgba(0, 0, 0, 0.4);\n  right: 15px;\n  display: inline-block;\n  text-align: left; }\n\n#chatContainer #messagesAndUsers #messageBox .messageContainer.sent .message_bubble .messageAttachments {\n  text-align: -webkit-right; }\n\n#chatContainer #messagesAndUsers #messageBox .messageContainer.sent .message_bubble .messageAttachments .attachmentFiles {\n  background-color: rgba(196, 206, 253, 0.92);\n  text-align: right;\n  border: solid 1px #fff; }\n\n#chatContainer #messagesAndUsers #messageBox .messageContainer.sent .message_bubble .messageAttachments .attachmentFiles:hover p {\n  color: #3100e0; }\n\n#chatContainer #messagesAndUsers #messageBox .messageContainer.sent .message_bubble .messageAttachments .attachmentFiles p {\n  color: #ce0095; }\n\n#chatContainer #messagesAndUsers #messageBox .messageContainer.sent .message_bubble::after {\n  content: ' ';\n  position: absolute;\n  border-left: 6px solid #6746b7;\n  border-right: 6px solid transparent;\n  border-top: 6px solid transparent;\n  border-bottom: 6px solid transparent;\n  bottom: 6px;\n  right: calc(6px * -2); }\n\n#chatContainer #messagesAndUsers #messageBox .messageContainer.sent .messageDate {\n  color: rgba(85, 85, 119, 0.7);\n  position: relative;\n  right: 11px; }\n\n#chatContainer #messagesAndUsers #messageBox .messageContainer.received {\n  text-align: left; }\n\n#chatContainer #messagesAndUsers #messageBox .messageContainer.received .message_bubble {\n  background-color: #bcd0cd;\n  box-shadow: 4px 4px 15px rgba(0, 0, 0, 0.4);\n  left: 15px; }\n\n#chatContainer #messagesAndUsers #messageBox .messageContainer.received .message_bubble .messageText {\n  color: #444;\n  font-style: normal; }\n\n#chatContainer #messagesAndUsers #messageBox .messageContainer.received .message_bubble .messageAttachments {\n  text-align: -webkit-left; }\n\n#chatContainer #messagesAndUsers #messageBox .messageContainer.received .message_bubble .messageAttachments .attachmentFiles {\n  background-color: rgba(255, 255, 255, 0.7);\n  text-align: left;\n  border: solid 1px #aaa; }\n\n#chatContainer #messagesAndUsers #messageBox .messageContainer.received .message_bubble .messageAttachments .attachmentFiles:hover p {\n  color: #ff6333; }\n\n#chatContainer #messagesAndUsers #messageBox .messageContainer.received .message_bubble .messageAttachments .attachmentFiles p {\n  color: #bd7500; }\n\n#chatContainer #messagesAndUsers #messageBox .messageContainer.received .message_bubble::after {\n  content: ' ';\n  position: absolute;\n  border-right: 6px solid #bcd0cd;\n  border-left: 6px solid transparent;\n  border-top: 6px solid transparent;\n  border-bottom: 6px solid transparent;\n  bottom: 6px;\n  left: calc(6px * -2); }\n\n#chatContainer #messagesAndUsers #messageBox .messageContainer.received .messageDate {\n  color: rgba(102, 102, 119, 0.7);\n  left: 11px; }\n\n#chatContainer #messagesAndUsers #messageBox .messageContainer .message_bubble {\n  background-color: #667;\n  border-radius: 6px;\n  width: fit-content;\n  max-width: 400px;\n  padding: 4px;\n  position: relative; }\n\n#chatContainer #messagesAndUsers #messageBox .messageContainer .message_bubble .message {\n  right: 0px;\n  position: absolute; }\n\n#chatContainer #messagesAndUsers #messageBox .messageContainer .message_bubble .messageText {\n  font-size: 14px;\n  line-height: 1.3em;\n  padding-top: 5px;\n  padding-left: 5px;\n  padding-right: 5px;\n  letter-spacing: .2px; }\n\n#chatContainer #messagesAndUsers #messageBox .messageContainer .message_bubble .attachmentIconWrapper {\n  position: relative;\n  height: 0px; }\n\n#chatContainer #messagesAndUsers #messageBox .messageContainer .message_bubble .attachmentIconWrapper .attachmentIconFrame {\n  cursor: pointer;\n  border: solid 1px #bbb;\n  border-radius: 6px;\n  background-color: grey;\n  padding: 3px;\n  width: fit-content;\n  top: -29px;\n  left: 100%;\n  position: relative; }\n\n#chatContainer #messagesAndUsers #messageBox .messageContainer .message_bubble .attachmentIconWrapper .attachmentIconFrame:hover {\n  background-color: #787878;\n  box-shadow: 0px 0px 10px white; }\n\n#chatContainer #messagesAndUsers #messageBox .messageContainer .message_bubble .attachmentIconWrapper .attachmentIconFrame .attachmentIcon {\n  color: #eee; }\n\n#chatContainer #messagesAndUsers #messageBox .messageContainer .message_bubble .attachmentIconWrapper .attachmentIconFrame .attachmentIcon:hover {\n  color: white; }\n\n#chatContainer #messagesAndUsers #messageBox .messageContainer .message_bubble .attachmentFiles {\n  cursor: pointer;\n  width: fit-content;\n  padding: 15px 10px 0px 10px;\n  border-radius: 4px !important;\n  border-width: 2px !important;\n  border-style: dashed !important;\n  margin-top: 23px; }\n\n#chatContainer #messagesAndUsers #messageBox .messageContainer .message_bubble .attachmentFiles:hover {\n  box-shadow: 0px 0px 2px 2px rgba(255, 255, 255, 0.5); }\n\n#chatContainer #messagesAndUsers #messageBox .messageContainer .message_bubble .attachmentFiles p {\n  line-height: 1em;\n  word-break: break-word; }\n\n#chatContainer #messagesAndUsers #messageBox .messageContainer .message_bubble .attachmentFiles p.title {\n  font-weight: 800 !important;\n  font-style: normal; }\n\n#chatContainer #messagesAndUsers #messageBox .messageContainer .message_bubble .attachmentFiles p strong {\n  text-shadow: -0.3px -0.3px 0 #555, 0.3px -0.3px 0 #555, -0.3px 0.3px 0 #555, 0.3px 0.3px 0 #555; }\n\n#chatContainer #messagesAndUsers #messageBox .messageContainer .messageDate {\n  font-size: 11px;\n  font-weight: bold;\n  font-style: normal;\n  top: 10px;\n  position: relative; }\n\n#chatContainer #usersBox {\n  position: absolute;\n  left: calc( 630px + 27px);\n  width: 307px;\n  height: calc(100% - 27px);\n  background-color: rgba(48, 49, 78, 0.851);\n  border-top-right-radius: 5px;\n  border-bottom-right-radius: 5px; }\n\n#chatContainer #usersBox ul {\n  padding-left: 0px;\n  position: relative;\n  top: 10px;\n  padding-right: 0px; }\n\n#chatContainer #usersBox ul li {\n  cursor: pointer; }\n\n#chatContainer #usersBox ul li.firstUser {\n  border-top: solid 1px #444; }\n\n#chatContainer #usersBox ul li.oddUser {\n  background-color: rgba(150, 150, 150, 0.25); }\n\n#chatContainer #usersBox ul li.evenUser {\n  background-color: rgba(206, 204, 204, 0.438); }\n\n#chatContainer #usersBox ul li .userContainer {\n  display: flex;\n  flex-direction: row;\n  border-bottom: solid 1px #444;\n  margin-top: 5px;\n  height: 40px;\n  padding: 0px 7px; }\n\n#chatContainer #usersBox ul li .userContainer .userTextWrap {\n  margin-left: 5px; }\n\n#chatContainer #usersBox ul li .userContainer .userTextWrap .nicknameText {\n  color: white; }\n\n#chatContainer #usersBox ul li:hover {\n  background-color: rgba(255, 255, 255, 0.5) !important; }\n\n#chatContainer #usersBox ul li:hover .userTextWrap .nicknameText {\n  color: #334; }\n\n#chatContainer #usersBox ul li.selectedUser {\n  background-color: blueviolet; }\n\n#chatContainer #usersBox ul li.selectedUser:active, #chatContainer #usersBox ul li.selectedUser:hover, #chatContainer #usersBox ul li.selectedUser:focus {\n  background-color: #c07dff !important; }\n\n#chatContainer .connectedCircle {\n  width: 10px;\n  height: 10px;\n  border-radius: 10px; }\n\n#chatContainer .connectedCircle.big {\n  width: 15px;\n  height: 15px;\n  position: relative;\n  bottom: 2px; }\n\n#chatContainer .connectedCircle.activeUser {\n  background-color: #13c300;\n  border: solid .5px #031b00; }\n\n#chatContainer .connectedCircle.inactiveUser {\n  background-color: darkgrey;\n  border: solid .5px #444; }\n\n#chatContainer .attachmentFile {\n  width: fit-content;\n  height: 30px;\n  z-index: 100;\n  left: 165px;\n  position: relative;\n  background-color: powderblue;\n  padding: 5px;\n  border-radius: 5px;\n  border: solid 1px #8c00ff;\n  top: -33px; }\n\n#chatContainer .attachmentFile .deleteAttachmentFileWrapper {\n  position: absolute;\n  left: -9px;\n  top: -14px; }\n\n#chatContainer .attachmentFile .deleteAttachmentFileWrapper .deleteAttachmentIcon {\n  color: #ff4040;\n  cursor: pointer; }\n\n#chatContainer .attachmentFile p {\n  color: #0d5a9c;\n  top: 5px;\n  position: relative; }\n\n#typeBox {\n  position: absolute;\n  bottom: 15px;\n  width: calc( 630px + 15px);\n  height: calc(70px + 8px * 3);\n  border-bottom-left-radius: 5px; }\n\n#typeBox .attachButton {\n  position: absolute;\n  cursor: pointer;\n  top: 8px;\n  left: 8px;\n  height: 70px !important;\n  min-width: 70px !important;\n  min-width: calc(70px / 2) !important;\n  border-left: solid 2px darkgray;\n  border-top: solid 2px darkgray;\n  border-bottom: solid 2px darkgray;\n  border-top-left-radius: 15px;\n  border-bottom-left-radius: 15px;\n  background-color: rgba(255, 255, 255, 0.86);\n  padding-left: 10px; }\n\n#typeBox .attachButton span {\n  text-shadow: rgba(0, 0, 0, 0.6) 0px 1px 0px !important;\n  color: #8e7eff; }\n\n#typeBox .attachButton span:hover {\n  color: #5c47ff; }\n\n#typeBox .sendButton {\n  width: 45px !important;\n  max-width: 45px !important;\n  min-width: 45px !important;\n  height: 70px;\n  left: calc( 100% - 55px);\n  top: 8px;\n  position: absolute;\n  background-color: rgba(255, 255, 255, 0.86);\n  border-bottom: solid 2px darkgray;\n  border-top: solid 2px darkgray;\n  border-right: solid 2px darkgray;\n  border-left: 0px;\n  border-top-left-radius: 0px;\n  border-bottom-left-radius: 0px;\n  border-top-right-radius: 15px;\n  border-bottom-right-radius: 15px; }\n\n#typeBox .sendButton span {\n  text-shadow: rgba(0, 0, 0, 0.6) 0px 1px 0px !important;\n  color: #36b536; }\n\n#typeBox .sendButton span:hover {\n  color: #24794a; }\n\n#typeBox #typeBoxInput {\n  position: absolute;\n  top: 0px;\n  left: calc((70px / 2));\n  margin: 8px !important;\n  width: calc(100% - 98px);\n  height: 70px !important;\n  color: #420b75;\n  padding: 5px;\n  border: transparent;\n  resize: none;\n  background-color: rgba(255, 255, 255, 0.86);\n  border: solid 2px darkgray;\n  border-right: 0px !important;\n  border-left: 0px !important; }\n\n#typeBox .attachIcon {\n  position: relative;\n  top: 22px;\n  left: -2px; }\n\n#typeBox .userTyping {\n  position: relative;\n  left: 10px;\n  top: -26px; }\n\n#typeBox .userTyping .typingText {\n  font-size: 14px;\n  font-style: italic;\n  color: #667;\n  letter-spacing: .5px; }\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/lib/css-base.js":
/*!*************************************************!*\
  !*** ./node_modules/css-loader/lib/css-base.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),

/***/ "./node_modules/style-loader/lib/addStyles.js":
/*!****************************************************!*\
  !*** ./node_modules/style-loader/lib/addStyles.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getTarget = function (target) {
  return document.querySelector(target);
};

var getElement = (function (fn) {
	var memo = {};

	return function(target) {
                // If passing function in options, then use it for resolve "head" element.
                // Useful for Shadow Root style i.e
                // {
                //   insertInto: function () { return document.querySelector("#foo").shadowRoot }
                // }
                if (typeof target === 'function') {
                        return target();
                }
                if (typeof memo[target] === "undefined") {
			var styleTarget = getTarget.call(this, target);
			// Special case to return head of iframe instead of iframe itself
			if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[target] = styleTarget;
		}
		return memo[target]
	};
})();

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(/*! ./urls */ "./node_modules/style-loader/lib/urls.js");

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
        if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),

/***/ "./node_modules/style-loader/lib/urls.js":
/*!***********************************************!*\
  !*** ./node_modules/style-loader/lib/urls.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),

/***/ "./src/css/App.css":
/*!*************************!*\
  !*** ./src/css/App.css ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../node_modules/css-loader!../../node_modules/sass-loader/lib/loader.js!./App.css */ "./node_modules/css-loader/index.js!./node_modules/sass-loader/lib/loader.js!./src/css/App.css");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(true) {
	module.hot.accept(/*! !../../node_modules/css-loader!../../node_modules/sass-loader/lib/loader.js!./App.css */ "./node_modules/css-loader/index.js!./node_modules/sass-loader/lib/loader.js!./src/css/App.css", function() {
		var newContent = __webpack_require__(/*! !../../node_modules/css-loader!../../node_modules/sass-loader/lib/loader.js!./App.css */ "./node_modules/css-loader/index.js!./node_modules/sass-loader/lib/loader.js!./src/css/App.css");

		if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ })

/******/ });
//# sourceMappingURL=css.js.map