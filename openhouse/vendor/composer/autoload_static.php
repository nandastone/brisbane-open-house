<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInitd05ae2b250715b3f78fd015a3363286c
{
    public static $files = array (
        'a94ef251632c4ced307323a91eb31392' => __DIR__ . '/../..' . '/util-functions.php',
    );

    public static $prefixLengthsPsr4 = array (
        'S' => 
        array (
            'Symfony\\Component\\Asset\\' => 24,
        ),
        'C' => 
        array (
            'Cocur\\Slugify\\' => 14,
        ),
        'B' => 
        array (
            'BOH\\' => 4,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'Symfony\\Component\\Asset\\' => 
        array (
            0 => __DIR__ . '/..' . '/symfony/asset',
        ),
        'Cocur\\Slugify\\' => 
        array (
            0 => __DIR__ . '/..' . '/cocur/slugify/src',
        ),
        'BOH\\' => 
        array (
            0 => __DIR__ . '/../..' . '/src',
        ),
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInitd05ae2b250715b3f78fd015a3363286c::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInitd05ae2b250715b3f78fd015a3363286c::$prefixDirsPsr4;

        }, null, ClassLoader::class);
    }
}
