<?php

namespace lightningsdk\layouts\View;

use Lightning\View\HTMLEditor\Markup;
use lightningsdk\layouts\Model\Layout as LayoutModel;
use Lightning\Tools\ClientUser;

class Layout {
    public static function renderMarkup($options, $vars) {
        if (!empty($options['id'])) {
            $layout = LayoutModel::loadByID($options['id']);
        } elseif (!empty($options['name'])) {
            $layout = LayoutModel::loadByName($options['name']);
        }

        if (empty($layout)) {
            Return 'Layout Not Found';
        }

        $rendered = static::renderContainers(json_decode($layout->structure, true), $vars);
        $output = '';
        if (ClientUser::getInstance()->isAdmin()) {
            $output = "<a href='/admin/layouts/edit?id={$layout->id}'>Edit Layout</a>";
        }
        return $output . "<div class='grid-container'>{$rendered}</div>";
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
