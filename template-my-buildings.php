<?php
/*
 * Template Name: [BOH] My Buildings
 *
 * @package BrisbaneOpenHouse
 * @author Arvil Meña <arvil@jsacreative.com.au>
 */

$context = Timber::get_context();
$context['post'] = new TimberPost();
$context['login_failed'] = ( 1 === preg_match('/error/', $_SERVER['QUERY_STRING']) );

Timber::render('pages/template-my-buildings.twig', $context);
