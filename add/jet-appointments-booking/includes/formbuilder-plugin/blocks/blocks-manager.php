<?php
namespace JET_APB\Formbuilder_Plugin\Blocks;

use JET_APB\Plugin;
use JET_APB\Formbuilder_Plugin\With_Form_Builder;

class Blocks_Manager {

	use With_Form_Builder;

	public function manager_init() {
		add_action(
			'jet-form-builder/blocks/register',
			array( $this, 'register_fields' )
		);

		add_action(
			'jet-form-builder/editor-assets/after',
			array( $this, 'enqueue_calendar_styles' )
		);
	}

	public function enqueue_calendar_styles() {

		if ( Plugin::instance()->settings->show_timezones() ) {
			wp_enqueue_style( 'jet-ab-choices' );
		}

		wp_enqueue_style( 'vanilla-calendar' );
	}

	public function register_fields( $manager ) {
		$manager->register_block_type( new Appointment_Date_Field() );
		$manager->register_block_type( new Appointment_Provider_Field() );
	}

}
