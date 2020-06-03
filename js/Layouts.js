(function() {
    if (lightning.modules.layouts) {
        return;
    }
    var self = lightning.modules.layouts = {
        layouts: {},
        lastId: 0,
        colors: [
            "#cc9933",
            "#8899cc",
            "#99cc88"
        ],
        layoutContainerHTML: "",

        initEditor: function () {
            self.layouts = lightning.get("modules.layouts.editors");
            self.masterButtons = "<button class='button button-small add'>Add</button>" +
                "<button class='button button-small flip'>Flip</button>";
            self.layoutContainerHTML = "<div class='layout_container'>" +
                "<div class='drag-bar'></div> " +
                "<div class='content'></div>" +
                "<div class='controller'>" +
                self.masterButtons +
                "<button class='button button-small remove'>Remove</button>" +
                "<button class='button button-small contents'>Contents</button>" +
                "</div>" +
                "</div>";
            var editors = $(".layout_editor").each(function(){
                var id = $(this).attr("id");
                if (!self.layouts.hasOwnProperty(id)) {
                    self.layouts[id] = {};
                }
                self.layouts[id].id = id;
                self.build(id);
            });
            editors.on('click', '.button.add', self.addContainer);
            editors.on('click', '.button.remove', self.removeContainer);
            editors.on('click', '.button.contents', self.editContainerContents);
            editors.on('click', '.button.flip', self.flipContainer);
            editors.append(self.masterButtons);
        },

        /**
         * Build the containers into the master container.
         *
         * @param id
         */
        build: function(id) {
            var contentElement = $("<div class='content'>");
            self.layouts[id].containers = self.buildSub(contentElement, self.layouts[id].type, self.layouts[id].containers, 0);
            var editor = $("#"+id).empty().append(contentElement);
            self.resetSortable(editor);
        },

        resetSortable: function(editor) {
            editor.find(".container_type_horizontal").sortable({axis:"x", cursor: "move", update: self.updateOrder});
            editor.find(".container_type_vertical").sortable({axis:"y", cursor: "move", update: self.updateOrder});
        },

        updateOrder: function(event, ui) {
            console.log(event);
            console.log(ui);
            var item = $(ui.item[0]);
            var parent_id = item.parent().closest(".layout_container").prop("id").replace("layout_container_", "");
            var order = [];
            var layout_id = item.closest(".layout_editor").prop("id");
            item.parent().find(".layout_container").each(function(){
                order.push($(this).prop("id").replace("layout_container_", ""));
            });
            console.log('changing order from:');
            console.log(self.layouts);
            self.executeOnParent(self.layouts[layout_id], parent_id, self.setOrder, order)
            console.log('to:');
            console.log(self.layouts);
        },

        executeOnParent: function(container, parent_id, callback, ...params) {
            if (container.id == parent_id) {
                // If this is the correct container, execute the callback
                callback(container, ...params)
                return true;
            }
            // keep digging ...
            for (var i in container.containers) {
                // see if this has other containers to be sorted
                if (container.containers[i].type === "horizontal" || container.containers[i].type === "vertical") {
                    // if they were sorted, we can stop looking
                    if (self.executeOnParent(container.containers[i], parent_id, callback, params)) {
                        return true;
                    }
                }
            }
            return false;
        },

        /**
         * set the order of the child containers
         *
         * @param container
         * @param parent_id
         * @param order
         */
        setOrder: function(container, order) {
                var subContainers = container.containers;
                container.containers = [];
                for (var j in order) {
                    for (var k in subContainers) {
                        if (subContainers[k].id == order[j]) {
                            container.containers.push(subContainers[k]);
                            break;
                        }
                    }
                }
        },

        buildSub: function(containerElement, type, children, depth) {
            for (var i in children) {
                self.addChildElement(containerElement, children[i], type, depth);
            }

            return children;
        },
        addChildElement: function(containerElement, child, type, depth) {
            // make sure an ID exists
            child.id = self.getNewId();
            // add to the parent container
            containerElement.addClass("container_type_"+type);
            var childElement = $(self.layoutContainerHTML);
            childElement.prop("id", "layout_container_" + child["id"]);
            childElement.prop("style", "border-color: " + self.colors[depth%(self.colors.length)]);
            var content = childElement.find(".content");
            if (child.hasOwnProperty("containers")) {
                self.buildSub(content, child.type, child.containers, depth+1);
            }
            else if (child.hasOwnProperty("value")) {
                content.html(child.value);
            }
            containerElement.append(childElement);
        },

        getNewId: function () {
            return self.lastId++;
        },

        save: function(layout) {
            structure = JSON.stringify(self.layouts[layout]);
            $.ajax({
                url: "/api/layouts",
                data: {
                    "structure": structure,
                    "id": self.layouts[layout]["id"]
                },
            });
        },

        addContainerToLayout: function(container) {
            // self.buildSub(containers, self.layouts[id].type, self.layouts[id].containers, 0);
            var newChild = {
                type: 'content',
                value: '',
                id: self.getNewId()
            };
            container.containers.push(newChild);
            var containerElement = self.getLayoutContainer(container.id).children('.content');
            var depth = containerElement.parentsUntil('.layout_editor', '.content').length;
            self.addChildElement(containerElement, newChild, 'content', depth);
        },

        getLayoutContainer: function(id) {
            if (self.layouts.hasOwnProperty(id)) {
                return $('#' + id);
            } else {
                return $('#layout_container_' + id);
            }
        },

        addContainer: function(e) {
            var target = $(e.target);
            var parent_id = target.closest(".layout_container,.layout_editor").prop("id").replace("layout_container_", "");
            var layout_id = target.closest(".layout_editor").prop("id");
            self.executeOnParent(self.layouts[layout_id], parent_id, self.addContainerToLayout)
        },
        removeContainer: function(e) {
            console.log(e);
        },
        editContainerContents: function(e) {
            console.log(e);
        },
        /**
         * Change a container from horizontal to vertical or reverse
         * @param e
         */
        flipContainer: function(e) {
            var target = $(e.target);
            var parent_id = target.closest(".layout_container,.layout_editor").prop("id").replace("layout_container_", "");
            var layout_id = target.closest(".layout_editor").prop("id");
            self.executeOnParent(self.layouts[layout_id], parent_id, self.executeFlipContainer)
        },
        executeFlipContainer: function(container) {
            switch (container.type) {
                case 'horizontal':
                    container.type = 'vertical';
                    break;
                case 'vertical':
                    container.type = 'horizontal';
                    break;
            }
            var contentElement = self.getLayoutContainer(container.id).children('.content');
            contentElement.removeClass('container_type_horizontal').removeClass('container_type_vertical');
            contentElement.addClass('container_type_' + container.type);
            self.resetSortable(contentElement.closest('.layout_editor'));
        }
    };
}());
