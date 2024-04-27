<?php
/**
 * Admin order details template.
 */
?>

<hr>
<h3><?php esc_html_e( 'Booking Details', 'jet-booking' ); ?></h3>

<p>
	<?php
	foreach ( $details as $item ) {
		if ( ! empty( $item['key'] ) ) {
			echo $item['key'] . ': ';
		}
		if ( ! empty( $item['is_html'] ) ) {
			echo $item['display'];
		} else {
			echo '<strong>' . $item['display'] . '</strong></br>';
		}
	}
	?>
</p>