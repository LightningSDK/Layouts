<?php

namespace macdabby\lightning_layouts\Pages\Admin;

use Layouts\Model\Layout;
use Lightning\Tools\ClientUser;
use Lightning\Tools\Request;
use Lightning\View\JS;
use Lightning\View\Page;

class LayoutEditor extends Page {

    protected $rightColumn = false;

    protected $layout;

    protected $page = ['layout_editor', 'Layouts'];

    public function hasAccess() {
        return ClientUser::requireAdmin();
    }

    public function get() {
        if ($id = Request::get('id', Request::TYPE_INT)) {
            $this->layout = Layout::loadById($id);
        }

        JS::startup('lightning.modules.layouts.initEditor();', ['Layouts' => 'Layouts.js']);
        JS::set('modules.layouts.editors', [
            'main_layout' => [
                'type' => 'vertical',
                'containers'  => [
                    [
                        'type' => 'content',
                        'value' => 'top content',
                    ],
                    [
                        'type' => 'horizontal',
                        'containers' => [
                            [
                                'width' => 6,
                                'type' => 'content',
                                'value' => '{{body}}',
                            ],
                            [
                                'width' => 3,
                                'type' => 'content',
                                'value' => '{{widget id="1"}}',
                            ],
                            [
                                'width' => 3,
                                'type' => 'content',
                                'value' => '{{widget  id="2"}}',
                            ],
                        ],
                    ],
                    [
                        'type' => 'content',
                        'value' => 'bottom content',
                    ],
                ],
            ],
        ]);
    }
}
