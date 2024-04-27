<?php
/**
 * Compare & Wishlist Widgets Functions class
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

if ( ! class_exists( 'Jet_CW_Widgets_Functions' ) ) {

	/**
	 * Define Jet_CW_Widgets_Functions class
	 */
	class Jet_CW_Widgets_Functions {

		/**
		 * A reference to an instance of this class.
		 *
		 * @since 1.0.0
		 * @var   object
		 */
		private static $instance = null;

		/**
		 * Get add to compare button.
		 *
		 * Print add to compare button.
		 *
		 * @since 1.0.0
		 * @since 1.5.3 Added `jet-cw/compare/in-compare` filter hook.
		 *
		 * @param array         $display_settings Settings list.
		 * @param string|number $product_id       Products ID.
		 *
		 * @return void
		 */
		public function get_add_to_compare_button( $display_settings, $product_id ) {

			$products_in_compare = jet_cw()->compare_data->get_compare_list();
			$is_compare_product  = apply_filters( 'jet-cw/compare/in-compare', in_array( $product_id, $products_in_compare ), $product_id, $products_in_compare );
			$widget_id           = $display_settings['_widget_id'];

			$button_classes = array(
				'jet-compare-button__link',
				'jet-compare-button__link--icon-' . $display_settings['button_icon_position'],
			);

			$compare_page_id      = filter_var( jet_cw()->settings->get( 'compare_page' ), FILTER_VALIDATE_INT );
			$compare_page_link    = '#';
			$remove_button_enable = isset( $display_settings['use_as_remove_button'] ) ? filter_var( $display_settings['use_as_remove_button'], FILTER_VALIDATE_BOOLEAN ) : false;

			if ( ! $remove_button_enable && $compare_page_id && $is_compare_product ) {
				$compare_page_link = esc_url( get_page_link( $compare_page_id ) );
			}

			if ( $is_compare_product ) {
				$button_classes[] = 'added-to-compare';

				if ( $remove_button_enable ) {
					$button_classes[] = 'jet-compare-item-remove-button';
				}
			} ?>

			<a href="<?php echo $compare_page_link; ?>" class="<?php echo implode( ' ', $button_classes ); ?>" data-widget-type="jet-compare-button" data-product-id="<?php echo $product_id ?>" data-widget-id="<?php echo $widget_id ?>">
				<div class="jet-compare-button__plane jet-compare-button__plane-normal"></div>
				<div class="jet-compare-button__plane jet-compare-button__plane-added"></div>
				<div class="jet-compare-button__state jet-compare-button__state-normal">
					<?php
					if ( filter_var( $display_settings['use_button_icon'], FILTER_VALIDATE_BOOLEAN ) ) {
						printf( '<span class="jet-compare-button__icon jet-cw-icon">%s</span>', htmlspecialchars_decode( $display_settings['button_icon_normal'] ) );
					}
					printf( '<span class="jet-compare-button__label">%s</span>', $display_settings['button_label_normal'] );
					?>
				</div>
				<div class="jet-compare-button__state jet-compare-button__state-added">
					<?php
					if ( filter_var( $display_settings['use_button_icon'], FILTER_VALIDATE_BOOLEAN ) ) {
						printf( '<span class="jet-compare-button__icon jet-cw-icon">%s</span>', htmlspecialchars_decode( $display_settings['button_icon_added'] ) );
					}
					printf( '<span class="jet-compare-button__label">%s</span>', $display_settings['button_label_added'] );
					?>
				</div>
			</a>

			<?php
		}

		/**
		 * Get add to wishlist button.
		 *
		 * Print add to wishlist button.
		 *
		 * @since 1.0.0
		 * @since 1.5.3 Added `jet-cw/wishlist/in-wishlist` filter hook.
		 *
		 * @param array         $display_settings Settings list.
		 * @param string|number $product_id       Products ID.
		 *
		 * @return void
		 */
		public function get_add_to_wishlist_button( $display_settings, $product_id ) {

			$products_in_wishlist = jet_cw()->wishlist_data->get_wish_list();
			$is_wishlist_product  = apply_filters( 'jet-cw/wishlist/in-wishlist', in_array( $product_id, $products_in_wishlist ), $product_id, $products_in_wishlist );
			$widget_id            = $display_settings['_widget_id'];

			$button_classes = array(
				'jet-wishlist-button__link',
				'jet-wishlist-button__link--icon-' . $display_settings['button_icon_position'],
			);

			$wishlist_page_id     = filter_var( jet_cw()->settings->get( 'wishlist_page' ), FILTER_VALIDATE_INT );
			$wishlist_page_link   = '#';
			$remove_button_enable = isset( $display_settings['use_as_remove_button'] ) ? filter_var( $display_settings['use_as_remove_button'], FILTER_VALIDATE_BOOLEAN ) : false;

			if ( ! $remove_button_enable && $wishlist_page_id && $is_wishlist_product ) {
				$wishlist_page_link = esc_url( get_page_link( $wishlist_page_id ) );
			}

			if ( $is_wishlist_product ) {
				$button_classes[] = 'added-to-wishlist';

				if ( $remove_button_enable ) {
					$button_classes[] = 'jet-wishlist-item-remove-button';
				}
			} ?>

			<a href="<?php echo $wishlist_page_link; ?>" class="<?php echo implode( ' ', $button_classes ); ?>" data-widget-type="jet-wishlist-button" data-product-id="<?php echo $product_id ?>" data-widget-id="<?php echo $widget_id ?>">
				<div class="jet-wishlist-button__plane jet-wishlist-button__plane-normal"></div>
				<div class="jet-wishlist-button__plane jet-wishlist-button__plane-added"></div>
				<div class="jet-wishlist-button__state jet-wishlist-button__state-normal">
					<?php
					if ( filter_var( $display_settings['use_button_icon'], FILTER_VALIDATE_BOOLEAN ) ) {
						printf( '<span class="jet-wishlist-button__icon jet-cw-icon">%s</span>', htmlspecialchars_decode( $display_settings['button_icon_normal'] ) );
					}
					printf( '<span class="jet-wishlist-button__label">%s</span>', $display_settings['button_label_normal'] );
					?>
				</div>
				<div class="jet-wishlist-button__state jet-wishlist-button__state-added">
					<?php
					if ( filter_var( $display_settings['use_button_icon'], FILTER_VALIDATE_BOOLEAN ) ) {
						printf( '<span class="jet-wishlist-button__icon jet-cw-icon">%s</span>', htmlspecialchars_decode( $display_settings['button_icon_added'] ) );
					}
					printf( '<span class="jet-wishlist-button__label">%s</span>', $display_settings['button_label_added'] );
					?>
				</div>
			</a>

			<?php
		}

		/**
		 * Print compare count button
		 *
		 * @param $display_settings
		 */
		public function get_compare_count_button( $display_settings ) {

			$products_in_compare = jet_cw()->compare_data->get_compare_list();
			$count               = sprintf( $display_settings['count_format'], count( $products_in_compare ) );
			$widget_id           = $display_settings['_widget_id'];

			$button_classes = array(
				'jet-compare-count-button__link',
				'jet-compare-count-button--icon-' . $display_settings['button_icon_position'],
				'jet-compare-count-button--count-' . $display_settings['count_position'],
			);

			$compare_page_id   = filter_var( jet_cw()->settings->get( 'compare_page' ), FILTER_VALIDATE_INT );
			$compare_page_link = '#';

			if ( $compare_page_id ) {
				$compare_page_link = esc_url( get_page_link( $compare_page_id ) );
			} ?>

			<a href="<?php echo $compare_page_link; ?>" class="<?php echo implode( ' ', $button_classes ); ?>" data-widget-type="jet-compare-count-button" data-widget-id="<?php echo $widget_id ?>">
				<div class="jet-compare-count-button__content">
					<?php
					if ( filter_var( $display_settings['use_button_icon'], FILTER_VALIDATE_BOOLEAN ) ) {
						printf( '<span class="jet-compare-count-button__icon jet-cw-icon">%s</span>', htmlspecialchars_decode( $display_settings['button_icon'] ) );
					}

					printf( '<span class="jet-compare-count-button__label">%s</span>', $display_settings['button_label'] );

					if ( filter_var( $display_settings['show_count'], FILTER_VALIDATE_BOOLEAN ) ) {
						$count_button = sprintf( '<div class="jet-compare-count-button__count"><span>%s</span></div>', $count );

						if ( filter_var( $display_settings['hide_empty_count'], FILTER_VALIDATE_BOOLEAN ) && 0 === count( $products_in_compare ) ) {
							$count_button = '';
						}

						echo $count_button;
					}
					?>
				</div>
			</a>

			<?php
		}

		/**
		 * Print wishlist count button
		 *
		 * @param $display_settings
		 */
		public function get_wishlist_count_button( $display_settings ) {

			$products_in_wishlist = jet_cw()->wishlist_data->get_wish_list();
			$count                = sprintf( $display_settings['count_format'], count( $products_in_wishlist ) );
			$widget_id            = $display_settings['_widget_id'];

			$button_classes = array(
				'jet-wishlist-count-button__link',
				'jet-wishlist-count-button--icon-' . $display_settings['button_icon_position'],
				'jet-wishlist-count-button--count-' . $display_settings['count_position'],
			);

			$wishlist_page_id   = filter_var( jet_cw()->settings->get( 'wishlist_page' ), FILTER_VALIDATE_INT );
			$wishlist_page_link = '#';

			if ( $wishlist_page_id ) {
				$wishlist_page_link = esc_url( get_page_link( $wishlist_page_id ) );
			} ?>

			<a href="<?php echo $wishlist_page_link; ?>" class="<?php echo implode( ' ', $button_classes ); ?>" data-widget-type="jet-wishlist-count-button" data-widget-id="<?php echo $widget_id ?>">
				<div class="jet-wishlist-count-button__content">
					<?php
					if ( filter_var( $display_settings['use_button_icon'], FILTER_VALIDATE_BOOLEAN ) ) {
						printf( '<span class="jet-wishlist-count-button__icon jet-cw-icon">%s</span>', htmlspecialchars_decode( $display_settings['button_icon'] ) );
					}

					printf( '<span class="jet-wishlist-count-button__label">%s</span>', $display_settings['button_label'] );

					if ( filter_var( $display_settings['show_count'], FILTER_VALIDATE_BOOLEAN ) ) {
						$count_button = sprintf( '<div class="jet-wishlist-count-button__count"><span>%s</span></div>', $count );

						if ( filter_var( $display_settings['hide_empty_count'], FILTER_VALIDATE_BOOLEAN ) && 0 === count( $products_in_wishlist ) ) {
							$count_button = '';
						}

						echo $count_button;
					}
					?>
				</div>
			</a>

			<?php
		}

		/**
		 * Print compare table widget
		 *
		 * @param $widget_settings
		 */
		public function get_widget_compare_table( $widget_settings ) {

			$products              = $this->get_products_added_to_compare();
			$widget_id             = $widget_settings['_widget_id'];
			$table_data_items      = $widget_settings['compare_table_data'];
			$empty_text            = $widget_settings['empty_compare_text'];
			$highlight_differences = filter_var( $widget_settings['highlight_differences'], FILTER_VALIDATE_BOOLEAN );
			$only_differences      = filter_var( $widget_settings['only_differences'], FILTER_VALIDATE_BOOLEAN );
			$clear_table           = filter_var( $widget_settings['clear_table'], FILTER_VALIDATE_BOOLEAN );

			$table_wrapper_classes = array(
				'jet-compare-table__wrapper',
			);

			if ( filter_var( $widget_settings['scrolled_table'], FILTER_VALIDATE_BOOLEAN ) && ! empty( $widget_settings['scrolled_table_on'] ) ) {
				foreach ( $widget_settings['scrolled_table_on'] as $device_type ) {
					$table_wrapper_classes[] = 'jet-compare-table-responsive-' . $device_type;
				}
			}

			if ( empty( $products ) ) {
				$this->get_no_product_in_compare_content( $table_wrapper_classes, $widget_id, $empty_text );

				return null;
			} ?>

			<div class="<?php echo implode( ' ', $table_wrapper_classes ) ?>" data-widget-type="jet-compare" data-widget-id="<?php echo $widget_id ?>">
				<?php if ( $clear_table || $highlight_differences || $only_differences ) : ?>
					<div class="jet-compare-table-actions">
						<?php if ( $clear_table ) : ?>
							<a type="button" class="jet-compare-table-action-control jet-compare-table-action-control__clear">
								<?php $this->get_compare_table_action_control(
									htmlspecialchars_decode( $widget_settings['clear_table_icon'] ),
									$widget_settings['clear_table_label']
								); ?>
							</a>
						<?php endif; ?>

						<?php if ( $highlight_differences ) : ?>
							<a type="button" class="jet-compare-table-action-control jet-compare-table-action-control__highlight">
								<?php $this->get_compare_table_action_control(
									htmlspecialchars_decode( $widget_settings['highlight_button_icon_normal'] ),
									$widget_settings['highlight_button_label_normal'],
									htmlspecialchars_decode( $widget_settings['highlight_button_icon_active'] ),
									$widget_settings['highlight_button_label_active']
								); ?>
							</a>
						<?php endif; ?>

						<?php if ( $only_differences ) : ?>
							<a type="button" class="jet-compare-table-action-control jet-compare-table-action-control__differences">
								<?php $this->get_compare_table_action_control(
									htmlspecialchars_decode( $widget_settings['differences_button_icon_normal'] ),
									$widget_settings['differences_button_label_normal'],
									htmlspecialchars_decode( $widget_settings['differences_button_icon_active'] ),
									$widget_settings['differences_button_label_active']
								); ?>
							</a>
						<?php endif; ?>
					</div>
				<?php endif; ?>
				<table class="jet-compare-table woocommerce">
					<tbody class="jet-compare-table-body">
					<?php
					foreach ( $table_data_items as $table_data_item ) {
						$data_type = $table_data_item['compare_table_data_type'];
						if ( 'attributes' === $data_type ) {
							$this->get_compare_table_rows_content_attributes( $table_data_item, $products );
						} else {
							$this->get_compare_table_rows_content( $table_data_item, $products );
						}
					}
					?>
					</tbody>
				</table>
			</div>

			<?php
		}

		/**
		 * Print empty compare table content
		 *
		 * @param $table_wrapper_classes
		 * @param $widget_id
		 * @param $empty_text
		 */
		public function get_no_product_in_compare_content( $table_wrapper_classes, $widget_id, $empty_text ) { ?>

			<div class="<?php echo implode( ' ', $table_wrapper_classes ) ?>" data-widget-type="jet-compare" data-widget-id="<?php echo $widget_id ?>">
				<h5 class="jet-compare-table-empty"><?php echo apply_filters( 'jet-cw/compare/empty_text', $empty_text ); ?></h5>
			</div>

			<?php
		}

		/**
		 * Returns compare table row content
		 *
		 * @param array $display_settings
		 * @param       $products
		 */
		public function get_compare_table_rows_content( $display_settings = array(), $products = null ) {

			$heading_tag = ! empty( $display_settings['compare_table_data_title_html_tag'] ) ? jet_cw_tools()->sanitize_html_tag( $display_settings['compare_table_data_title_html_tag'] ) : 'h5'; ?>

			<tr class="jet-compare-table-row">
				<th class="jet-compare-table-heading"><?php echo esc_html( $display_settings['compare_table_data_title'] ) ?></th>
				<?php foreach ( $products as $_product ) {
					global $product;

					$product = $_product;

					if ( ! is_a( $_product, 'WC_Product' ) ) {
						return;
					}

					$function_name = 'get_' . $display_settings['compare_table_data_type'];

					echo '<td class="jet-compare-table-cell jet-compare-item" data-product-id="' . $_product->get_id() . '">';

					if ( $function_name === 'get_title' ) {
						echo '<' . $heading_tag . ' class="jet-cw-product-title" >' . jet_cw_functions()->$function_name( $_product, $display_settings ) . '</' . $heading_tag . '>';;
					} else {
						echo jet_cw_functions()->$function_name( $_product, $display_settings );
					}

					echo '</td>';
				} ?>

			</tr>

			<?php
		}

		/**
		 * Compare table action control.
		 *
		 * Print compare table action control.
		 *
		 * @since  1.5.0
		 * @access public
		 *
		 * @param string $normal_icon  Normal state control icon.
		 * @param string $normal_label Normal state control label.
		 * @param string $active_icon  Active state control icon.
		 * @param string $active_label Active state control label.
		 */
		public function get_compare_table_action_control( $normal_icon = '', $normal_label = '', $active_icon = '', $active_label = '' ) {

			$normal_state = '';
			$active_state = '';

			if ( ! empty( $normal_icon ) || ! empty( $normal_label ) ) {
				$normal_icon  = ! empty( $normal_icon ) ? sprintf( '<span class="jet-compare-table-action-control__icon jet-cw-icon">%s</span>', $normal_icon ) : '';
				$normal_label = ! empty( $normal_label ) ? sprintf( '<span class="jet-compare-table-action-control__label">%s</span>', $normal_label ) : '';

				$normal_state = sprintf(
					'
						<div class="jet-compare-table-action-control__plane jet-compare-table-action-control__plane-normal"></div>
						<div class="jet-compare-table-action-control__state jet-compare-table-action-control__state-normal"> %s %s </div>
					',
					$normal_icon,
					$normal_label
				);
			}

			if ( ! empty( $active_icon ) || ! empty( $active_label ) ) {
				$active_icon  = ! empty( $active_icon ) ? sprintf( '<span class="jet-compare-table-action-control__icon jet-cw-icon">%s</span>', $active_icon ) : '';
				$active_label = ! empty( $active_label ) ? sprintf( '<span class="jet-compare-table-action-control__label">%s</span>', $active_label ) : '';

				$active_state = sprintf(
					'
						<div class="jet-compare-table-action-control__plane jet-compare-table-action-control__plane-active"></div>
						<div class="jet-compare-table-action-control__state jet-compare-table-action-control__state-active"> %s %s </div>
					',
					$active_icon,
					$active_label
				);
			}

			printf( '%s %s', $normal_state, $active_state );

		}

		/**
		 * Get compare table rows content attributes.
		 *
		 * Print products attributes in compare table rows content.
		 *
		 * @since 1.0.0
		 * @since 1.5.4 Added `'jet-cw/template-functions/exclude-attributes'` hook for excluded attributes control.
		 *
		 * @param array      $display_settings List of display settings.
		 * @param array|null $products         List of products.
		 *
		 * @return void
		 */
		public function get_compare_table_rows_content_attributes( $display_settings = [], $products = null ) {

			$attributes         = jet_cw_functions()->get_visible_products_attributes( $products );
			$exclude_attributes = $display_settings['compare_table_data_attributes_exclude'] ?? '';
			$exclude_attributes = apply_filters( 'jet-cw/template-functions/exclude-attributes', $exclude_attributes, $products );

			foreach ( $attributes as $key => $value ) {
				$continue = false;

				if ( ! empty( $exclude_attributes ) ) {
					foreach ( $exclude_attributes as $excluded_attribute ) {
						if ( $key === 'pa_' . $excluded_attribute ) {
							$continue = true;
						}
					}
				}

				if ( $continue ) {
					continue;
				}

				echo '<tr class="jet-compare-table-row">';
				echo '<th class="jet-compare-table-heading">' . $value . '</th>';

				foreach ( $products as $_product ) {
					$has_attributes = $_product->has_attributes();

					global $product;
					$product = $_product;

					if ( ! is_a( $_product, 'WC_Product' ) ) {
						return;
					}

					if ( $has_attributes ) {
						$attributes_value = $_product->get_attribute( $key );
						$attributes_value = str_replace( "|", ",", $attributes_value );
						$attributes_value = explode( ',', $attributes_value );
						$attributes_value = '<div class="jet-cw-attributes"><span>' . implode( '</span>&#44;<span>', $attributes_value ) . '</span></div>';

						echo '<td class="jet-compare-table-cell jet-compare-item" data-product-id="' . $_product->get_id() . '">' . $attributes_value . '</td>';
					} else {
						echo '<td class="jet-compare-table-cell jet-compare-item jet-compare-item--empty" data-product-id="' . $_product->get_id() . '">-</td>';
					}
				}

				echo '</tr>';
			}

		}

		/**
		 * Get products added to compare.
		 *
		 * Returns array of products objects that were added to compare table.
		 *
		 * @since  1.0.0
		 * @since  1.5.3 Added `jet-cw/compare/product-id` filter hook.
		 * @access public
		 *
		 * @return array|null
		 */
		public function get_products_added_to_compare() {

			$products_in_compare = jet_cw()->compare_data->get_compare_list();

			if ( empty( $products_in_compare ) ) {
				return null;
			}

			$products = [];

			foreach ( $products_in_compare as $product_id ) {
				$product_id = apply_filters( 'jet-cw/compare/product-id', $product_id );
				$product    = wc_get_product( $product_id );

				if ( ! $product ) {
					continue;
				}

				$products[] = $product;
			}

			return $products;

		}

		/**
		 * Print wishlist widget
		 *
		 * @param $widget_settings
		 */
		public function get_widget_wishlist( $widget_settings ) {

			$products           = $this->get_products_added_to_wishlist();
			$widget_id          = $widget_settings['_widget_id'];
			$empty_text         = $widget_settings['empty_wishlist_text'];
			$heading_tag        = ! empty( $widget_settings['title_html_tag'] ) ? $widget_settings['title_html_tag'] : 'h5';
			$thumbnail_position = 'preset-1' === $widget_settings['presets'] ? $widget_settings['thumbnail_position'] : 'default';
			$equal              = filter_var( $widget_settings['equal_height_cols'], FILTER_VALIDATE_BOOLEAN );

			$equal_class = $equal ? 'jet-equal-cols' : '';

			$wishlist_classes = array(
				'jet-wishlist__content',
				'woocommerce',
				'jet-wishlist-products--' . $widget_settings['presets'],
			);

			if ( empty( $products ) ) {
				$this->get_no_product_in_wishlist_content( $wishlist_classes, $widget_id, $empty_text );

				return;
			} ?>

			<div class="<?php echo implode( ' ', $wishlist_classes ) ?>" data-widget-type="jet-wishlist" data-widget-id="<?php echo $widget_id ?>">
				<div class="cw-col-row jet-wishlist-thumbnail-<?php echo $thumbnail_position; ?> <?php echo $equal_class; ?>">
					<?php foreach ( $products as $_product ): ?>
						<?php
						global $product;

						$product          = $_product;
						$template_content = null;
						?>
						<div class="jet-woo-products__item">
							<div class="jet-wishlist-item">
								<?php $template_content = apply_filters( 'jet-compare-wishlist/wishlist-template/template-content', $template_content, $_product ); ?>
								<?php if ( $template_content ) : ?>
									<?php
									echo jet_cw_functions()->get_wishlist_remove_button( $_product, $widget_settings );
									echo $template_content;
									?>
								<?php else : ?>
									<?php if ( 'default' !== $widget_settings['thumbnail_position'] && 'preset-1' === $widget_settings['presets'] ) : ?>
										<div class="jet-wishlist-item__thumbnail">
											<?php echo jet_cw_functions()->get_thumbnail( $_product, $widget_settings ); ?>
										</div>
									<?php endif; ?>
									<div class="jet-wishlist-item__content">
										<?php include jet_cw()->get_template( 'jet-wishlist/global/presets/' . $widget_settings['presets'] . '.php' ) ?>
									</div>
								<?php endif; ?>
							</div>
						</div>
					<?php endforeach; ?>
				</div>
			</div>

			<?php
		}

		/**
		 * Get wishlist element template depends on name.
		 *
		 * @param string $name
		 *
		 * @return string
		 */
		public function get_template( $name ) {
			return jet_cw()->get_template( 'jet-wishlist/global/' . $name . '.php' );
		}

		/**
		 * Print empty wishlist content
		 *
		 * @param $wishlist_classes
		 * @param $widget_id
		 * @param $empty_text
		 */
		public function get_no_product_in_wishlist_content( $wishlist_classes, $widget_id, $empty_text ) { ?>
			<div class="<?php echo implode( ' ', $wishlist_classes ) ?>" data-widget-type="jet-wishlist" data-widget-id="<?php echo $widget_id ?>">
				<h5 class="jet-wishlist-empty"><?php echo apply_filters( 'jet-cw/wishlist/empty_text', $empty_text ) ?></h5>
			</div>
			<?php
		}

		/**
		 * Get products added to wishlist.
		 *
		 * Returns array of products objects that were added to wishlist.
		 *
		 * @since  1.0.0
		 * @since  1.5.3 Added `jet-cw/wishlist/product-id` filter hook.
		 * @access public
		 *
		 * @return array|null
		 */
		public function get_products_added_to_wishlist() {

			$products_in_wishlist = jet_cw()->wishlist_data->get_wish_list();

			if ( empty( $products_in_wishlist ) ) {
				return null;
			}

			$products = [];

			foreach ( $products_in_wishlist as $product_id ) {
				$product_id = apply_filters( 'jet-cw/wishlist/product-id', $product_id );
				$product    = wc_get_product( $product_id );

				if ( ! $product ) {
					continue;
				}

				$products[] = $product;
			}

			return $products;

		}

		/**
		 * Returns the instance.
		 *
		 * @since  1.0.0
		 *
		 * @return object
		 */
		public static function get_instance() {

			// If the single instance hasn't been set, set it now.
			if ( null == self::$instance ) {
				self::$instance = new self();
			}

			return self::$instance;

		}

	}

}

/**
 * Returns instance of Jet_CW_Widgets_Functions
 *
 * @return object
 */
function jet_cw_widgets_functions() {
	return Jet_CW_Widgets_Functions::get_instance();
}
