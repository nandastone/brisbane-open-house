<?php

namespace BOH\Assets;

class Assets {

    public function enqueue_assets() {
        $vendor = new BOHAssetDependencies();
        $vendor->enqueue();

        $boh = new BOHAssets();
        $boh->set_dependencies( $vendor->get_all_handlers() );
        $boh->enqueue();

        $bohBuildingsApp = new BOHMyBuildingsApp();
        $bohBuildingsApp->enqueue();
    }
}