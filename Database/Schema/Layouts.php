<?php

namespace macdabby\lightning_layouts\Database\Schema;

use Lightning\Database\Schema;

class Layouts extends Schema {
    const TABLE = 'layouts';

    public function getColumns() {
        return [
            'layout_id' => $this->autoincrement(),
            'structure' => $this->text(),
        ];
    }

    public function getKeys() {
        return [
            'primary' => 'layout_id',
        ];
    }
}
