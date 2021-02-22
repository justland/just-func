<?php

namespace justland\JustFuncSchema;

use Composer\Script\Event;
use Unional\Jsonc\JSONC;

class Composer
{
  public static function copySchema(Event $event)
  {
    echo self::class . "::copySchema [folder=json-schema]\n";
    $args = $event->getArguments();
    $dir = count($args) === 1 ? $args[0] : 'json-schema';
    $cwd = getcwd();
    $targetPath = "$cwd/$dir/just-func.jsonc";
    $sourcePath = __DIR__ . "/../json-schema/just-func.jsonc";
    if (!file_exists($targetPath)) {
      $dirPath = "$cwd/$dir";
      if (!is_dir($dirPath)) {
        echo "directory $dirPath not exist, creating...\n";
        mkdir($dirPath);
      }
      echo "copy just-func.jsonc to $dirPath...\n";
      copy($sourcePath, $targetPath);
    } else {
      $targetId = JSONC::decode(file_get_contents($targetPath), true)['$id'];
      $newId = JSONC::decode(file_get_contents($sourcePath), true)['$id'];
      if ($targetId !== $newId) {
        echo "just-func is updating from:
        $targetId -> $newId
        Please check if you need to update your application schema";
        copy($sourcePath, $targetPath);
      } else {
        echo "just-func is up to date.\n";
      }
    }
  }
}
