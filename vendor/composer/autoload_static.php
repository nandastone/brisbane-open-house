<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInitd05ae2b250715b3f78fd015a3363286c
{
    public static $files = array (
        'a4a119a56e50fbb293281d9a48007e0e' => __DIR__ . '/..' . '/symfony/polyfill-php80/bootstrap.php',
        'a94ef251632c4ced307323a91eb31392' => __DIR__ . '/../..' . '/util-functions.php',
    );

    public static $prefixLengthsPsr4 = array (
        'S' => 
        array (
            'Symfony\\Polyfill\\Php80\\' => 23,
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
        'Symfony\\Polyfill\\Php80\\' => 
        array (
            0 => __DIR__ . '/..' . '/symfony/polyfill-php80',
        ),
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

    public static $classMap = array (
        'Attribute' => __DIR__ . '/..' . '/symfony/polyfill-php80/Resources/stubs/Attribute.php',
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
        'PhpToken' => __DIR__ . '/..' . '/symfony/polyfill-php80/Resources/stubs/PhpToken.php',
        'Stringable' => __DIR__ . '/..' . '/symfony/polyfill-php80/Resources/stubs/Stringable.php',
        'UnhandledMatchError' => __DIR__ . '/..' . '/symfony/polyfill-php80/Resources/stubs/UnhandledMatchError.php',
        'ValueError' => __DIR__ . '/..' . '/symfony/polyfill-php80/Resources/stubs/ValueError.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInitd05ae2b250715b3f78fd015a3363286c::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInitd05ae2b250715b3f78fd015a3363286c::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInitd05ae2b250715b3f78fd015a3363286c::$classMap;

        }, null, ClassLoader::class);
    }
}
