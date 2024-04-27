<?php
namespace JET_APB\Public_Actions;

use JET_APB\Plugin;

if ( ! defined( 'WPINC' ) ) {
	die();
}

/**
 * Public actions manager
 */
class Manager {

	private $action_key = '_jet_apb_action';
	private $message    = null;

	public function __construct() {
		
		if ( ! $this->is_enabled() ) {
			return;
		}

		if ( $this->is_action_request() ) {
			add_action( 'wp', [ $this, 'process_action' ] );
		}
		
		$this->register_actions();
		$this->process_tokens_meta();		

	}

	public function register_actions() {

		new Actions\Confirm();
		new Actions\Cancel();

		do_action( 'jet-apb/public-actions/register', $this );

	}

	public function process_tokens_meta() {
		add_action( 'jet-apb/form-action/insert-appointment', [ $this, 'save_token_meta' ], 20, 2 );
		add_action( 'jet-apb/display-meta-fields', [ $this, 'show_token_meta' ], 20, 2 );
	}

	public function save_token_meta( $appointment, $action ) {
		$tokens = new Tokens();
		$appointment->set_meta( [
			Tokens::$token_key => $tokens->get_token( $appointment ),
		] );
	}

	public function show_token_meta( $fields = [] ) {

		$fields[ Tokens::$token_key ] = [
			'label' => __( 'Token', 'jet-appointments-booking' ),
			'cb'    => false,
		];

		return $fields;

	}

	public function is_enabled() {
		return Plugin::instance()->settings->get( 'allow_action_links' );
	}

	public function is_action_request() {
		return ! empty( $_GET[ Tokens::$token_key ] ) && $this->get_action();
	}

	public function process_action() {

		$tokens = new Tokens();
		$appointment = $tokens->get_appointment_by_token( $_GET[ Tokens::$token_key ] );

		if ( ! $appointment ) {
			return;
		}

		$result = apply_filters( 'jet-apb/public-actions/process/' . $this->get_action(), $appointment, $this );

		if ( $result ) {
			$this->render_result_page();
		}

	}

	public function get_message() {
		return $this->message;
	}

	public function set_message( $message = '' ) {
		$this->message = $message;
	}

	public function render_result_page() {

		$custom_page = apply_filters( 'jet-apb/public-actions/custom-results-page-content', false, $this );

		if ( $custom_page ) {
			echo $custom_page;
		} else {
			get_header();

			$this->print_styles();
			
			printf( 
				'<div class="jet-apb-action-result action-%2$s">%1$s</div>',
				$this->get_message(),
				esc_attr( $this->get_action() )
			);

			get_footer();
		}

		die();
		
	}

	public function get_action() {
		return ! empty( $_GET[ $this->action_key ] ) ? $_GET[ $this->action_key ] : false;
	}

	public function print_styles() {
		
		ob_start();

		echo '.jet-apb-action-result { padding: 30px; width: 80vw; margin: 30px auto; max-width: 480px; text-align: center; border: 1px solid currentColor; }';

		do_action( 'jet-apb/public-actions/print-styles/' . $this->get_action(), $appointment, $this );

		printf( '<style>%s</style>', ob_get_clean() );

	}

}
