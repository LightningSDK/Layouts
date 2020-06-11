<?php

namespace lightningsdk\layouts\Pages\Admin;

use lightningsdk\core\Pages\Table;
use lightningsdk\core\Tools\ClientUser;
use lightningsdk\core\Tools\Navigation;
use lightningsdk\core\Tools\Request;

class Layouts extends Table {
    const TABLE = 'layout';
    const PRIMARY_KEY = 'layout_id';

    public function hasAccess() {
        return ClientUser::requireAdmin();
    }

    public function getNew() {
        Navigation::redirect('/admin/layouts/edit', ['id' => Request::get('id')]);
        return;
    }

    public function getEdit() {
        Navigation::redirect('/admin/layouts/edit', ['id' => Request::get('id')]);
        return;
    }
}
