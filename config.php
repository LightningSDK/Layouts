<?php

return [
    'compiler' => [
        'js' => [
            // Module Name
            'macdabby/lightning-layouts' => [
                // Source file => Dest file
                'Layouts.js' => 'admin.min.js',
            ]
        ],
    ],
    'routes' => [
        'static' => [
            'admin/layouts/edit' => \macdabby\lightning_layouts\Pages\Admin\LayoutEditor::class,
            'admin/layouts' => \macdabby\lightning_layouts\Pages\Admin\Layouts::class,
        ],
    ],
];