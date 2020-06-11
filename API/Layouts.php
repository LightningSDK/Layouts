<?php

namespace macdabby\lightning_layouts\API;

use Lightning\Tools\ClientUser;
use Lightning\Tools\Output;
use Lightning\Tools\Request;
use macdabby\lightning_layouts\Model\Layout as LayoutModel;
use Lightning\View\API;

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
