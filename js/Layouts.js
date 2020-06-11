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
            var editors = $(".layout_editor")
                .addClass('layout_container')
                .each(function(){
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
            editors.on('click', '.button.save', self.save);
            editors.append(self.masterButtons + "<button class='button button-small save'>Save</button>");
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
            var item = $(ui.item[0]);
            var info = self.getContainerInfo(item);

            var order = [];
            // get the new order
            item.parent().find(".layout_container").each(function(){
                order.push($(this).prop("id").replace("layout_container_", ""));
            });
            console.log('changing order from:');
            console.log(self.layouts);
            // update the order internally
            self.setOrder(info.container, order)
            console.log('to:');
            console.log(self.layouts);
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

        save: function(e) {
            var target = $(e.target);
            var layout_id = target.closest(".layout_editor").prop("id");
            structure = JSON.stringify(self.layouts[layout_id]);
            var db_layout_id = self.layouts[layout_id].hasOwnProperty('layout_id') ? self.layouts[layout_id].layout_id : 0;
            $.ajax({
                url: "/api/layouts",
                data: {
                    "structure": structure,
                    "id": db_layout_id,
                    "action": "save"
                },
                method: 'POST',
                dataType: 'json'
            });
        },

        addContainerToLayout: function(container) {
            var newChild = {
                type: 'content',
                value: '',
                id: self.getNewId()
            };
            container.containers.push(newChild);
            var containerElement = self.getContainerElement(container.id).children('.content');
            var depth = containerElement.parentsUntil('.layout_editor', '.content').length;
            self.addChildElement(containerElement, newChild, 'content', depth);
        },

        getContainerElement: function(id) {
            if (self.layouts.hasOwnProperty(id)) {
                return $('#' + id);
            } else {
                return $('#layout_container_' + id);
            }
        },

        addContainer: function(e) {
            var info = self.getContainerInfo(e.target);
            self.addContainerToLayout(info.container);
        },
        removeContainer: function(e) {
            console.log(e);
        },

        editContainerContents: function(e) {
            console.log(e);
            var info = self.getContainerInfo(e.target);
            lightning.dialog.setContent("<h3>Container Contents</h3>" +
                "<div>" +
                "<select>" +
                "<option value='content' " + (info.container.type == "content" ? "selected=true" : '') + ">Text / HTML</option>" +
                "<option value='horizontal' " + (info.container.type == "horizontal" ? "selected=true" : '') + ">Columns</option>" +
                "<option value='vertical' " + (info.container.type == "vertical" ? "selected=true" : '') + ">Rows</option>" +
                "</select>" +
                "<button onclick='(function(){lightning.modules.layouts.setContent(\"" + info.container_id + "\", \"" +info.parent_id + "\")})()'>Save</button>" +
                "</div>");
        },

        setContent: function(layout_id, parent_id) {
            var value = $('#dialog_box_inner').find("select").val();
            var container = self.getContainer(self.layouts[layout_id], parent_id);
            if (container.type == value) {
                // The type hasn't changed
                return;
            }
            var elem = self.getContainerElement(container.id);
            var depth = elem.parentsUntil('.layout_editor', '.content').length;
            if (container.type == 'content' && (value=="horizontal" || value=="vertical")) {
                // switching from content to vertical or horizontal
                container.type = value;
                container.containers = [];
                elem.find(".content").empty();
                self.buildSub(elem, value, [], depth);
                self.addContainerToLayout(container);
            } else if ((container.type == "horizontal" || container.type == "vertical") && value == "content") {
                // switching from columns to content
                container.type = value;
                delete container.containers;
                elem.find(".content").empty();
                self.buildSub(elem, value, {type: "content"}, depth);
            } else {
                // just switching orientation
                self.executeFlipContainer(container);
            }
            lightning.dialog.hide();
        },

        /**
         * Change a container from horizontal to vertical or reverse
         * @param e
         */
        flipContainer: function(e) {
            var info = self.getContainerInfo(e.target);
            self.executeFlipContainer(info.container);
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
            var contentElement = self.getContainerElement(container.id).children('.content');
            contentElement.removeClass('container_type_horizontal').removeClass('container_type_vertical');
            contentElement.addClass('container_type_' + container.type);
            self.resetSortable(contentElement.closest('.layout_editor'));
        },


        getContainerInfo: function(target) {
            target = $(target);
            var parent_id = target.closest(".layout_container,.layout_editor").prop("id").replace("layout_container_", "");
            var layout_id = target.closest(".layout_editor").prop("id");
            var container = self.getContainer(self.layouts[layout_id], parent_id);
            return {
                parent_id: parent_id,
                container_id: layout_id,
                container: container,
            };
        },
        getContainer: function(container, parent_id) {
            if (container.id == parent_id) {
                // If this is the correct container, execute the callback
                return container;
            }
            // keep digging ...
            if (container.type === "horizontal" || container.type === "vertical") {
                for (var i in container.containers) {
                    // if they were sorted, we can stop looking
                    found = self.getContainer(container.containers[i], parent_id);
                    if (found !== false) {
                        return found;
                    }
                }
            }
            return false;
        }

    };
}());
