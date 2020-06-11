<?php

namespace lightningsdk\layouts\API;

use lightningsdk\core\Tools\ClientUser;
use lightningsdk\core\Tools\Output;
use lightningsdk\core\Tools\Request;
use lightningsdk\layouts\Model\Layout as LayoutModel;
use lightningsdk\core\View\API;

class Layouts extends API {

    public function hasAccess() {
        return ClientUser::requireAdmin();
    }

    public function postSave() {
        $id = Request::post('id', Request::TYPE_INT);
        $structure = Request::post('structure', Request::TYPE_JSON_STRING);
        if ($id > 0) {
            $layout = LayoutModel::loadByID($id);
            $layout->structure = $structure;
        } else {
            $layout = new LayoutModel(['structure' => $structure]);
        }
        $layout->save();
        return ['id' => $layout->id];
    }
}
