<?php

namespace macdabby\lightning_layouts\Model;

use Lightning\Model\BaseObject;

class Layout extends BaseObject {
    const TABLE = 'layout';
    const PRIMARY_KEY = 'layout_id';

    public static function loadByName($name) {
        $results = static::loadByQuery([
            'where' => ['name' => $name],
            'limit' => 1,
        ]);

        if (count($results) == 0) {
            throw new \Exception('Failed to load layout : ' . $name);
        }

        return $results[0];
    }
}
