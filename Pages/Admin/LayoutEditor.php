<?php

namespace macdabby\lightning_layouts\Pages\Admin;

use macdabby\lightning_layouts\Model\Layout;
use Lightning\Tools\ClientUser;
use Lightning\Tools\Request;
use Lightning\View\JS;
use Lightning\View\Page;

class LayoutEditor extends Page {

    protected $rightColumn = false;

    protected $layout;

    protected $page = ['layout_editor', 'macdabby/lightning-layouts'];

    public function hasAccess() {
        return ClientUser::requireAdmin();
    }

    public function get() {
        if ($id = Request::get('id', Request::TYPE_INT)) {
            $this->layout = Layout::loadById($id);
            $body = json_decode($this->layout->structure, true);
            $body['layout_id'] = $this->layout->id;
            $body = [
                'main_layout' => $body,
            ];
        } else {
            $body = [
                'main_layout' => [
                    'layout_id' => 0,
                    'type' => 'horizontal',
                    'conntainers' => [],
                ],
            ];
        }

        JS::startup('lightning.modules.layouts.initEditor();', ['macdabby/lightning-layouts' => 'Layouts.js']);
        JS::set('modules.layouts.editors', $body);
    }
}
