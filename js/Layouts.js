(function() {
    if (lightning.modules.layouts) {
        return;
    }
    var self = lightning.modules.layouts = {
        layouts: {},
        lastId: 0,
        colors: [
            "red",
            "green",
            "blue"
        ],
        layoutContainerHTML: "",

        initEditor: function () {
            self.layouts = lightning.get("modules.layouts.editors");
            self.layoutContainerHTML = "<div class='layout_container'><div class='content'></div><div class='controller'><button>Add</button><button>Remove</button><button>Contents</button></div></div>";
            $(".layout_editor").each(function(){
                var id = $(this).attr("id");
                if (!self.layouts.hasOwnProperty(id)) {
                    self.layouts[id] = {};
                }
                self.layouts[id].id = id;
                self.build(id);
            });
        },

        /**
         * Build the containers into the master container.
         *
         * @param id
         */
        build: function(id) {
            var container = $("#"+id).empty();
            container.removeClass("container_type_vertical");
            container.removeClass("container_type_horizontal");
            self.layouts[id].containers = self.buildSub(container, self.layouts[id].type, self.layouts[id].containers, 0);
            $(".container_type_horizontal").sortable({axis:"x", cursor: "move", update: self.updateOrder});
            $(".container_type_vertical").sortable({axis:"y", cursor: "move", update: self.updateOrder});
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
            self.setOrder(self.layouts[layout_id], parent_id, order);
            console.log('to:');
            console.log(self.layouts);
        },

        /**
         * set the order of the child containers
         *
         * @param containers
         * @param parent_id
         * @param order
         */
        setOrder: function(containers, parent_id, order) {
            if (containers.id == parent_id) {
                var subContainers = containers.containers;
                containers.containers = [];
                for (var j in order) {
                    for (var k in subContainers) {
                        if (subContainers[k].id == order[j]) {
                            containers.containers.push(subContainers[k]);
                            break;
                        }
                    }
                }
                return true;
            }
            for (var i in containers.containers) {
                // see if this has other containers to be sorted
                if (containers.containers[i].type === "horizontal" || containers.containers[i].type === "vertical") {
                    // if they were sorted, we can stop looking
                    if (self.setOrder(containers.containers[i], parent_id, order)) {
                        return true;
                    }
                }
            }
            return false;
        },

        buildSub: function(parent, type, children, depth) {
            for (var i in children) {
                // make sure an ID exists
                children[i].id = self.getNewId();
                // add to the parent container
                parent.addClass("container_type_"+type);
                var child = $(self.layoutContainerHTML);
                child.prop("id", "layout_container_" + children[i]["id"]);
                child.prop("style", "border-color: " + self.colors[depth%(self.colors.length)]);
                var content = child.find(".content");
                if (children[i].hasOwnProperty("containers")) {
                    self.buildSub(content, children[i].type, children[i].containers, depth+1);
                }
                else if (children[i].hasOwnProperty("value")) {
                    content.html(children[i].value);
                }
                parent.append(child);
            }

            return children;
        },

        /**
         * Collect all values from text containers
         *
         * @param id
         */
        updateModel: function(id) {

        },

        getNewId: function () {
            return self.lastId++;
        }
    };
}());
