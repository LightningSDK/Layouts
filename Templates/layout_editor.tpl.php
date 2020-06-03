<style>
    .layout_container {
        border: 2px solid red;
        background: white;
        overflow: hidden;
    }
    .container_type_horizontal {
        overflow-y: hidden;
        overflow-x: scroll;
    }
    .container_type_horizontal>div{
        display: inline-block;
        float:left;
    }
    .container_type_horizontal>.layout_container>.drag-bar {
        height: 30px;
        width: 100%;
        background: lightgrey;
    }
    .container_type_vertical>.layout_container>.drag-bar {
        height: 200px;
        width: 30px;
        background: lightgrey;
        float:left;
    }
    .container_type_vertical>.layout_container>.drag-bar:last-of-type {
        float:right;
    }
</style>
<div class="layout_editor" id="main_layout">

</div>

<button name="save" value="Save" onclick="function(){lightning.layouts.save('layout_editor');}"></button>
