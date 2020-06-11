<?php

return [
    'compiler' => [
        'js' => [
            // Module Name
            'lightningsdk/layouts' => [
                // Source file => Dest file
                'Layouts.js' => 'admin.min.js',
            ]
        ],
    ],
    'routes' => [
        'static' => [
            'admin/layouts/edit' => \lightningsdk\layouts\Pages\Admin\LayoutEditor::class,
            'admin/layouts' => \lightningsdk\layouts\Pages\Admin\Layouts::class,
            'api/layouts' => \lightningsdk\layouts\API\Layouts::class,
        ],
    ],
    'markup' => [
        'renderers' => [
            'layout' => \lightningsdk\layouts\View\Layout::class,
        ],
    ],
];
