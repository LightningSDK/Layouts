<?php

namespace macdabby\lightning_layouts\API;

use Lightning\Tools\ClientUser;
use Lightning\Tools\Output;
use Lightning\Tools\Request;
use Layouts\Model\Layout as LayoutModel;

class Layouts {

    public function hasAccess() {
        return ClientUser::isAdmin();
    }

    public function postSave() {
        $id = Request::post('id', Request::TYPE_INT);
        $data = ['structure' => Request::post('structure')];
        if ($id > 0) {
            $data['id'] = $id;
        }
        $layout->save();
        return ['id' => $layout->id];
    }
}
