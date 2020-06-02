<?php

namespace macdabby\lightning_layouts\View;

use Lightning\View\HTMLEditor\Markup;

class Layout {
    public static function renderMarkup($options, $vars) {
        $layout =  [
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
                            'value' => '{{body2}}asd',
                        ],
                        [
                            'width' => 3,
                            'type' => 'content',
                            'value' => '{{widget id="1"}}asd',
                        ],
                        [
                            'width' => 3,
                            'type' => 'content',
                            'value' => '{{widget  id="2"}}asd',
                        ],
                    ],
                ],
                [
                    'type' => 'content',
                    'value' => 'bottom content',
                ],
            ],
        ];

        $rendered = static::renderContainers($layout, $vars);
        return "<div class='grid-container'>{$rendered}</div>";
    }

    protected static function renderContainers($layout, &$vars) {
        switch ($layout['type']) {
            case 'vertical':
            case 'horizontal':
                $output = '';
                foreach ($layout['containers'] as $container) {
                    $class = $layout['type'] == 'vertical' ? 'grix-y' : 'grid-x';
                    $output .= '<div class="cell">'  . static::renderContainers($container, $vars) . '</div>';
                }
                return '<div class="' . $class . '">' . $output . '</div>';
                break;
            case 'content':
                return Markup::render($layout['value'], $vars);
        }
    }
}
