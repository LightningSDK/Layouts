<?php

namespace lightningsdk\layouts\Pages\Admin;

use Lightning\Pages\Table;
use Lightning\Tools\ClientUser;
use Lightning\Tools\Navigation;
use Lightning\Tools\Request;

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
